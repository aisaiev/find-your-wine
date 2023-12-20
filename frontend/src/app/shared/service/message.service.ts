import { fromEventPattern, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { IMessageEvent } from '../model/message-event.model';
import { IMessage } from '../model/message.model';
import { IWineRating } from '../model/wine-rating.model';
import { VivinoService } from './vivino.service';

const vivinoService = new VivinoService();

export const getWineRating = (wineName: string): Observable<IWineRating> => {
  return vivinoService.getWineRating(wineName);
};

export const backgroundMessageListener = fromEventPattern(
  (handler) => {
    const wrapper = (message: IMessage, sender: chrome.runtime.MessageSender, sendResponse: (response?: any) => void) => {
      const event = { async: false, message, sender, sendResponse };
      handler(event);
      return event.async;
    };
    chrome.runtime.onMessage.addListener(wrapper);
    return wrapper;
  },
  (handler, wrapper) => chrome.runtime.onMessage.removeListener(wrapper),
).pipe(map((res) => res as IMessageEvent));
