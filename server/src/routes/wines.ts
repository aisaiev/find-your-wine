import { Hono } from "hono";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";
import { WineService } from "@/services/wine-service";
import type { OkWineResiduesResponse } from "@/models/okwine-residues-response.model";
import type { WineResidues } from "@/models/wine-residues.model";
import * as cheerio from "cheerio";

const ratingQuerySchema = z.object({
  market: z.string().min(1).max(50),
  productId: z.string().min(1).max(255),
  name: z.string().min(1).max(200),
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

const api = new Hono();

api.post(
  "/rating",
  zValidator("json", ratingQuerySchema, (result, c) => {
    if (!result.success) {
      return c.json({ error: "Bad Request" }, 400);
    }
  }),
  async (c) => {
    const { market, productId, name } = c.req.valid("json");
    const wine = await wineService.getWineRatingByProduct(market, productId, name);
    if (wine) {
      return c.json({
        name: wine.name,
        score: wine.score,
        reviewCount: wine.reviewCount,
        link: wine.link,
        confidence: wine.confidence,
      });
    }
    return c.json({ error: "Wine not found", name }, 404);
  }
);

api.post(
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
);

api.get("okwine/cities", async (c) => {
  try {
    const url = "https://okwine.ua/ua/contacts";
    const response = await fetch(url);
    const res = await response.text();
    const $ = cheerio.load(res);
    const jsonText = $("#__NEXT_DATA__").html();
    const data = okwineCitiesSchema.parse(JSON.parse(jsonText!));
    const cities = data.props.pageProps.hydrationData.headerStore.city.sort(
      (a, b) => a.name.localeCompare(b.name)
    );
    return c.json(cities);
  } catch (error) {
    return c.json({ error: "Failed to fetch okwine cities data" }, 500);
  }
});

api.get(
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

export default api;
