import { Injectable } from '@nestjs/common';
import { map, Observable } from 'rxjs';
import { IVivinoItem } from 'src/vivino/dto/vivino.dto';
import { VivinoService } from 'src/vivino/vivino.service';
import { IWineRating } from './model/wine-rating.model';

@Injectable()
export class WineService {
  constructor(private readonly vivinoService: VivinoService) {}

  public getWineRating(name: string): Observable<IWineRating> {
    return this.vivinoService
      .searchWine(name)
      .pipe(map((vivinoList) => this.getVivinoRating(vivinoList)));
  }

  private getVivinoRating(vivinoList: IVivinoItem[]): IWineRating {
    const ratings: IWineRating[] = vivinoList.map((vivino) => {
      const name = vivino.vintages.length > 0 ? vivino.vintages[0].name : '';
      const score = vivino.statistics.ratings_average;
      const reviewsCount = vivino.statistics.ratings_count;
      const link =
        vivino.vintages.length > 0
          ? `https://www.vivino.com/wines/${vivino.vintages[0].id}?cart_item_source=text-search`
          : 'https://www.vivino.com';
      return {
        link,
        name,
        reviewsCount,
        score,
      };
    });
    return ratings.length ? ratings[0] : null;
  }
}
