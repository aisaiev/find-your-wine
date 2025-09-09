import { Component, computed, signal, HostBinding, HostListener } from '@angular/core';
import { VIVINO_BAGE_CLASS } from '../app.constants';
import { WineRating } from '../models/wine-rating.model';

@Component({
  selector: 'app-wine-rating-badge',
  templateUrl: './wine-rating-badge.component.html',
  styleUrl: './wine-rating-badge.component.scss',
  host: {
    class: VIVINO_BAGE_CLASS,
  },
})
export class WineRatingBadgeComponent {
  wineRating = signal<WineRating>(null);
  styles = signal<Record<string, string>>({});

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

  badgeColor = computed(() => {
    return this.wineRating().score >= 0 && this.wineRating().score < 3 ? '#FFAB00' : '#00C853';
  });

  badgePercentage = computed(() => {
    return +((this.wineRating().score * 100) / 5).toFixed(2);
  });
}
