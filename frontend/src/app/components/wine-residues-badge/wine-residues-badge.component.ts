import { Component, effect, HostBinding, inject, signal } from '@angular/core';
import { WINE_RESIDUES_CLASS } from '../../app.constants';
import { WineResidues } from '../../models/wine-residues';
import { WineService } from '../../services/wine.service';
import { WineResiduesQuery } from '../../models/wine-residues-query';
import { take, tap } from 'rxjs';

@Component({
  selector: 'app-wine-residues-badge',
  templateUrl: './wine-residues-badge.component.html',
  styleUrl: './wine-residues-badge.component.scss',
  host: {
    class: WINE_RESIDUES_CLASS,
  },
})
export class WineResiduesBadgeComponent {
  private readonly wineService = inject(WineService);

  readonly queryData = signal<WineResiduesQuery>(null);
  readonly wineResidues = signal<WineResidues>(null);
  readonly styles = signal<Record<string, string>>({});

  @HostBinding('style')
  get hostStyles(): Record<string, string> {
    return this.styles();
  }

  constructor() {
    effect(() => this.getWineResidues());
  }

  private getWineResidues(): void {
    if (!this.queryData()) return;
    if (this.queryData().type === 'okwine') {
      this.wineService
        .getOkWineResidues(this.queryData().data)
        .pipe(
          take(1),
          tap((residues) => this.wineResidues.set(residues))
        )
        .subscribe();
    }
  }
}
