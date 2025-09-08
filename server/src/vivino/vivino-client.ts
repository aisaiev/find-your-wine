import type { VivinoResponse } from "./dto/vivino-response.dto.js";
import type { WineDto } from "../providers/dto/wine.dto.js";
import type { WineRatingProvider } from "../providers/wine-rating-provider.js";

export class VivinoClient implements WineRatingProvider {
  private static readonly BASE_URL =
    "https://9takgwjuxl-dsn.algolia.net/1/indexes/WINES_prod/query?x-algolia-agent=Algolia%20for%20JavaScript%20(3.33.0)%3B%20Browser%20(lite)&x-algolia-application-id=9TAKGWJUXL&x-algolia-api-key=60c11b2f1068885161d95ca068d3a6ae";

  async getRating(name: string): Promise<WineDto | null> {
    try {
      const response = await fetch(VivinoClient.BASE_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          params: `query=${encodeURIComponent(name)}&hitsPerPage=1`,
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

      return {
        name: vintage.name,
        score: wine.statistics.ratings_average,
        reviewCount: wine.statistics.ratings_count,
        link: vintage
          ? `https://www.vivino.com/wines/${vintage.id}?cart_item_source=text-search`
          : "https://www.vivino.com",
        searchTerm: name,
      };
    } catch (error) {
      console.error("Error fetching vivino wine data:", error);
      return null;
    }
  }
}
