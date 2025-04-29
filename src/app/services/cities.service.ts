import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { City } from '../models/city.model';

import countries from 'i18n-iso-countries';
import en from 'i18n-iso-countries/langs/en.json';
import { WeatherService } from './weather.service';

countries.registerLocale(en);

@Injectable({
  providedIn: 'root',
})
export class CitiesService {
  http = inject(HttpClient);
  weather: WeatherService = inject(WeatherService);

  getCities() {
    return this.http.get<City[]>('assets/datasets/cities/cities500.json');
  }

  getCountryName(code: string): string {
    return countries.getName(code, 'en') || 'Unknown Country Code';
  }

  setCoordinates(selectedCity: any) {
    return this.weather.fetchCurrentWeather(
      selectedCity.lat,
      selectedCity.long
    );
  }
}
