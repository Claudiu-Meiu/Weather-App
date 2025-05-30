import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';

import {
  type City,
  type AutoCompleteCompleteEvent,
} from '../../models/city-search.model';

import { ThemeService } from '../../services/theme.service';
import { CitiesService } from '../../services/cities.service';
import { WeatherService } from '../../services/weather.service';

import { MessageService, PrimeIcons } from 'primeng/api';
import { TooltipModule } from 'primeng/tooltip';
import { ButtonModule } from 'primeng/button';
import { DrawerModule } from 'primeng/drawer';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { DialogModule } from 'primeng/dialog';
import { PanelMenuModule } from 'primeng/panelmenu';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-nav',
  imports: [
    CommonModule,
    FormsModule,
    DrawerModule,
    TooltipModule,
    ButtonModule,
    AutoCompleteModule,
    DialogModule,
    PanelMenuModule,
    ToastModule,
  ],
  providers: [MessageService],
  templateUrl: './nav.component.html',
})
export class NavComponent implements OnInit, OnDestroy {
  public themeService = inject(ThemeService);
  private _router = inject(Router);
  private _messageService = inject(MessageService);
  private _citiesService = inject(CitiesService);
  private _weatherService = inject(WeatherService);

  private _destroy$ = new Subject<void>();

  public city!: City;
  private _allCities: City[] = [];
  public filteredCities: City[] = [];
  public lastVisitedCities: City[] = [];

  public sidebarVisibility: boolean = false;
  public unitsDialogVisibility: boolean = false;
  public lastVisitedDialogVisibility: boolean = false;
  public settingsItems: any;

  ngOnInit(): void {
    this._citiesService
      .fetchCities()
      .pipe(takeUntil(this._destroy$))
      .subscribe({
        next: (cities) => {
          return (this._allCities = cities);
        },
        error: (err) => {
          return console.error('Error fetching cities:', err);
        },
      });

    this._initSettingsItems();
  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }

  public selectCity(city: City): void {
    this._citiesService.selectCity(city);
    !this.lastVisitedCities.includes(city)
      ? this.lastVisitedCities.unshift(city)
      : null;

    this._router.navigate([], {
      queryParams: { city: city.city, lat: city.lat, long: city.long },
      queryParamsHandling: 'merge',
    });
  }

  public filterCity(event: AutoCompleteCompleteEvent): City[] {
    let filtered: City[] = [];
    let query = event.query;

    this._allCities.forEach((city: City) => {
      if (city.city.toLowerCase().indexOf(query.toLowerCase()) == 0) {
        filtered.push(city);
      }
    });

    return (this.filteredCities = filtered);
  }

  public countryName(countryCode: string): string {
    return this._citiesService.getCountryName(countryCode);
  }

