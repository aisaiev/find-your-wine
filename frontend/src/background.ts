import { Host, MessageType, TabStatus } from './app/app.constants';
import { IMessage } from './app/shared/model/message.model';

function initialize(): void {
  chrome.tabs.onUpdated.addListener(tabsUpdatedListener);
}

function tabsUpdatedListener(tabId: number, changeInfo: chrome.tabs.TabChangeInfo, tab: chrome.tabs.Tab): void {
  if (changeInfo.status === TabStatus.Complete) {
    if (tab.url.includes(Host.Auchan)) {
      sendMessageToContent(tabId, {
        type: MessageType.AuchanPageChanged,
      });
    } else if (tab.url.includes(Host.WineTime)) {
      sendMessageToContent(tabId, {
        type: MessageType.WineTimePageChanged,
      });
    } else if (tab.url.includes(Host.GoodWine)) {
      sendMessageToContent(tabId, {
        type: MessageType.GoodWinePageChanged,
      });
    } else if (tab.url.includes(Host.OkWine)) {
      sendMessageToContent(tabId, {
        type: MessageType.OkWinePageChanged,
      });
    } else if (tab.url.includes(Host.Rozetka)) {
      sendMessageToContent(tabId, {
        type: MessageType.RozetkaPageChanged,
      });
    }
  }
}

function sendMessageToContent(tabId: number, message: IMessage): void {
  chrome.tabs.sendMessage(tabId, message);
}

initialize();
