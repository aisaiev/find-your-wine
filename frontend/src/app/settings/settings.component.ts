import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { WineService } from '../services/wine.service';
import { delay, filter, switchMap, take, tap } from 'rxjs';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { OkWineCity, OkWineMarket } from '../models/okwine';
import { SettingsService } from '../services/settings.service';
import { OkWineSettings } from '../models/okwine-settings';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-settings',
  imports: [ReactiveFormsModule],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss',
})
export class SettingsComponent implements OnInit {
  private fb = inject(FormBuilder);
  private wineService = inject(WineService);
  private settingsService = inject(SettingsService);
  private destroyRef = inject(DestroyRef);

  okwineForm = this.fb.group({
    cityId: ['', [Validators.required]],
    marketId: ['', [Validators.required]],
    showResidues: [false, [Validators.required]],
  });
  okwineCities = signal<OkWineCity[]>([]);
  okwineMarkets = signal<OkWineMarket[]>([]);
  isSaving = signal(false);
  isLoadingCities = signal(false);

  ngOnInit(): void {
    this.loadSettings();
    this.okwineForm.controls.cityId.valueChanges
      .pipe(
        filter((cityId) => !!cityId),
        tap(() => this.okwineForm.controls.marketId.setValue(null)),
        switchMap((cityId) => this.wineService.getOkWineMarkets(cityId)),
        tap((markets) => this.okwineMarkets.set(markets)),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe();
    this.loadCities();
  }

  onSubmitOkwineForm(): void {
    this.isSaving.set(true);
    const settings: OkWineSettings = {
      ...this.okwineForm.getRawValue(),
      city: this.okwineCities().find((c) => c.oid === this.okwineForm.value.cityId).name,
      marketAddress: this.okwineMarkets().find((m) => m.oid === this.okwineForm.value.marketId)?.address,
    };
    this.settingsService
      .set('okwineSettings', settings)
      .pipe(delay(250))
      .subscribe(() => this.isSaving.set(false));
  }

  private loadCities(): void {
    this.isLoadingCities.set(true);
    this.wineService
      .getOkWineCities()
      .pipe(take(1))
      .subscribe((cities) => {
        this.okwineCities.set(cities);
        this.isLoadingCities.set(false);
      });
  }

  private loadSettings(): void {
    this.settingsService
      .get('okwineSettings')
      .pipe(
        tap((settings) => {
          if (settings) {
            this.okwineForm.patchValue(settings);
          }
        })
      )
      .subscribe();
  }
}
