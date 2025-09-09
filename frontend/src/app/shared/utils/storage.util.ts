import { Observable } from 'rxjs';
import { OkWineSettings } from '../../models/okwine-settings.model';

type SettingsMap = {
  okwineSettings: OkWineSettings;
};

export class StorageUtil {
  static getSettings<T extends keyof SettingsMap>(key: T): Observable<SettingsMap[T]> {
    return new Observable<SettingsMap[T]>((observer) => {
      chrome.storage.sync.get([key], (result) => {
        observer.next(result[key]);
        observer.complete();
      });
    });
  }

  static setSettings<T extends keyof SettingsMap>(key: T, value: SettingsMap[T]): Observable<void> {
    return new Observable<void>((observer) => {
      chrome.storage.sync.set({ [key]: value }, () => {
        observer.next();
        observer.complete();
      });
    });
  }
}
