export interface IVivinoResponse {
  query: string;
  hits: IVivino[];
}

export interface IVivino {
  id: number;
  alcohol: number;
  vintages: IVivinoVintage[];
  statistics: IVivinoStatistics;
}

interface IVivinoVintage {
  id: number;
  name: string;
}

interface IVivinoStatistics {
  status: string;
  ratings_average: number;
  ratings_count: number;
}
