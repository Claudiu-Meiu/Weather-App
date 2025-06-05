import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { ThemeService } from '../../../services/theme.service';
import { CitiesService } from '../../../services/cities.service';
import { type City } from '../../../models/city-search.model';

import { WeatherService } from '../../../services/weather.service';
import { WeatherSvgService } from '../../../services/weather-svg.service';
import {
  type SelectedWeatherUnits,
  type CurrentWeatherData,
  type DailyWeatherData,
  type HourlyWeatherData,
} from '../../../models/weather.model';

import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TooltipModule } from 'primeng/tooltip';
import { DrawerModule } from 'primeng/drawer';
import { DividerModule } from 'primeng/divider';
import { ToastModule } from 'primeng/toast';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

interface ErrorMessages {
  currentWeather: {
    fetch: null | boolean;
    error: string;
  };
  dailyWeather: {
    fetch: null | boolean;
    error: string;
  };
  hourlyWeather: {
    fetch: null | boolean;
    error: string;
  };
}

@Component({
  selector: 'app-weather-panel',
  imports: [
    CommonModule,
    ButtonModule,
    CardModule,
    TooltipModule,
    DrawerModule,
    DividerModule,
    ToastModule,
    ProgressSpinnerModule,
  ],
  templateUrl: './weather-panel.component.html',
})
export class WeatherPanelComponent implements OnInit, OnDestroy {
  public themeService = inject(ThemeService);
  private _citiesService = inject(CitiesService);
  private _weatherService = inject(WeatherService);
  private _weatherSvgService = inject(WeatherSvgService);

  private _destroy$ = new Subject<void>();

  public currentWeatherData: CurrentWeatherData | null = null;
  public dailyWeatherData: DailyWeatherData | null = null;
  public hourlyWeatherData: HourlyWeatherData | null = null;

  public selectedUnits: SelectedWeatherUnits | null = null;
  public selectedCity: City | null = null;
  public selectedDayIndex: number = 0;

  public errorMessages: ErrorMessages = {
    currentWeather: {
      fetch: null,
      error: 'Error fetching current weather data.',
    },
    dailyWeather: {
      fetch: null,
      error: 'Error fetching daily weather data.',
    },
    hourlyWeather: {
      fetch: null,
      error: 'Error fetching hourly weather data.',
    },
  };

  ngOnInit(): void {
    this._citiesService.selectedCity$
      .pipe(takeUntil(this._destroy$))
      .subscribe({
        next: (city) => {
          this.selectedCity = city;
          this._fetchWeatherData();
        },
      });

    this._weatherService.selectedUnits$
      .pipe(takeUntil(this._destroy$))
      .subscribe({
        next: (units) => {
          this.selectedUnits = units;
          this._fetchWeatherData();
        },
      });
  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }

  private _fetchWeatherData(): void {
    if (this.selectedCity && this.selectedUnits) {
      this._getCurrentWeather(
        this.selectedCity.lat,
        this.selectedCity.long,
        this.selectedUnits.temperature[0],
        this.selectedUnits.windSpeed[0],
        this.selectedUnits.precipitation[0]
      );
      this._getDailyWeather(
        this.selectedCity.lat,
        this.selectedCity.long,
        this.selectedUnits.temperature[0],
        this.selectedUnits.windSpeed[0],
        this.selectedUnits.precipitation[0]
      );
      this._getHourlyWeather(
        this.selectedCity.lat,
        this.selectedCity.long,
        this.selectedUnits.temperature[0],
        this.selectedUnits.windSpeed[0],
        this.selectedUnits.precipitation[0]
      );
    } else {
      null;
    }
  }

  private _getCurrentWeather(
    lat: string,
    long: string,
    tempUnit: string,
    windSpeedUnit: string,
    precipitationUnit: string
  ): void {
    this._weatherService
      .currentWeather(lat, long, tempUnit, windSpeedUnit, precipitationUnit)
      .pipe(takeUntil(this._destroy$))
      .subscribe({
        next: (weather) => {
          this.errorMessages.currentWeather.fetch = true;
          this._weatherSvgService.weatherSvg(weather);
          this.currentWeatherData = weather;
        },
        error: (err) => {
          this.errorMessages.currentWeather.fetch = false;
          this.currentWeatherData = null;
          console.error(this.errorMessages.currentWeather.error, err);
        },
      });
  }

  private _getDailyWeather(
    lat: string,
    long: string,
    tempUnit: string,
    windSpeedUnit: string,
    precipitationUnit: string
  ): void {
    this._weatherService
      .dailyWeather(lat, long, tempUnit, windSpeedUnit, precipitationUnit)
      .pipe(takeUntil(this._destroy$))
      .subscribe({
        next: (weather) => {
          this.errorMessages.dailyWeather.fetch = true;
          this._weatherSvgService.weatherSvg(weather);
          this.dailyWeatherData = weather;
        },
        error: (err) => {
          this.errorMessages.dailyWeather.fetch = false;
          this.dailyWeatherData = null;
          console.error(this.errorMessages.dailyWeather.error, err);
        },
      });
  }

  private _getHourlyWeather(
    lat: string,
    long: string,
    tempUnit: string,
    windSpeedUnit: string,
    precipitationUnit: string
  ): void {
    this._weatherService
      .hourlyWeather(lat, long, tempUnit, windSpeedUnit, precipitationUnit)
      .pipe(takeUntil(this._destroy$))
      .subscribe({
        next: (weather) => {
          this.errorMessages.hourlyWeather.fetch = true;
          this._weatherSvgService.weatherSvg(weather);
          this.hourlyWeatherData = weather;
        },
        error: (err) => {
          this.errorMessages.hourlyWeather.fetch = false;
          this.hourlyWeatherData = null;
          console.error(this.errorMessages.hourlyWeather.error, err);
        },
      });
  }

  public selectDay(index: number): void {
    this.selectedDayIndex = index;
  }

  public get hourlyWeatherSlice() {
    const start = this.selectedDayIndex * 24;
    const end = (this.selectedDayIndex + 1) * 24;
    return {
      start,
      end,
    };
  }

  public getTemperatureColor(temperature: number, unit: string): string {
    if (unit === '°C') {
      if (temperature < 10) {
        return 'text-sky-100';
      } else if (temperature >= 30) {
        return 'text-yellow-100';
      } else {
        return 'text-green-100';
      }
    } else if (unit === '°F') {
      if (temperature < 50) {
        return 'text-sky-100';
      } else if (temperature >= 86) {
        return 'text-yellow-100';
      } else {
        return 'text-green-100';
      }
    }
    return '';
  }

  public countryName(countryCode: string): string {
    return this._citiesService.getCountryName(countryCode);
  }
}
