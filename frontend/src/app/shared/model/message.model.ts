import { MESSAGE_TYPE } from 'src/app/app.constants';

export interface IMessage {
  type: MESSAGE_TYPE;
  data: any;
}
