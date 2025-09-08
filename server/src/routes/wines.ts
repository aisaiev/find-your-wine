import { Hono } from "hono";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";
import { db } from "../db/index.js";
import { wines as winesTable } from "../db/schema/wines.js";
import { eq } from "drizzle-orm";
import { WineService } from "../services/wine-service.js";
import "dotenv/config";

const WINE_UPDATE_INTERVAL_MS =
  Number(process.env.WINE_UPDATE_INTERVAL_MINUTES!) * 60 * 1000;

const WINE_RETURNING_FIELDS = {
  name: winesTable.name,
  reviewCount: winesTable.reviewCount,
  score: winesTable.score,
  link: winesTable.link,
};

const querySchema = z.object({
  name: z.string().min(3).max(100),
});

const wineService = new WineService();

export const winesRoute = new Hono().get(
  "/",
  zValidator("query", querySchema),
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
      if (now.getTime() - wine.updatedAt.getTime() > WINE_UPDATE_INTERVAL_MS) {
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
);
