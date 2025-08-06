import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { ThemeService } from '../../../services/theme.service';
import { AuthService } from '../../../services/_firebase/authentication/auth.service';
import { RealtimeDatabaseService } from '../../../services/_firebase/realtime-database/realtime-database.service';
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

import { type User } from '@firebase/auth';

import { MessageService } from 'primeng/api';

import { ButtonModule } from 'primeng/button';
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
    TooltipModule,
    DrawerModule,
    DividerModule,
    ToastModule,
    ProgressSpinnerModule,
  ],
  providers: [MessageService],
  templateUrl: './weather-panel.component.html',
})
export class WeatherPanelComponent implements OnInit, OnDestroy {
  public themeService = inject(ThemeService);
  private _messageService = inject(MessageService);
  private _authService = inject(AuthService);
  private _realtimeDatabaseService = inject(RealtimeDatabaseService);
  private _citiesService = inject(CitiesService);
  private _weatherService = inject(WeatherService);
  private _weatherSvgService = inject(WeatherSvgService);

  private _destroy$ = new Subject<void>();

  public user: User | null = null;

  public currentWeatherData: CurrentWeatherData | null = null;
  public dailyWeatherData: DailyWeatherData | null = null;
  public hourlyWeatherData: HourlyWeatherData | null = null;

  public selectedUnits: SelectedWeatherUnits | null = null;
  public selectedCity: City | null = null;
  public selectedDayIndex: number = 0;

  public isFavoriteCity!: boolean;

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
    this._authService.user$
      .pipe(takeUntil(this._destroy$))
      .subscribe((user: User | null) => {
        this.user = user;
        if (user && this.selectedCity) {
          this._checkIfCityIsFavorite(user.uid, this.selectedCity);
        }
      });

    this._citiesService.selectedCity$
      .pipe(takeUntil(this._destroy$))
      .subscribe({
        next: (city) => {
          this.selectedCity = city;
          this._fetchWeatherData();
          if (this.user && this.selectedCity) {
            this._checkIfCityIsFavorite(this.user.uid, this.selectedCity);
          }
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

    this._realtimeDatabaseService.isFavoriteCity$
      .pipe(takeUntil(this._destroy$))
      .subscribe((isFavorite) => {
        this.isFavoriteCity = isFavorite;
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

  public getTemperatureColor(temperature: number, unit: string): string {
    if (unit === '°C') {
      if (temperature < 10) {
        return 'text-sky-200';
      } else if (temperature >= 30) {
        return 'text-amber-200';
      } else {
        return 'text-lime-200';
      }
    } else if (unit === '°F') {
      if (temperature < 50) {
        return 'text-sky-200';
      } else if (temperature >= 86) {
        return 'text-amber-200';
      } else {
        return 'text-lime-200';
      }
    }
    return '';
  }

  public get hourlyWeatherSlice(): Record<string, number> {
    const start = this.selectedDayIndex * 24;
    const end = (this.selectedDayIndex + 1) * 24;
    return {
      start,
      end,
    };
  }

  public selectDay(index: number): void {
    this.selectedDayIndex = index;
  }

  public moveSelectedDayIndexRight(): void {
    if (this.selectedDayIndex < 6) {
      this.selectedDayIndex++;
    } else if (this.selectedDayIndex >= 6) {
      this.selectedDayIndex = 0;
    }
  }

  public moveSelectedDayIndexLeft(): void {
    if (this.selectedDayIndex > 0) {
      this.selectedDayIndex--;
    } else if (this.selectedDayIndex <= 0) {
      this.selectedDayIndex = 6;
    }
  }

  public async saveCityAsFavorite(selectedCity: City): Promise<void> {
    if (this.user && this.selectedCity) {
      const exists = await this._realtimeDatabaseService.cityExistsInFavorites(
        this.user.uid,
        selectedCity
      );

      if (!exists) {
        await this._realtimeDatabaseService.saveFavoriteCity(
          this.user.uid,
          selectedCity
        );
        this._messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: `${this.selectedCity.city} was saved to favorites.`,
          life: 3000,
        });
        this._realtimeDatabaseService.updateIsFavoriteCity(true);
      } else {
        await this.removeCityFromFavorites(selectedCity);
      }
    } else {
      this._authService.showSignInDialog();
    }
  }

  public async removeCityFromFavorites(city: City): Promise<void> {
    if (this.user && this.selectedCity) {
      await this._realtimeDatabaseService.deleteFavoriteCity(
        this.user.uid,
        city
      );
      this._messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: `${city.city} has been removed from favorites.`,
        life: 3000,
      });
      this._realtimeDatabaseService.updateIsFavoriteCity(false);
    }
  }

  private async _checkIfCityIsFavorite(
    userId: string,
    city: City
  ): Promise<void> {
    const exists = await this._realtimeDatabaseService.cityExistsInFavorites(
      userId,
      city
    );
    this._realtimeDatabaseService.updateIsFavoriteCity(exists);
  }

  public countryName(countryCode: string): string {
    return this._citiesService.getCountryName(countryCode);
  }
}
