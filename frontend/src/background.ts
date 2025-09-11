import { Host, TabStatus, WineStore } from './app/app.constants';
import { Message } from './app/models/message';
import { getOkwineInternalData } from './app/shared/utils/store.util';

function initialize(): void {
  chrome.tabs.onUpdated.addListener(tabsUpdatedListener);
  chrome.runtime.onMessage.addListener(messagesListener);
}

function tabsUpdatedListener(tabId: number, changeInfo: chrome.tabs.TabChangeInfo, tab: chrome.tabs.Tab): void {
  if (changeInfo.status !== TabStatus.Complete || !tab.url) return;

  const hostTypeMap: { [key: string]: WineStore } = {
    [Host.Auchan]: WineStore.Auchan,
    [Host.WineTime]: WineStore.WineTime,
    [Host.GoodWine]: WineStore.GoodWine,
    [Host.OkWine]: WineStore.OkWine,
    [Host.Rozetka]: WineStore.Rozetka,
  };

  const store = Object.entries(hostTypeMap).find(([host]) => tab.url.includes(host))?.[1];

  if (store) {
    chrome.tabs.sendMessage<Message>(tabId, { type: 'WineStoreLoaded', store });
  }
}

function messagesListener(message: Message, sender: chrome.runtime.MessageSender, sendResponse: (response?: any) => void): boolean {
  if (message.type === 'GetOkwineInternalData') {
    chrome.scripting
      .executeScript({
        target: { tabId: sender.tab.id },
        func: getOkwineInternalData,
        args: [message['selector']],
        world: 'MAIN',
      })
      .then((response) => {
        sendResponse(response[0].result);
      });
  }
  return true;
}

initialize();
