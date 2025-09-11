import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, Observable, of, tap } from 'rxjs';
import { API_URL } from '../app.constants';
import { OkWineCity, OkWineMarket } from '../models/okwine';
import { WineRating } from '../models/wine-rating';
import { WineResidues } from '../models/wine-residues';
import { OkWineResiduesQuery } from '../models/okwine-residues-query';
import { OkwineResiduesCacheService } from './okwine-residues-cache.service';

@Injectable({
  providedIn: 'root',
})
export class WineService {
  private readonly httpClient = inject(HttpClient);
  private readonly okWineResiduesCache = inject(OkwineResiduesCacheService);

  getWineRating(wineName: string): Observable<WineRating> {
    return this.httpClient.get<WineRating>(`${API_URL}?name=${encodeURIComponent(wineName)}`).pipe(catchError(() => of(null)));
  }

  getOkWineResidues(data: OkWineResiduesQuery): Observable<WineResidues> {
    const cached = this.okWineResiduesCache.get(data);
    if (cached) {
      return of(cached);
    }
    return this.httpClient
      .post<WineResidues>(`${API_URL}/okwine/residues`, {
        cityId: data.cityId,
        marketId: data.marketId,
        productId: data.data.id,
        residuesProductId: data.data.pr_id,
      })
      .pipe(
        tap((res) => {
          if (res) {
            this.okWineResiduesCache.set(data, res);
          }
        }),
        catchError(() => of(null))
      );
  }

  getOkWineCities(): Observable<OkWineCity[]> {
    return this.httpClient.get<OkWineCity[]>(`${API_URL}/okwine/cities`).pipe(catchError(() => of([])));
  }

  getOkWineMarkets(cityOid: string): Observable<OkWineMarket[]> {
    return this.httpClient.get<OkWineMarket[]>(`${API_URL}/okwine/markets/${cityOid}`).pipe(catchError(() => of([])));
  }
}
