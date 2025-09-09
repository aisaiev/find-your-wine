import { Host, MessageType, TabStatus } from './app/app.constants';
import { Message } from './app/models/message.model';
import { getOkWineWinesInternalData } from './app/shared/utils/store.util';

function initialize(): void {
  chrome.tabs.onUpdated.addListener(tabsUpdatedListener);
  chrome.runtime.onMessage.addListener(messagesListener);
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

function messagesListener(message: Message, sender: chrome.runtime.MessageSender, sendResponse: (response?: any) => void): boolean {
  if (message.type === MessageType.GetOkWineInternalData) {
    chrome.scripting
      .executeScript({
        target: { tabId: sender.tab.id },
        func: getOkWineWinesInternalData,
        args: [message['selector']],
        world: 'MAIN',
      })
      .then((response) => {
        sendResponse(response[0].result);
      });
  }
  return true;
}

function sendMessageToContent(tabId: number, message: Message): void {
  chrome.tabs.sendMessage(tabId, message);
}

initialize();
