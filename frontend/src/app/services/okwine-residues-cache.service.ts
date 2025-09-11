import { Injectable } from '@angular/core';
import { WineResidues } from '../models/wine-residues';
import { OkWineResiduesQuery } from '../models/okwine-residues-query';

type CacheEntry = {
  value: WineResidues;
  timestamp: number;
};

@Injectable({
  providedIn: 'root',
})
export class OkwineResiduesCacheService {
  private CACHE_KEY = 'okwine_residues_cache';
  private CACHE_TTL_MS = 60 * 60 * 1000;

  private cache: Record<string, CacheEntry> = {};

  constructor() {
    this.loadCache();
  }

  get(query: OkWineResiduesQuery): WineResidues | null {
    const key = this.key(query);
    const entry = this.cache[key];
    if (entry && Date.now() - entry.timestamp < this.CACHE_TTL_MS) {
      return entry.value;
    }
    return null;
  }

  set(query: OkWineResiduesQuery, value: WineResidues): void {
    const key = this.key(query);
    this.cache[key] = {
      value,
      timestamp: Date.now(),
    };
    this.saveCache();
  }

  private key(query: OkWineResiduesQuery): string {
    return `${query.cityId}_${query.marketId}_${query.data.id}_${query.data.pr_id}`;
  }

  private loadCache(): void {
    try {
      const raw = localStorage.getItem(this.CACHE_KEY);
      this.cache = raw ? JSON.parse(raw) : {};
    } catch {
      this.cache = {};
    }
  }

  private saveCache(): void {
    try {
      localStorage.setItem(this.CACHE_KEY, JSON.stringify(this.cache));
    } catch {}
  }
}
