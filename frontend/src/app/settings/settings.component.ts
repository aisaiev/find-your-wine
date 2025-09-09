import { Component, OnDestroy, OnInit, signal } from '@angular/core';
import { WineService } from '../services/wine.service';
import { filter, Subject, switchMap, take, takeUntil, tap } from 'rxjs';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { OkWineCity, OkWineMarket } from '../models/okwine.model';
import { StorageUtil } from '../shared/utils/storage.util';
import { OkWineSettings } from '../models/okwine-settings.model';

@Component({
  selector: 'app-settings',
  imports: [ReactiveFormsModule],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss',
})
export class SettingsComponent implements OnInit, OnDestroy {
  okwineForm = this.fb.group({
    cityId: ['', [Validators.required]],
    marketId: ['', [Validators.required]],
    showResidues: [false, [Validators.required]],
  });
  okwineCities = signal<OkWineCity[]>([]);
  okwineMarkets = signal<OkWineMarket[]>([]);

  private destroy$ = new Subject<void>();

  constructor(private fb: FormBuilder, private wineService: WineService) {}

  ngOnInit(): void {
    this.loadSettings();
    this.okwineForm.controls.cityId.valueChanges
      .pipe(
        filter((cityId) => !!cityId),
        tap(() => this.okwineForm.controls.marketId.setValue(null)),
        switchMap((cityId) => this.wineService.getOkWineMarkets(cityId)),
        tap((markets) => this.okwineMarkets.set(markets)),
        takeUntil(this.destroy$)
      )
      .subscribe();
    this.loadCities();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadCities(): void {
    this.wineService
      .getOkWineCities()
      .pipe(take(1))
      .subscribe((cities) => this.okwineCities.set(cities));
  }

  private loadSettings(): void {
    StorageUtil.getSettings('okwineSettings')
      .pipe(
        tap((settings) => {
          if (settings) {
            this.okwineForm.patchValue(settings);
          }
        })
      )
      .subscribe();
  }

  onSubmitOkwineForm(): void {
    const settings: OkWineSettings = {
      ...this.okwineForm.getRawValue(),
      city: this.okwineCities().find((c) => c.oid === this.okwineForm.value.cityId).name,
      marketAddress: this.okwineMarkets().find((m) => m.oid === this.okwineForm.value.marketId)?.address,
    };
    StorageUtil.setSettings('okwineSettings', settings).subscribe();
  }
}
