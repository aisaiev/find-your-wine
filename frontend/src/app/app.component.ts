import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { BackgroundMessageService } from './services/background-message.service';
import { debounceTime } from 'rxjs';
import { WineStore } from './app.constants';
import { WinetimeService } from './services/winetime.service';
import { Message } from './models/message';
import { AuchanService } from './services/auchan.service';
import { GoodwineService } from './services/goodwine.service';
import { RozetkaService } from './services/rozetka.service';
import { OkwineService } from './services/okwine.service';
import { WineStoreService } from './services/contract/wine-store-service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  private destroyRef = inject(DestroyRef);
  private backgroundMessageService = inject(BackgroundMessageService);

  private serviceMap: Record<WineStore, WineStoreService> = {
    [WineStore.WineTime]: inject(WinetimeService),
    [WineStore.Auchan]: inject(AuchanService),
    [WineStore.GoodWine]: inject(GoodwineService),
    [WineStore.Rozetka]: inject(RozetkaService),
    [WineStore.OkWine]: inject(OkwineService),
  };

  ngOnInit(): void {
    this.backgroundMessageService
      .onMessage$()
      .pipe(debounceTime(500), takeUntilDestroyed(this.destroyRef))
      .subscribe(({ message }: { message: Message }) => {
        if (message.type !== 'WineStoreLoaded') return;
        const service = this.serviceMap[message.store];
        service?.addRating();
      });
  }
}
