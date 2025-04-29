import { Component, inject, Input, OnInit, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject } from 'rxjs';

import { City } from '../../models/city.model';
import { CitiesService } from '../../services/cities.service';
import { WeatherService } from '../../services/weather.service';

import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TooltipModule } from 'primeng/tooltip';
import { DrawerModule } from 'primeng/drawer';
import { DividerModule } from 'primeng/divider';

@Component({
  selector: 'app-weather-panel',
  imports: [
    CommonModule,
    ButtonModule,
    CardModule,
    TooltipModule,
    DrawerModule,
    DividerModule,
  ],
  templateUrl: './weather-panel.component.html',
})
export class WeatherPanelComponent implements OnInit, OnChanges {
  @Input() citySelected!: City;
  cities: CitiesService = inject(CitiesService);
  weather: WeatherService = inject(WeatherService);

  defaultCity = {
    country: 'RO',
    city: 'Brasov',
    lat: '45.64861',
    long: '25.60613',
  };
  currentWeather: any;
  errorMessage: string | null = null;

  private unsubscribe$ = new Subject<void>();

  ngOnInit() {
    this.getCurrentWeather(this.defaultCity.lat, this.defaultCity.long);

    if (this.citySelected) {
      this.getCurrentWeather(this.citySelected.lat, this.citySelected.long);
    }
  }

  ngOnChanges() {
    if (this.citySelected) {
      this.getCurrentWeather(this.citySelected.lat, this.citySelected.long);
    }
  }

  getCurrentWeather(lat: string, long: string) {
    return this.weather.fetchCurrentWeather(lat, long).subscribe({
      next: (data) => {
        this.currentWeather = data;
        this.errorMessage = null;
        console.log(this.currentWeather);

        return this.weather.weatherSvg(this.currentWeather);
      },
      error: () => {
        return (this.errorMessage =
          'Failed to fetch weather data. Please try again later.');
      },
    });
  }
}
