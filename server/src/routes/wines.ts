import { Hono } from "hono";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";
import { db } from "../db";
import { wines as winesTable } from "../db/schema/wines";
import { eq } from "drizzle-orm";
import { WineService } from "../services/wine-service";
import type { OkWineResiduesResponse } from "../models/okwine-residues-response.model";
import type { WineResidues } from "../models/wine-residues.model";
import * as cheerio from "cheerio";
import env from '../env.js';

const WINE_UPDATE_INTERVAL_MS = env.WINE_UPDATE_INTERVAL_MINUTES * 60 * 1000;

const WINE_RETURNING_FIELDS = {
  name: winesTable.name,
  reviewCount: winesTable.reviewCount,
  score: winesTable.score,
  link: winesTable.link,
};

const wineQuerySchema = z.object({
  name: z.string().min(3).max(100),
});

const residuesQuerySchema = z.object({
  productId: z.string(),
  residuesProductId: z.string(),
  cityId: z.string(),
  marketId: z.string(),
});

const okwineCitiesSchema = z.object({
  props: z.object({
    pageProps: z.object({
      hydrationData: z.object({
        headerStore: z.object({
          city: z.array(
            z.object({
              oid: z.string(),
              name: z.string(),
            })
          ),
        }),
      }),
    }),
  }),
});

const okwineMarketsQuerySchema = z.object({
  cityOid: z.string(),
});

const okwineMarketsSchema = z.object({
  data: z.array(
    z.object({
      markets: z.array(
        z.object({
          oid: z.string(),
          city: z.string(),
          address: z.string(),
          meta_description: z.string(),
        })
      ),
    })
  ),
});

const wineService = new WineService();

export const winesRoute = new Hono()
  .get(
    "/",
    zValidator("query", wineQuerySchema, (result, c) => {
      if (!result.success) {
        return c.json({ error: "Bad Request" }, 400);
      }
    }),
    async (c) => {
      const result = c.req.valid("query");
      const { name } = result;

      const wines = await db
        .select()
        .from(winesTable)
        .where(eq(winesTable.searchTerm, name))
        .limit(1);

      if (wines.length) {
        const wine = wines[0];
        const now = new Date();
        if (
          now.getTime() - wine.updatedAt.getTime() >
          WINE_UPDATE_INTERVAL_MS
        ) {
          const freshWine = await wineService.getWineRating(name);
          if (freshWine) {
            const [updatedWine] = await db
              .update(winesTable)
              .set(freshWine)
              .where(eq(winesTable.id, wine.id))
              .returning(WINE_RETURNING_FIELDS);
            return c.json(updatedWine);
          }
        }
        return c.json({
          name: wine.name,
          reviewCount: wine.reviewCount,
          score: wine.score,
          link: wine.link,
        });
      }

      const wine = await wineService.getWineRating(name);

      if (wine) {
        const [createdWine] = await db
          .insert(winesTable)
          .values(wine)
          .returning(WINE_RETURNING_FIELDS);
        return c.json(createdWine);
      }

      return c.json(wine);
    }
  )
  .post(
    "okwine/residues",
    zValidator("json", residuesQuerySchema, (result, c) => {
      if (!result.success) {
        return c.json({ error: "Bad Request" }, 400);
      }
    }),
    async (c) => {
      const result = c.req.valid("json");

      try {
        const { productId, residuesProductId, cityId, marketId } = result;
        const url = `https://product.okwine.ua/api/v1/product/${productId}/highlight?product_id=${residuesProductId}&lang=ua`;
        const response = await fetch(url, {
          method: "GET",
          headers: { Cookie: `x-city-set=true; x-city=${cityId};` },
        });
        const res: OkWineResiduesResponse = await response.json();
        const count =
          res.data.residues.markets.find(
            (market) => market.market_id._id === marketId
          )?.count ?? 0;
        return c.json({ count } as WineResidues);
      } catch (error) {
        return c.json({ error: "Failed to fetch okwine residues data" }, 500);
      }
    }
  )
  .get("okwine/cities", async (c) => {
    try {
      const url = "https://okwine.ua/ua/contacts";
      const response = await fetch(url);
      const res = await response.text();
      const $ = cheerio.load(res);
      const jsonText = $("#__NEXT_DATA__").html();
      const data = okwineCitiesSchema.parse(JSON.parse(jsonText!));
      return c.json(data.props.pageProps.hydrationData.headerStore.city);
    } catch (error) {
      return c.json({ error: "Failed to fetch okwine cities data" }, 500);
    }
  })
  .get(
    "okwine/markets/:cityOid",
    zValidator("param", okwineMarketsQuerySchema, (result, c) => {
      if (!result.success) {
        return c.json({ error: "Bad Request" }, 400);
      }
    }),
    async (c) => {
      const result = c.req.valid("param");
      const { cityOid } = result;
      try {
        const url = `https://product.okwine.ua/api/v1/market/markets-city/${cityOid}?lang=ua`;
        const response = await fetch(url);
        if (response.status === 404) {
          return c.notFound();
        }
        const res = await response.json();
        const data = okwineMarketsSchema.parse(res);
        const markets = data.data
          .flatMap((item) => item.markets)
          .sort((a, b) => a.address.localeCompare(b.address));
        return c.json(markets);
      } catch (error) {
        return c.json({ error: "Failed to fetch okwine markets data" }, 500);
      }
    }
  );
