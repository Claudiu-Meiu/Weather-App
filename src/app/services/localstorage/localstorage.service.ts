import { Injectable } from '@angular/core';

import { type City } from '../../models/city-search.model';

@Injectable({
  providedIn: 'root',
})
export class LocalstorageService {
  private _themeStorageKey: string = 'darkMode';
  private _lastVisitedCities: string = 'lastVisitedCities';

  constructor() {}

  public get getThemeItem(): string | null {
    return localStorage.getItem(this._themeStorageKey);
  }

  public saveThemeItem(isDark: boolean): void {
    localStorage.setItem(this._themeStorageKey, isDark.toString());
  }

  public getLastVisitedCitiesItem(): City[] {
    const storedLastVisitedCities = localStorage.getItem(
      this._lastVisitedCities
    );
    return storedLastVisitedCities ? JSON.parse(storedLastVisitedCities) : [];
  }

  public saveLastVisitedCitiesItem(lastVisitedCities: City[]) {
    localStorage.setItem(
      this._lastVisitedCities,
      JSON.stringify(lastVisitedCities)
    );
  }
}