  private _initSettingsItems(): void {
    this.settingsItems = [
      {
        // TEMPERATURE UNITS
        label: 'Temperature',
        items: [
          {
            label: 'Celsius °C',
            icon:
              this._weatherService.selectedUnitsSubject.getValue()
                .temperature ===
              this._weatherService.weatherUnits.temperature.celsius
                ? PrimeIcons.CHECK
                : null,
            command: () => {
              if (this.settingsItems[0].items[0].icon === null) {
                this._weatherService.selectedUnitsSubject.next({
                  ...this._weatherService.selectedUnitsSubject.getValue(),
                  temperature:
                    this._weatherService.weatherUnits.temperature.celsius,
                });
                this.settingsItems[0].items.forEach(
                  (item: any) => (item.icon = null)
                );
                this.settingsItems[0].items[0].icon = PrimeIcons.CHECK;
                this._messageService.add({
                  severity: 'info',
                  summary: 'Info',
                  detail: 'Temperature unit changed to: Celsius °C',
                  life: 3000,
                });
              }
            },
          },
          {
            label: 'Fahrenheit °F',
            icon:
              this._weatherService.selectedUnitsSubject.getValue()
                .temperature ===
              this._weatherService.weatherUnits.temperature.fahrenheit
                ? PrimeIcons.CHECK
                : null,
            command: () => {
              if (this.settingsItems[0].items[1].icon === null) {
                this._weatherService.selectedUnitsSubject.next({
                  ...this._weatherService.selectedUnitsSubject.getValue(),
                  temperature:
                    this._weatherService.weatherUnits.temperature.fahrenheit,
                });
                this.settingsItems[0].items.forEach(
                  (item: any) => (item.icon = null)
                );
                this.settingsItems[0].items[1].icon = PrimeIcons.CHECK;
                this._messageService.add({
                  severity: 'info',
                  summary: 'Info',
                  detail: 'Temperature unit changed to: Fahrenheit °F',
                  life: 3000,
                });
              }
            },
          },
        ],
      },
      {
        // WIND SPEED UNITS
        label: 'Wind Speed',
        items: [
          {
            label: 'km/h',
            icon:
              this._weatherService.selectedUnitsSubject.getValue().windSpeed ===
              this._weatherService.weatherUnits.windSpeed.kmh
                ? PrimeIcons.CHECK
                : null,
            command: () => {
              if (this.settingsItems[1].items[0].icon === null) {
                this._weatherService.selectedUnitsSubject.next({
                  ...this._weatherService.selectedUnitsSubject.getValue(),
                  windSpeed: this._weatherService.weatherUnits.windSpeed.kmh,
                });
                this.settingsItems[1].items.forEach(
                  (item: any) => (item.icon = null)
                );
                this.settingsItems[1].items[0].icon = PrimeIcons.CHECK;
                this._messageService.add({
                  severity: 'info',
                  summary: 'Info',
                  detail: 'Wind speed unit changed to: km/h',
                  life: 3000,
                });
              }
            },
          },
          {
            label: 'm/s',
            icon:
              this._weatherService.selectedUnitsSubject.getValue().windSpeed ===
              this._weatherService.weatherUnits.windSpeed.ms
                ? PrimeIcons.CHECK
                : null,
            command: () => {
              if (this.settingsItems[1].items[1].icon === null) {
                this._weatherService.selectedUnitsSubject.next({
                  ...this._weatherService.selectedUnitsSubject.getValue(),
                  windSpeed: this._weatherService.weatherUnits.windSpeed.ms,
                });
                this.settingsItems[1].items.forEach(
                  (item: any) => (item.icon = null)
                );
                this.settingsItems[1].items[1].icon = PrimeIcons.CHECK;
                this._messageService.add({
                  severity: 'info',
                  summary: 'Info',
                  detail: 'Wind speed unit changed to: m/s',
                  life: 3000,
                });
              }
            },
          },
          {
            label: 'mph',
            icon:
              this._weatherService.selectedUnitsSubject.getValue().windSpeed ===
              this._weatherService.weatherUnits.windSpeed.mph
                ? PrimeIcons.CHECK
                : null,
            command: () => {
              if (this.settingsItems[1].items[2].icon === null) {
                this._weatherService.selectedUnitsSubject.next({
                  ...this._weatherService.selectedUnitsSubject.getValue(),
                  windSpeed: this._weatherService.weatherUnits.windSpeed.mph,
                });
                this.settingsItems[1].items.forEach(
                  (item: any) => (item.icon = null)
                );
                this.settingsItems[1].items[2].icon = PrimeIcons.CHECK;
                this._messageService.add({
                  severity: 'info',
                  summary: 'Info',
                  detail: 'Wind speed unit changed to: mph',
                  life: 3000,
                });
              }
            },
          },
          {
            label: 'knots',
            icon:
              this._weatherService.selectedUnitsSubject.getValue().windSpeed ===
              this._weatherService.weatherUnits.windSpeed.knots
                ? PrimeIcons.CHECK
                : null,
            command: () => {
              if (this.settingsItems[1].items[3].icon === null) {
                this._weatherService.selectedUnitsSubject.next({
                  ...this._weatherService.selectedUnitsSubject.getValue(),
                  windSpeed: this._weatherService.weatherUnits.windSpeed.knots,
                });
                this.settingsItems[1].items.forEach(
                  (item: any) => (item.icon = null)
                );
                this.settingsItems[1].items[3].icon = PrimeIcons.CHECK;
                this._messageService.add({
                  severity: 'info',
                  summary: 'Info',
                  detail: 'Wind speed unit changed to: Knots',
                  life: 3000,
                });
              }
            },
          },
        ],
      },
      {
        // PRECIPITATION UNITS
        label: 'Precipitation',
        items: [
          {
            label: 'Millimeter',
            icon:
              this._weatherService.selectedUnitsSubject.getValue()
                .precipitation ===
              this._weatherService.weatherUnits.precipitation.millimeter
                ? PrimeIcons.CHECK
                : null,
            command: () => {
              if (this.settingsItems[2].items[0].icon === null) {
                this._weatherService.selectedUnitsSubject.next({
                  ...this._weatherService.selectedUnitsSubject.getValue(),
                  precipitation:
                    this._weatherService.weatherUnits.precipitation.millimeter,
                });
                this.settingsItems[2].items.forEach(
                  (item: any) => (item.icon = null)
                );
                this.settingsItems[2].items[0].icon = PrimeIcons.CHECK;
                this._messageService.add({
                  severity: 'info',
                  summary: 'Info',
                  detail: 'Precipitation unit changed to: Millimeter',
                  life: 3000,
                });
              }
            },
          },
          {
            label: 'Inch',
            icon:
              this._weatherService.selectedUnitsSubject.getValue()
                .precipitation ===
              this._weatherService.weatherUnits.precipitation.inch
                ? PrimeIcons.CHECK
                : null,
            command: () => {
              if (this.settingsItems[2].items[1].icon === null) {
                this._weatherService.selectedUnitsSubject.next({
                  ...this._weatherService.selectedUnitsSubject.getValue(),
                  precipitation:
                    this._weatherService.weatherUnits.precipitation.inch,
                });
                this.settingsItems[2].items.forEach(
                  (item: any) => (item.icon = null)
                );
                this.settingsItems[2].items[1].icon = PrimeIcons.CHECK;
                this._messageService.add({
                  severity: 'info',
                  summary: 'Info',
                  detail: 'Precipitation unit changed to: Inch',
                  life: 3000,
                });
              }
            },
          },
        ],
      },
    ];
  }

  public showUnitsDialog(): void {
    this.unitsDialogVisibility = true;
  }

  public showLastVisitedDialog(): void {
    this.lastVisitedDialogVisibility = true;
  }

  public removeCityfromLastVisited(cityIndex: number): void {
    this.lastVisitedCities.splice(cityIndex, 1);
  }
}
