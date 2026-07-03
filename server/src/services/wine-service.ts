import { and, eq } from "drizzle-orm";
import type { WineDto } from "@/providers/dto/wine.dto";
import { VivinoClient } from "@/vivino/vivino-client";
import db from "@/db";
import { wines as winesTable } from "@/db/schema";

const WINE_UPDATE_INTERVAL_MS = 30 * 24 * 60 * 60 * 1000;

const WINE_RETURNING_FIELDS = {
  name: winesTable.name,
  reviewCount: winesTable.reviewCount,
  score: winesTable.score,
  link: winesTable.link,
  searchTerm: winesTable.searchTerm,
  confidence: winesTable.confidence,
};

export class WineService {
  private vivino = new VivinoClient();

  async getWineRatingByProduct(market: string, productId: string, name: string): Promise<WineDto | null> {
    const wines = await db
      .select()
      .from(winesTable)
      .where(and(eq(winesTable.market, market), eq(winesTable.productId, productId)))
      .limit(1);

    if (wines.length) {
      const wine = wines[0];
      const now = new Date();
      if (now.getTime() - wine.updatedAt.getTime() > WINE_UPDATE_INTERVAL_MS) {
        const freshWine = await this.vivino.getRating(name, market, productId);
        if (freshWine) {
          const [updatedWine] = await db
            .update(winesTable)
            .set({ ...freshWine, market, productId })
            .where(eq(winesTable.id, wine.id))
            .returning(WINE_RETURNING_FIELDS);
          if (updatedWine) {
            return { ...updatedWine, confidence: updatedWine.confidence as "high" | "low", searchTerm: name };
          }
        }
      }
      return {
        name: wine.name,
        score: wine.score,
        reviewCount: wine.reviewCount,
        link: wine.link,
        searchTerm: wine.searchTerm,
        confidence: wine.confidence as "high" | "low",
      };
    }

    const wine = await this.vivino.getRating(name, market, productId);
    if (wine) {
      const [createdWine] = await db
        .insert(winesTable)
        .values({ ...wine, market, productId })
        .returning(WINE_RETURNING_FIELDS);
      if (createdWine) {
        return { ...createdWine, confidence: createdWine.confidence as "high" | "low", searchTerm: name };
      }
    }
    return null;
  }
}
