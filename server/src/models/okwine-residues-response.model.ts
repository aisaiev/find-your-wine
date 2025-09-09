export interface OkWineResiduesResponse {
  data: OkWineResiduesData;
}

interface OkWineResiduesData {
  residues: OkWineResidue;
}

interface OkWineResidue {
  markets: OkWineMarket[];
  city: OkWineCity;
}

interface OkWineMarket {
  count: number;
  market_id: OkWineMarketId;
}

interface OkWineMarketId {
  _id: string;
  meta: OkWineMarketIdMeta;
}

interface OkWineMarketIdMeta {
  title: string;
}

interface OkWineCity {
  city_id: OkWineCityId;
}

interface OkWineCityId {
  _id: string;
  name: string;
}
