import { debounceTime } from 'rxjs/operators';
import { MessageType } from './app/app.constants';
import { backgroundMessageListener } from './app/shared/service/message.service';
import { addAuchanWineRating } from './app/shared/stores/auchan.store';
import { addGoodWineWineRating } from './app/shared/stores/good-wine.store';
import { addRozetkaWineRating } from './app/shared/stores/rozetka.store';
import { addWineTimeWineRating } from './app/shared/stores/wine-time.store';
import { addOkWineRating } from './app/shared/stores/ok-wine.store';

const initialize = (): void => {
  backgroundMessageListener.pipe(debounceTime(500)).subscribe((event) => {
    switch (event.message.type) {
      case MessageType.AuchanPageChanged:
        addAuchanWineRating();
        break;
      case MessageType.WineTimePageChanged:
        addWineTimeWineRating();
        break;
      case MessageType.GoodWinePageChanged:
        addGoodWineWineRating();
        break;
      case MessageType.OkWinePageChanged:
        addOkWineRating();
        break;
      case MessageType.RozetkaPageChanged:
        addRozetkaWineRating();
        break;
      default:
        break;
    }
  });
};

initialize();
