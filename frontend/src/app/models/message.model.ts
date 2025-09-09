import { MessageType } from '../app.constants';

export interface Message {
  type: MessageType;
  [key: string]: any;
}