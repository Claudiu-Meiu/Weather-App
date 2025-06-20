import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

import { City } from '../models/city-search.model';

import countries from 'i18n-iso-countries';
import en from 'i18n-iso-countries/langs/en.json';

countries.registerLocale(en);

@Injectable({
  providedIn: 'root',
})
export class CitiesService {
  private _http = inject(HttpClient);

  private _selectedCitySubject = new BehaviorSubject<City | null>(null);

  public selectedCity$ = this._selectedCitySubject.asObservable();

  public defaultCity: City = {
    id: '1',
    country: 'RO',
    city: 'Bucharest',
    lat: '44.43225',
    long: '26.10626',
  };

  public fetchCities(): Observable<City[]> {
    return this._http.get<City[]>('assets/datasets/cities/cities500.json');
  }

  public getCountryName(countryCode: string): string {
    return countries.getName(countryCode, 'en') || 'Unknown Country Code';
  }

  public selectCity(city: City): void {
    this._selectedCitySubject.next(city);
  }
}
