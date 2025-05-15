import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';

import {
  type City,
  type AutoCompleteCompleteEvent,
} from '../../../models/city.model';
import { CitiesService } from '../../../services/cities.service';
import { WeatherService } from '../../../services/weather.service';

import { MenuItem, PrimeIcons } from 'primeng/api';
import { TooltipModule } from 'primeng/tooltip';
import { ButtonModule } from 'primeng/button';
import { DrawerModule } from 'primeng/drawer';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { MenuModule } from 'primeng/menu';

@Component({
  selector: 'app-nav-desktop',
  imports: [
    FormsModule,
    DrawerModule,
    TooltipModule,
    ButtonModule,
    AutoCompleteModule,
    MenuModule,
  ],
  templateUrl: './nav-desktop.component.html',
})
export class NavDesktopComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  private router = inject(Router);
  public citiesService = inject(CitiesService);
  private weatherService = inject(WeatherService);

  public sidebarVisibility: boolean = false;
  public settingsItems: MenuItem[] | any;

  public city!: City;
  private allCities: City[] = [];
  public filteredCities: City[] = [];

  ngOnInit(): void {
    this.citiesService
      .fetchCities()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (citiesService) => {
          return (this.allCities = citiesService);
        },
        error: (err) => {
          return console.error('Error fetching cities:', err);
        },
      });

    this.initializeSettingsItems();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initializeSettingsItems(): void {
    this.settingsItems = [
      {
        // TEMPERATURE UNITS
        label: 'Temperature Units',
        items: [
          {
            label: 'Celsius °C',
            icon:
              this.weatherService.selectedUnitsSubject.getValue()
                .temperature ===
              this.weatherService.weatherUnits.temperature.celsius
                ? PrimeIcons.CHECK
                : null,
            command: () => {
              if (this.settingsItems[0].items[0].icon === null) {
                this.weatherService.selectedUnitsSubject.next({
                  ...this.weatherService.selectedUnitsSubject.getValue(),
                  temperature:
                    this.weatherService.weatherUnits.temperature.celsius,
                });
                this.settingsItems[0].items.forEach(
                  (item: any) => (item.icon = null)
                );
                this.settingsItems[0].items[0].icon = PrimeIcons.CHECK;
              }
            },
          },
          {
            label: 'Fahrenheit °F',
            icon:
              this.weatherService.selectedUnitsSubject.getValue()
                .temperature ===
              this.weatherService.weatherUnits.temperature.fahrenheit
                ? PrimeIcons.CHECK
                : null,
            command: () => {
              if (this.settingsItems[0].items[1].icon === null) {
                this.weatherService.selectedUnitsSubject.next({
                  ...this.weatherService.selectedUnitsSubject.getValue(),
                  temperature:
                    this.weatherService.weatherUnits.temperature.fahrenheit,
                });
                this.settingsItems[0].items.forEach(
                  (item: any) => (item.icon = null)
                );
                this.settingsItems[0].items[1].icon = PrimeIcons.CHECK;
              }
            },
          },
        ],
      },
      {
        // WIND SPEED UNITS
        label: 'Wind Speed Units',
        items: [
          {
            label: 'km/h',
            icon:
              this.weatherService.selectedUnitsSubject.getValue().windSpeed ===
              this.weatherService.weatherUnits.windSpeed.kmh
                ? PrimeIcons.CHECK
                : null,
            command: () => {
              if (this.settingsItems[1].items[0].icon === null) {
                this.weatherService.selectedUnitsSubject.next({
                  ...this.weatherService.selectedUnitsSubject.getValue(),
                  windSpeed: this.weatherService.weatherUnits.windSpeed.kmh,
                });
                this.settingsItems[1].items.forEach(
                  (item: any) => (item.icon = null)
                );
                this.settingsItems[1].items[0].icon = PrimeIcons.CHECK;
              }
            },
          },
          {
            label: 'm/s',
            icon:
              this.weatherService.selectedUnitsSubject.getValue().windSpeed ===
              this.weatherService.weatherUnits.windSpeed.ms
                ? PrimeIcons.CHECK
                : null,
            command: () => {
              if (this.settingsItems[1].items[1].icon === null) {
                this.weatherService.selectedUnitsSubject.next({
                  ...this.weatherService.selectedUnitsSubject.getValue(),
                  windSpeed: this.weatherService.weatherUnits.windSpeed.ms,
                });
                this.settingsItems[1].items.forEach(
                  (item: any) => (item.icon = null)
                );
                this.settingsItems[1].items[1].icon = PrimeIcons.CHECK;
              }
            },
          },
          {
            label: 'mph',
            icon:
              this.weatherService.selectedUnitsSubject.getValue().windSpeed ===
              this.weatherService.weatherUnits.windSpeed.mph
                ? PrimeIcons.CHECK
                : null,
            command: () => {
              if (this.settingsItems[1].items[2].icon === null) {
                this.weatherService.selectedUnitsSubject.next({
                  ...this.weatherService.selectedUnitsSubject.getValue(),
                  windSpeed: this.weatherService.weatherUnits.windSpeed.mph,
                });
                this.settingsItems[1].items.forEach(
                  (item: any) => (item.icon = null)
                );
                this.settingsItems[1].items[2].icon = PrimeIcons.CHECK;
              }
            },
          },
          {
            label: 'knots',
            icon:
              this.weatherService.selectedUnitsSubject.getValue().windSpeed ===
              this.weatherService.weatherUnits.windSpeed.knots
                ? PrimeIcons.CHECK
                : null,
            command: () => {
              if (this.settingsItems[1].items[3].icon === null) {
                this.weatherService.selectedUnitsSubject.next({
                  ...this.weatherService.selectedUnitsSubject.getValue(),
                  windSpeed: this.weatherService.weatherUnits.windSpeed.knots,
                });
                this.settingsItems[1].items.forEach(
                  (item: any) => (item.icon = null)
                );
                this.settingsItems[1].items[3].icon = PrimeIcons.CHECK;
              }
            },
          },
        ],
      },
      {
        // PRECIPITATION UNITS
        label: 'Precipitation Units',
        items: [
          {
            label: 'Millimeter',
            icon:
              this.weatherService.selectedUnitsSubject.getValue()
                .precipitation ===
              this.weatherService.weatherUnits.precipitation.millimeter
                ? PrimeIcons.CHECK
                : null,
            command: () => {
              if (this.settingsItems[2].items[0].icon === null) {
                this.weatherService.selectedUnitsSubject.next({
                  ...this.weatherService.selectedUnitsSubject.getValue(),
                  precipitation:
                    this.weatherService.weatherUnits.precipitation.millimeter,
                });
                this.settingsItems[2].items.forEach(
                  (item: any) => (item.icon = null)
                );
                this.settingsItems[2].items[0].icon = PrimeIcons.CHECK;
              }
            },
          },
          {
            label: 'Inch',
            icon:
              this.weatherService.selectedUnitsSubject.getValue()
                .precipitation ===
              this.weatherService.weatherUnits.precipitation.inch
                ? PrimeIcons.CHECK
                : null,
            command: () => {
              if (this.settingsItems[2].items[1].icon === null) {
                this.weatherService.selectedUnitsSubject.next({
                  ...this.weatherService.selectedUnitsSubject.getValue(),
                  precipitation:
                    this.weatherService.weatherUnits.precipitation.inch,
                });
                this.settingsItems[2].items.forEach(
                  (item: any) => (item.icon = null)
                );
                this.settingsItems[2].items[1].icon = PrimeIcons.CHECK;
              }
            },
          },
        ],
      },
    ];
  }

  public selectCity(city: City): void {
    this.citiesService.selectCity(city);
    this.router.navigate([], {
      queryParams: { city: city.city, lat: city.lat, long: city.long },
      queryParamsHandling: 'merge',
    });
  }

  public filterCity(event: AutoCompleteCompleteEvent): City[] {
    let filtered: City[] = [];
    let query = event.query;

    this.allCities.forEach((city: City) => {
      if (city.city.toLowerCase().indexOf(query.toLowerCase()) == 0) {
        filtered.push(city);
      }
    });

    return (this.filteredCities = filtered);
  }

  public toggleDarkMode(): void {
    const element: any = document.querySelector('html');
    element.classList.toggle('my-app-dark');
  }
}
