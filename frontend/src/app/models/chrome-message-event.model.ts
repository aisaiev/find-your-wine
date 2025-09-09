import { Message } from './message.model';

export interface ChromeMessageEvent {
  async: boolean;
  message: Message;
  sender: chrome.runtime.MessageSender;
  sendResponse: (response?: any) => void;
}