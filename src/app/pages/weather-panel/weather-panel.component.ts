import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { CitiesService } from '../../services/cities.service';
import { type City } from '../../models/city-search.model';

import { WeatherService } from '../../services/weather.service';
import {
  type SelectedWeatherUnits,
  type CurrentWeatherData,
  type DailyWeatherData,
  type HourlyWeatherData,
} from '../../models/weather.model';

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
  private citiesService = inject(CitiesService);
  private weatherService = inject(WeatherService);

  private destroy$ = new Subject<void>();

  public currentWeatherData: CurrentWeatherData | null = null;
  public dailyWeatherData: DailyWeatherData | null = null;
  public hourlyWeatherData: HourlyWeatherData | null = null;

  public selectedUnits: SelectedWeatherUnits | null = null;
  public selectedCity: City | null = null;
  public selectedDayIndex: number = 0;

  ngOnInit(): void {
    this.citiesService.selectedCity$.pipe(takeUntil(this.destroy$)).subscribe({
      next: (city) => {
        this.selectedCity = city;
        this.fetchWeatherData();
      },
    });

    this.weatherService.selectedUnits$
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (units) => {
          this.selectedUnits = units;
          this.fetchWeatherData();
        },
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private fetchWeatherData(): void {
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
      this.getHourlyWeather(
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
  ): void {
    this.weatherService
      .currentWeather(lat, long, tempUnit, windSpeedUnit, precipitationUnit)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (weather) => {
          this.weatherService.weatherSvg(weather);
          this.currentWeatherData = weather;
        },
      });
  }

  private getDailyWeather(
    lat: string,
    long: string,
    tempUnit: string,
    windSpeedUnit: string,
    precipitationUnit: string
  ): void {
    this.weatherService
      .dailyWeather(lat, long, tempUnit, windSpeedUnit, precipitationUnit)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (weather) => {
          this.weatherService.weatherSvg(weather);
          this.dailyWeatherData = weather;
        },
      });
  }

  private getHourlyWeather(
    lat: string,
    long: string,
    tempUnit: string,
    windSpeedUnit: string,
    precipitationUnit: string
  ): void {
    this.weatherService
      .hourlyWeather(lat, long, tempUnit, windSpeedUnit, precipitationUnit)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (weather) => {
          this.weatherService.weatherSvg(weather);
          this.hourlyWeatherData = weather;
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
    return this.citiesService.getCountryName(countryCode);
  }
}
