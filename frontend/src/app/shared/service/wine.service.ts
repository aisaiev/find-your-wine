import { Observable, of } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { fromFetch } from 'rxjs/fetch';
import { API_URL } from '../../app.constants';
import { OkWineInternalData } from '../../models/okwine.model';
import { WineRating } from '../../models/wine-rating.model';
import { WineResidues } from '../../models/wine-residues.model';

export class WineService {
  public getWineRating(wineName: string): Observable<WineRating | null> {
    return fromFetch(`${API_URL}?name=${wineName}`).pipe(
      switchMap((response: Response) => response.json()),
      catchError(() => of(null))
    );
  }

  public getWineResidues(cityId: string, marketId: string, wineData: OkWineInternalData): Observable<WineResidues | null> {
    return fromFetch(`${API_URL}/okwine/residues`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        cityId,
        marketId,
        productId: wineData.key,
        residuesProductId: wineData.pr_id,
      }),
    }).pipe(
      switchMap((response: Response) => response.json()),
      catchError(() => of(null))
    );
  }
}
