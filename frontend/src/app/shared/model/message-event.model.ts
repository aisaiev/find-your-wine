import { IMessage } from './message.model';

export interface IMessageEvent {
  message: IMessage;
  sender: chrome.runtime.MessageSender;
  sendResponse: (response?: any) => void;
}
