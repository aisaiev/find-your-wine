import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BackgroundMessageService {
  onMessage$(alwaysAsync: boolean = false): Observable<{
    message: any;
    sender: chrome.runtime.MessageSender;
    sendResponse: (response?: any) => void;
  }> {
    return new Observable((observer) => {
      const listener = (message: any, sender: chrome.runtime.MessageSender, sendResponse: (response?: any) => void) => {
        observer.next({ message, sender, sendResponse });
        return alwaysAsync ? true : undefined;
      };
      chrome.runtime.onMessage.addListener(listener);
      return () => chrome.runtime.onMessage.removeListener(listener);
    });
  }
}
