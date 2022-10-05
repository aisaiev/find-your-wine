import { Observable, of } from 'rxjs';
import { ajax } from 'rxjs/ajax';
import { catchError, map } from 'rxjs/operators';
import { IWineRating } from '../model/wine-rating.model';

export class VivinoService {
  private resourceUrl = 'https://find-your-wine.pp.ua/api/wine';

  public getWineRating(wineName: string): Observable<IWineRating | undefined> {
    return ajax.get(`${this.resourceUrl}/rating?name=${wineName}`).pipe(
      map(res => res.response),
      catchError(() => {
        return of(undefined);
      })
    );
  }
}
