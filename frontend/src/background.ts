import { Host, MessageType, TabStatus } from './app/app.constants';
import { Message } from './app/shared/models/types.model';

function initialize(): void {
  chrome.tabs.onUpdated.addListener(tabsUpdatedListener);
}

function tabsUpdatedListener(tabId: number, changeInfo: chrome.tabs.TabChangeInfo, tab: chrome.tabs.Tab): void {
  if (changeInfo.status === TabStatus.Complete) {
    let type: MessageType | undefined;
    if (tab.url.includes(Host.Auchan)) type = MessageType.AuchanPageChanged;
    else if (tab.url.includes(Host.WineTime)) type = MessageType.WineTimePageChanged;
    else if (tab.url.includes(Host.GoodWine)) type = MessageType.GoodWinePageChanged;
    else if (tab.url.includes(Host.OkWine)) type = MessageType.OkWinePageChanged;
    else if (tab.url.includes(Host.Rozetka)) type = MessageType.RozetkaPageChanged;
    if (type) {
      sendMessageToContent(tabId, { type });
    }
  }
}

function sendMessageToContent(tabId: number, message: Message): void {
  chrome.tabs.sendMessage(tabId, message);
}

initialize();
