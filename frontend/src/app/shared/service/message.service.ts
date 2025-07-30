import { fromEventPattern, Observable } from 'rxjs';
import { ChromeMessageEvent } from '../models/types.model';
import { Message } from '../models/types.model';
import { WineRating } from '../models/types.model';
import { VivinoService } from './vivino.service';

const vivinoService = new VivinoService();

export const getWineRating = (wineName: string): Observable<WineRating> => {
  return vivinoService.getWineRating(wineName);
};

function chromeMessageWrapper(handler: (event: ChromeMessageEvent) => void) {
  return function (message: Message, sender: chrome.runtime.MessageSender, sendResponse: (response?: any) => void) {
    const event: ChromeMessageEvent = { async: false, message, sender, sendResponse };
    handler(event);
    return event.async;
  };
}

export const backgroundMessageListener = fromEventPattern<ChromeMessageEvent>(
  (handler) => {
    const wrapper = chromeMessageWrapper(handler);
    chrome.runtime.onMessage.addListener(wrapper);
    return wrapper;
  },
  (handler, wrapper) => chrome.runtime.onMessage.removeListener(wrapper)
);
