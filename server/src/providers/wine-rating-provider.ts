import type { WineDto } from "./dto/wine.dto";

export abstract class WineRatingProvider {
  abstract getRating(name: string, market: string, productId: string): Promise<WineDto | null>;
}
