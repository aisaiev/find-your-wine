import { Controller, Get, Query } from '@nestjs/common';
import { Observable } from 'rxjs';
import { WineQueryDto } from './dto/wine-query.dto';
import { IWineRating } from './model/wine-rating.model';
import { WineService } from './wine.service';

@Controller('wine')
export class WineController {
  constructor(private readonly wineService: WineService) {}

  @Get('/rating')
  public getRating(@Query() query: WineQueryDto): Observable<IWineRating> {
    return this.wineService.getWineRating(query.name);
  }
}
