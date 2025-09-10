import type { WineDto } from "@/providers/dto/wine.dto";
import { VivinoClient } from "@/vivino/vivino-client";

export class WineService {
  private vivino = new VivinoClient();

  async getWineRating(name: string): Promise<WineDto | null> {
    return await this.vivino.getRating(name);
  }
}
