import { fromEventPattern, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { MESSAGE_TYPE } from 'src/app/app.constants';
import { IMessageEvent } from '../model/message-event.model';
import { IMessage } from '../model/message.model';
import { IWineRating } from '../model/wine-rating.model';

export const getWineRating = (wineName: string): Observable<IWineRating> => {
  return new Observable(
    observer => chrome.runtime.sendMessage({
      type: MESSAGE_TYPE.GET_WINE_RATING,
      data: wineName
    }, rating => {
      observer.next(rating);
      observer.complete();
    })
  );
};

export const backgroundMessageListener = fromEventPattern(
  handler => {
    const wrapper = (message: IMessage, sender: chrome.runtime.MessageSender, sendResponse: (response?: any) => void) => {
      const event = { async: true, message, sender, sendResponse };
      handler(event);
      return event.async;
    };
    chrome.runtime.onMessage.addListener(wrapper);
    return wrapper;
  },
  (handler, wrapper) => chrome.runtime.onMessage.removeListener(wrapper)
).pipe(
  map(res => res as IMessageEvent)
);

