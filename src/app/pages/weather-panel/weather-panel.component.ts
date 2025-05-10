import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
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
export class WeatherPanelComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  cities = inject(CitiesService);
  weather = inject(WeatherService);

  currentWeatherData: any;
  dailyWeatherData: any;
  errorMessage: string | null = null;

  selectedCity: City | null = null;
  selectedUnits: any;

  ngOnInit() {
    this.cities.selectedCity$.pipe(takeUntil(this.destroy$)).subscribe({
      next: (city) => {
        this.selectedCity = city;
        this.fetchWeatherData();
      },
    });

    this.weather.selectedUnits$.pipe(takeUntil(this.destroy$)).subscribe({
      next: (units) => {
        this.selectedUnits = units;
        this.fetchWeatherData();
      },
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private fetchWeatherData() {
    if (this.selectedCity && this.selectedUnits) {
      this.getCurrentWeather(
        this.selectedCity.lat,
        this.selectedCity.long,
        this.selectedUnits.temperature[0],
        this.selectedUnits.windSpeed[0],
        this.selectedUnits.precipitation[0]
      );
      this.getDailyWeather(
        this.selectedCity.lat,
        this.selectedCity.long,
        this.selectedUnits.temperature[0],
        this.selectedUnits.windSpeed[0],
        this.selectedUnits.precipitation[0]
      );
    }
  }

  private getCurrentWeather(
    lat: string,
    long: string,
    tempUnit: string,
    windSpeedUnit: string,
    precipitationUnit: string
  ) {
    this.weather
      .currentWeather(lat, long, tempUnit, windSpeedUnit, precipitationUnit)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (weather) => {
          this.currentWeatherData = weather;
          this.weather.weatherSvg(weather);
          this.errorMessage = null;
        },
        error: () => {
          this.errorMessage =
            'Failed to fetch weather data. Please try again later.';
        },
      });
  }

  private getDailyWeather(
    lat: string,
    long: string,
    tempUnit: string,
    windSpeedUnit: string,
    precipitationUnit: string
  ) {
    this.weather
      .dailyWeather(lat, long, tempUnit, windSpeedUnit, precipitationUnit)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (weather) => {
          this.dailyWeatherData = weather;
          this.weather.weatherSvg(weather);
        },
      });
  }
}
