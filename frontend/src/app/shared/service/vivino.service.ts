import { Observable, of } from 'rxjs';
import { ajax } from 'rxjs/ajax';
import { catchError, map } from 'rxjs/operators';
import { WineRating } from '../models/types.model';

export class VivinoService {
  private resourceUrl = 'https://find-your-wine.aisaiev.net/api/wines';

  public getWineRating(wineName: string): Observable<WineRating> {
    return ajax.get(`${this.resourceUrl}?name=${wineName}`).pipe(
      map((res) => res.response as WineRating),
      catchError(() => {
        return of(null as unknown as WineRating);
      }),
    );
  }
}
