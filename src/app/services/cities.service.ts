import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';

import { City } from '../models/city.model';

import countries from 'i18n-iso-countries';
import en from 'i18n-iso-countries/langs/en.json';

countries.registerLocale(en);

@Injectable({
  providedIn: 'root',
})
export class CitiesService {
  private http = inject(HttpClient);

  defaultCity: City = {
    id: '1',
    country: 'RO',
    city: 'Bucharest',
    lat: '44.43225',
    long: '26.10626',
  };

  private selectedCitySubject = new BehaviorSubject<City>(this.defaultCity);
  selectedCity$ = this.selectedCitySubject.asObservable();

  fetchCities() {
    return this.http.get<City[]>('assets/datasets/cities/cities500.json');
  }

  getCountryName(code: string): string {
    return countries.getName(code, 'en') || 'Unknown Country Code';
  }

  selectCity(city: City) {
    this.selectedCitySubject.next(city);
  }
}
