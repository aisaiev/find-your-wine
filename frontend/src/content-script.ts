import { debounceTime } from 'rxjs/operators';
import { MESSAGE_TYPE } from './app/app.constants';
import { backgroundMessageListener } from './app/shared/service/message.service';
import { addAuchanWineRating } from './app/shared/stores/auchan.store';
import { addGoodWineWineRating } from './app/shared/stores/good-wine.store';
import { addRozetkaWineRating } from './app/shared/stores/rozetka.store';
import { addWineTimeWineRating } from './app/shared/stores/wine-time.store';

const initialize = (): void => {
  backgroundMessageListener.pipe(
    debounceTime(500)
  ).subscribe(event => {
    if (event.message.type === MESSAGE_TYPE.AUCHAN_PAGE_CHANGED) {
      addAuchanWineRating();
    } else if (event.message.type === MESSAGE_TYPE.WINE_TIME_PAGE_CHANGED) {
      addWineTimeWineRating();
    } else if (event.message.type === MESSAGE_TYPE.GOOD_WINE_PAGE_CHANGED) {
      addGoodWineWineRating();
    } else if (event.message.type === MESSAGE_TYPE.ROZETKA_PAGE_CHANGED) {
      addRozetkaWineRating();
    } else {
      // nothing to do.
    }
  });
}

initialize();
