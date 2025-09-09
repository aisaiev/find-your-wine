import { fromEventPattern } from 'rxjs';
import { ChromeMessageEvent } from '../../models/chrome-message-event.model';
import { Message } from '../../models/message.model';

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
