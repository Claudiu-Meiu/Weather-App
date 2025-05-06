import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Subject } from 'rxjs';

import { type City } from '../../../models/city.model';
import { type AutoCompleteCompleteEvent } from 'primeng/autocomplete';
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
export class NavDesktopComponent implements OnInit {
  private destroy$ = new Subject<void>();
  cities = inject(CitiesService);
  weather = inject(WeatherService);

  sidebarVisibility: boolean = false;
  settingsItems: MenuItem[] | any;

  allCities: City[] = [];
  filteredCities: City[] = [];
  city!: City;

  ngOnInit(): void {
    this.cities.fetchCities().subscribe({
      next: (cities) => {
        return (this.allCities = cities);
      },
      error: (err) => {
        return console.error('Error fetching cities:', err);
      },
    });

    this.settingsItems = [
      {
        // TEMPERATURE UNITS
        label: 'Temperature Units',
        items: [
          {
            label: 'Celsius °C',
            icon:
              this.weather.selectedUnitsSubject.getValue().temperature ===
              this.weather.weatherUnits.temperature.celsius
                ? PrimeIcons.CHECK
                : null,
            command: () => {
              this.weather.selectedUnitsSubject.next({
                ...this.weather.selectedUnitsSubject.getValue(),
                temperature: this.weather.weatherUnits.temperature.celsius,
              });
              this.settingsItems[0].items.forEach(
                (item: any) => (item.icon = null)
              );
              this.settingsItems[0].items[0].icon = PrimeIcons.CHECK;
            },
          },
          {
            label: 'Fahrenheit °F',
            icon:
              this.weather.selectedUnitsSubject.getValue().temperature ===
              this.weather.weatherUnits.temperature.fahrenheit
                ? PrimeIcons.CHECK
                : null,
            command: () => {
              this.weather.selectedUnitsSubject.next({
                ...this.weather.selectedUnitsSubject.getValue(),
                temperature: this.weather.weatherUnits.temperature.fahrenheit,
              });
              this.settingsItems[0].items.forEach(
                (item: any) => (item.icon = null)
              );
              this.settingsItems[0].items[1].icon = PrimeIcons.CHECK;
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
              this.weather.selectedUnitsSubject.getValue().windSpeed ===
              this.weather.weatherUnits.windSpeed.kmh
                ? PrimeIcons.CHECK
                : null,
            command: () => {
              this.weather.selectedUnitsSubject.next({
                ...this.weather.selectedUnitsSubject.getValue(),
                windSpeed: this.weather.weatherUnits.windSpeed.kmh,
              });
              this.settingsItems[1].items.forEach(
                (item: any) => (item.icon = null)
              );
              this.settingsItems[1].items[0].icon = PrimeIcons.CHECK;
            },
          },
          {
            label: 'm/s',
            icon:
              this.weather.selectedUnitsSubject.getValue().windSpeed ===
              this.weather.weatherUnits.windSpeed.ms
                ? PrimeIcons.CHECK
                : null,
            command: () => {
              this.weather.selectedUnitsSubject.next({
                ...this.weather.selectedUnitsSubject.getValue(),
                windSpeed: this.weather.weatherUnits.windSpeed.ms,
              });
              // Update the icons directly
              this.settingsItems[1].items.forEach(
                (item: any) => (item.icon = null)
              );
              this.settingsItems[1].items[1].icon = PrimeIcons.CHECK;
            },
          },
          {
            label: 'mph',
            icon:
              this.weather.selectedUnitsSubject.getValue().windSpeed ===
              this.weather.weatherUnits.windSpeed.mph
                ? PrimeIcons.CHECK
                : null,
            command: () => {
              this.weather.selectedUnitsSubject.next({
                ...this.weather.selectedUnitsSubject.getValue(),
                windSpeed: this.weather.weatherUnits.windSpeed.mph,
              });
              this.settingsItems[1].items.forEach(
                (item: any) => (item.icon = null)
              );
              this.settingsItems[1].items[2].icon = PrimeIcons.CHECK;
            },
          },
          {
            label: 'knots',
            icon:
              this.weather.selectedUnitsSubject.getValue().windSpeed ===
              this.weather.weatherUnits.windSpeed.knots
                ? PrimeIcons.CHECK
                : null,
            command: () => {
              this.weather.selectedUnitsSubject.next({
                ...this.weather.selectedUnitsSubject.getValue(),
                windSpeed: this.weather.weatherUnits.windSpeed.knots,
              });
              this.settingsItems[1].items.forEach(
                (item: any) => (item.icon = null)
              );
              this.settingsItems[1].items[3].icon = PrimeIcons.CHECK;
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
              this.weather.selectedUnitsSubject.getValue().precipitation ===
              this.weather.weatherUnits.precipitation.millimeter
                ? PrimeIcons.CHECK
                : null,
            command: () => {
              this.weather.selectedUnitsSubject.next({
                ...this.weather.selectedUnitsSubject.getValue(),
                precipitation:
                  this.weather.weatherUnits.precipitation.millimeter,
              });
              this.settingsItems[2].items.forEach(
                (item: any) => (item.icon = null)
              );
              this.settingsItems[2].items[0].icon = PrimeIcons.CHECK;
            },
          },
          {
            label: 'Inch',
            icon:
              this.weather.selectedUnitsSubject.getValue().precipitation ===
              this.weather.weatherUnits.precipitation.inch
                ? PrimeIcons.CHECK
                : null,
            command: () => {
              this.weather.selectedUnitsSubject.next({
                ...this.weather.selectedUnitsSubject.getValue(),
                precipitation: this.weather.weatherUnits.precipitation.inch,
              });
              this.settingsItems[2].items.forEach(
                (item: any) => (item.icon = null)
              );
              this.settingsItems[2].items[1].icon = PrimeIcons.CHECK;
            },
          },
        ],
      },
    ];
  }

  selectCity(city: City) {
    this.cities.selectCity(city);
  }

  filterCity(event: AutoCompleteCompleteEvent) {
    let filtered: any[] = [];
    let query = event.query;

    this.allCities.forEach((city: City) => {
      if (
        query.length >= 3 &&
        city.city.toLowerCase().indexOf(query.toLowerCase()) == 0
      ) {
        filtered.push(city);
      }
    });

    return (this.filteredCities = filtered);
  }

  toggleDarkMode() {
    const element: any = document.querySelector('html');
    element.classList.toggle('my-app-dark');
  }
}
