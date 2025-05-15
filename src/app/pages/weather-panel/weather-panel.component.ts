import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { CitiesService } from '../../services/cities.service';
import { type City } from '../../models/city.model';

import { WeatherService } from '../../services/weather.service';
import {
  type SelectedWeatherUnits,
  type CurrentWeatherData,
  type DailyWeatherData,
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
  private destroy$ = new Subject<void>();

  public citiesService = inject(CitiesService);
  private weatherService = inject(WeatherService);

  public selectedCity: City | null = null;
  public selectedUnits: SelectedWeatherUnits | null = null;

  public currentWeatherData: CurrentWeatherData | null = null;
  public dailyWeatherData: DailyWeatherData | null = null;

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
        next: (weather: CurrentWeatherData) => {
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
        next: (weather: DailyWeatherData) => {
          this.weatherService.weatherSvg(weather);
          this.dailyWeatherData = weather;
        },
      });
  }
}
