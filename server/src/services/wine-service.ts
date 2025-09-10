import type { WineDto } from "@/providers/dto/wine.dto";
import { VivinoClient } from "@/vivino/vivino-client";

export class WineService {
  private vivino = new VivinoClient();

  async getWineRating(name: string, delayMs = 0): Promise<WineDto | null> {
    if (delayMs > 0) await this.delay(delayMs);
    return await this.vivino.getRating(name);
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
