import { MessageType } from '../../app.constants';

export interface ChromeMessageEvent {
  async: boolean;
  message: Message;
  sender: chrome.runtime.MessageSender;
  sendResponse: (response?: any) => void;
}

export interface Message {
  type: MessageType;
}

export interface WineRating {
  name: string;
  score: number;
  reviewCount: number;
  link: string;
}
