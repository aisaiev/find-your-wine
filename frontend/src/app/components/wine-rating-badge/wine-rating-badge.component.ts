import { Component, computed, signal, HostBinding, HostListener, inject, effect } from '@angular/core';
import { VIVINO_BAGE_CLASS } from '../../app.constants';
import { WineRating } from '../../models/wine-rating';
import { WineService } from '../../services/wine.service';
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

  readonly wineName = signal<string>(null);
  readonly styles = signal<Record<string, string>>({});
  readonly wineRating = signal<WineRating>(null);

  readonly badgeColor = computed(() => {
    return this.wineRating().score >= 0 && this.wineRating().score < 3 ? '#FFAB00' : '#00C853';
  });

  readonly badgePercentage = computed(() => {
    return +((this.wineRating().score * 100) / 5).toFixed(2);
  });

  @HostBinding('style')
  get hostStyles() {
    return this.styles();
  }

  @HostListener('click', ['$event'])
  onHostClick(event: MouseEvent) {
    event.stopPropagation();
    event.preventDefault();
    window.open(this.wineRating().link, '_blank');
  }

  constructor() {
    effect(() => this.getWineRating());
  }

  private getWineRating() {
    if (!this.wineName()) return;
    this.wineService
      .getWineRating(this.wineName())
      .pipe(
        take(1),
        tap((rating) => this.wineRating.set(rating))
      )
      .subscribe();
  }
}
