import { WineStore } from '../app.constants';

export type Message = { type: 'WineStoreLoaded'; store: WineStore } | { type: 'GetOkwineInternalData'; selector: string };
