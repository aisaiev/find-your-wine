import { VivinoClient } from "@/vivino/vivino-client";

export class WineService {
  private vivino = new VivinoClient();

  async getWineRating(name: string) {
    return this.vivino.getRating(name);
  }
}
