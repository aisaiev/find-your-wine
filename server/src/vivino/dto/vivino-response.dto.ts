export interface VivinoResponse {
  hits: VivinoItem[];
}

interface VivinoItem {
  vintages: VivinoVintage[];
  statistics: VivinoStatistics;
  _rankingInfo?: RankingInfo;
}

interface VivinoVintage {
  id: number;
  name: string;
}

interface VivinoStatistics {
  ratings_average: number;
  ratings_count: number;
}

interface RankingInfo {
  nbExactWords: number;
}
