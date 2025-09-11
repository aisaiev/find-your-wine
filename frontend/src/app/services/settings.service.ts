import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { OkWineSettings } from '../models/okwine-settings';

type SettingsMap = {
  okwineSettings: OkWineSettings;
};

@Injectable({
  providedIn: 'root',
})
export class SettingsService {
  get<T extends keyof SettingsMap>(key: T): Observable<SettingsMap[T]> {
    return new Observable<SettingsMap[T]>((observer) => {
      chrome.storage.sync.get([key], (result) => {
        observer.next(result[key]);
        observer.complete();
      });
    });
  }

  set<T extends keyof SettingsMap>(key: T, value: SettingsMap[T]): Observable<void> {
    return new Observable<void>((observer) => {
      chrome.storage.sync.set({ [key]: value }, () => {
        observer.next();
        observer.complete();
      });
    });
  }
}
