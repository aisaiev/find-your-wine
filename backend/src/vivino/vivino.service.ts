import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { catchError, map, Observable, of, pluck } from 'rxjs';
import { IVivino, IVivinoResponse } from './dto/vivino.dto';

const URL =
  'https://9takgwjuxl-dsn.algolia.net/1/indexes/WINES_prod/query?x-algolia-agent=Algolia%20for%20JavaScript%20(3.33.0)%3B%20Browser%20(lite)&x-algolia-application-id=9TAKGWJUXL&x-algolia-api-key=60c11b2f1068885161d95ca068d3a6ae';

@Injectable()
export class VivinoService {
  constructor(private readonly httpService: HttpService) {}

  searchWine(name: string): Observable<IVivino[]> {
    const data = {
      params: `query=${encodeURIComponent(name)}&hitsPerPage=6`,
    };
    return this.httpService.post<IVivinoResponse>(URL, data).pipe(
      map((response) => response.data),
      pluck('hits'),
      catchError(() => {
        return of([]);
      }),
    );
  }
}
