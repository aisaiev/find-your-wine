import { Observable, of } from 'rxjs';
import { ajax } from 'rxjs/ajax';
import { catchError, map } from 'rxjs/operators';
import { IWineRating } from '../model/wine-rating.model';

export class VivinoService {
  private resourceUrl = 'https://find-your-wine.aisaiev.net/api/wine';

  public getWineRating(wineName: string): Observable<IWineRating> {
    return ajax.get(`${this.resourceUrl}/rating?name=${wineName}`).pipe(
      map((res) => res.response as IWineRating),
      catchError(() => {
        return of(null as unknown as IWineRating);
      }),
    );
  }
}
