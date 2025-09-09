import { Component, computed, HostBinding, signal } from '@angular/core';
import { WINE_RESUIDUES_CLASS } from '../app.constants';
import { WineResidues } from '../models/wine-residues.model';

@Component({
  selector: 'app-wine-residues-badge',
  templateUrl: './wine-residues-badge.component.html',
  styleUrl: './wine-residues-badge.component.scss',
  host: {
    class: WINE_RESUIDUES_CLASS,
  },
})
export class WineResiduesBadgeComponent {
  wineResidues = signal<WineResidues>(null);
  styles = signal<Record<string, string>>({});
  title = computed(() => {
    const residues = this.wineResidues();
    return `${residues.city}, ${residues.marketAddress}`;
  });

  @HostBinding('style')
  get hostStyles() {
    return this.styles();
  }
}
