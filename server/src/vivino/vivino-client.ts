import type { VivinoResponse } from "./dto/vivino-response.dto";
import type { WineDto } from "@/providers/dto/wine.dto";
import type { WineRatingProvider } from "@/providers/wine-rating-provider";

export class VivinoClient implements WineRatingProvider {
  private readonly BASE_URL =
    "https://9takgwjuxl-dsn.algolia.net/1/indexes/WINES_prod/query?x-algolia-agent=Algolia%20for%20JavaScript%20(3.33.0)%3B%20Browser%20(lite)&x-algolia-application-id=9TAKGWJUXL&x-algolia-api-key=60c11b2f1068885161d95ca068d3a6ae";

  async getRating(name: string, market: string, productId: string): Promise<WineDto | null> {
    try {
      const response = await fetch(this.BASE_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          params: `query=${encodeURIComponent(name)}&hitsPerPage=3&getRankingInfo=1`,
        }),
      });

      if (!response.ok) {
        console.error("Error fetching vivino wine data:", response.statusText);
        return null;
      }

      const result: VivinoResponse = await response.json();
      if (!result.hits.length) return null;

      const wine = result.hits[0];
      const vintage = wine.vintages[0];
      const topRatingCount = wine.statistics.ratings_count;

      let confidence: "high" | "low" = "low";
      if (result.hits.length === 1) {
        confidence = "high";
      } else if (result.hits[0]._rankingInfo && result.hits[1]._rankingInfo) {
        const topExact = result.hits[0]._rankingInfo.nbExactWords;
        const secondExact = result.hits[1]._rankingInfo.nbExactWords;
        if (topExact > secondExact) {
          confidence = "high";
        } else {
          const queryLower = name.toLowerCase().normalize("NFD").replace(/\p{Diacritic}/gu, "");
          const topName = vintage?.name ?? "";
          const topNormalized = topName.toLowerCase().normalize("NFD").replace(/\p{Diacritic}/gu, "");
          const queryWords = [...new Set(queryLower.split(/\s+/).filter((w) => w.length >= 3))];
          const topWords = [...new Set(topNormalized.split(/\s+/).filter((w) => w.length >= 3))];
          const commonWords = queryWords.filter((w) => topWords.includes(w));
          const wordOverlap = queryWords.length > 0 ? commonWords.length / queryWords.length : 0;
          if (wordOverlap >= 0.75) {
            confidence = "high";
          } else if (topRatingCount > result.hits[1].statistics.ratings_count * 5) {
            confidence = "high";
          }
        }
      }

      return {
        name: vintage.name,
        score: wine.statistics.ratings_average,
        reviewCount: topRatingCount,
        link: vintage
          ? `https://www.vivino.com/wines/${vintage.id}?cart_item_source=text-search`
          : "https://www.vivino.com",
        searchTerm: name,
        confidence,
      };
    } catch (error) {
      console.error("Error fetching vivino wine data:", error);
      return null;
    }
  }
}
