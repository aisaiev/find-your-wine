import { Component, computed, signal, HostBinding, HostListener, inject, effect } from '@angular/core';
import { VIVINO_BAGE_CLASS } from '../../app.constants';
import { WineRating } from '../../models/wine-rating';
import { WineService, type MarketRatingQuery } from '../../services/wine.service';
import { take, tap } from 'rxjs';

@Component({
  selector: 'app-wine-rating-badge',
  templateUrl: './wine-rating-badge.component.html',
  styleUrl: './wine-rating-badge.component.scss',
  host: {
    class: VIVINO_BAGE_CLASS,
  },
})
export class WineRatingBadgeComponent {
  private readonly wineService = inject(WineService);

  readonly query = signal<MarketRatingQuery>(null);
  readonly styles = signal<Record<string, string>>({});
  readonly wineRating = signal<WineRating>(null);

  readonly badgeColor = computed(() => {
    if (!this.wineRating()) return '#ccc';
    return this.wineRating().score >= 0 && this.wineRating().score < 3 ? '#FFAB00' : '#00C853';
  });

  readonly badgePercentage = computed(() => {
    if (!this.wineRating()) return 0;
    return +((this.wineRating().score * 100) / 5).toFixed(2);
  });

  readonly isLowConfidence = computed(() => {
    return this.wineRating()?.confidence === 'low';
  });

  @HostBinding('style')
  get hostStyles() {
    return { ...this.styles()};
  }

  @HostListener('click', ['$event'])
  onHostClick(event: MouseEvent) {
    event.stopPropagation();
    event.preventDefault();
    if (this.wineRating()?.link) {
      window.open(this.wineRating().link, '_blank');
    }
  }

  constructor() {
    effect(() => this.getWineRating());
  }

  private getWineRating() {
    const q = this.query();
    if (!q) return;
    this.wineService
      .getMarketRating(q)
      .pipe(
        take(1),
        tap((rating) => this.wineRating.set(rating))
      )
      .subscribe();
  }
}
