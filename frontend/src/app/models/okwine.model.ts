export interface OkWineInternalData {
  key: string;
  pr_id: string;
  utp: string;
}

export interface OkWineCity {
  oid: string;
  name: string;
}

export interface OkWineMarket {
  oid: string;
  city: string;
  address: string;
  meta_description: string;
}