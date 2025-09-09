import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, of } from 'rxjs';

import { API_URL } from '../app.constants';
import { OkWineCity, OkWineMarket } from '../models/okwine.model';

@Injectable({
  providedIn: 'root',
})
export class WineService {
  constructor(private httpClient: HttpClient) {}

  public getOkWineCities(): Observable<OkWineCity[]> {
    return this.httpClient.get<OkWineCity[]>(`${API_URL}/okwine/cities`).pipe(catchError(() => of([])));
  }

  public getOkWineMarkets(cityOid: string): Observable<OkWineMarket[]> {
    return this.httpClient.get<OkWineMarket[]>(`${API_URL}/okwine/markets/${cityOid}`).pipe(catchError(() => of([])));
  }
}
