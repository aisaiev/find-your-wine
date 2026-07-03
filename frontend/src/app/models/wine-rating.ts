export interface WineRating {
  name: string;
  score: number;
  reviewCount: number;
  link: string;
  confidence?: 'high' | 'low';
}
