import type { WineDto } from "./dto/wine.dto";

export abstract class WineRatingProvider {
  abstract getRating(name: string): Promise<WineDto | null>;
}
