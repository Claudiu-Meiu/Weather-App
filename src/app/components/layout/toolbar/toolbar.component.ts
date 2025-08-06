import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';

import {
  type City,
  type AutoCompleteCompleteEvent,
} from '../../../models/city-search.model';

import { type User } from 'firebase/auth';

import { ThemeService } from '../../../services/theme.service';
import { LocalstorageService } from '../../../services/localstorage/localstorage.service';
import { RealtimeDatabaseService } from '../../../services/_firebase/realtime-database/realtime-database.service';
import { AuthService } from '../../../services/_firebase/authentication/auth.service';
import { CitiesService } from '../../../services/cities.service';
import { WeatherService } from '../../../services/weather.service';

import { AuthComponent } from '../../authentication/auth.component';

import { MessageService } from 'primeng/api';
import { TooltipModule } from 'primeng/tooltip';
import { ButtonModule } from 'primeng/button';
import { DrawerModule } from 'primeng/drawer';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { DialogModule } from 'primeng/dialog';
import { PanelMenuModule } from 'primeng/panelmenu';
import { MenuModule } from 'primeng/menu';
import { ToastModule } from 'primeng/toast';
import { DividerModule } from 'primeng/divider';

@Component({
  selector: 'app-toolbar',
  imports: [
    AuthComponent,
    CommonModule,
    FormsModule,
    DrawerModule,
    TooltipModule,
    ButtonModule,
    AutoCompleteModule,
    DialogModule,
    PanelMenuModule,
    MenuModule,
    ToastModule,
    DividerModule,
  ],
  providers: [MessageService],
  templateUrl: './toolbar.component.html',
})
export class ToolbarComponent implements OnInit, OnDestroy {
  public themeService = inject(ThemeService);
  private _localstorageService = inject(LocalstorageService);
  private _realtimeDatabaseService = inject(RealtimeDatabaseService);
  public authservice = inject(AuthService);
  private _router = inject(Router);
  private _messageService = inject(MessageService);
  private _citiesService = inject(CitiesService);
  private _weatherService = inject(WeatherService);

  private _destroy$ = new Subject<void>();

  public user: User | null = null;

  public city: City | null = null;
  private _allCities: City[] = [];
  public filteredCities: City[] = [];
  public favoriteCities: City[] = [];
  public lastVisitedCities: City[] =
    this._localstorageService.getLastVisitedCitiesItem();

  public isFavoriteCity: boolean | null = null;

  public sidebarVisible: boolean = false;
  public unitsDialogVisible: boolean = false;
  public lastVisitedDialogVisible: boolean = false;

  public settingsItems: any;

  ngOnInit(): void {
    this.authservice.user$
      .pipe(takeUntil(this._destroy$))
      .subscribe((user: User | null) => {
        this.user = user;
        if (user) {
          this.loadFavoriteCitiesInSidebar();
          if (user && this.city) {
            this._checkIfCityIsFavorite(user.uid, this.city);
          }
          this._realtimeDatabaseService.favoriteCitiesUpdatedObservable$
            .pipe(takeUntil(this._destroy$))
            .subscribe(() => {
              this.loadFavoriteCitiesInSidebar();
            });
        } else {
          this.favoriteCities = [];
        }
      });

    this._realtimeDatabaseService.isFavoriteCity$
      .pipe(takeUntil(this._destroy$))
      .subscribe((isFavoriteCity) => {
        this.isFavoriteCity = isFavoriteCity;
      });

    this._citiesService
      .fetchCities()
      .pipe(takeUntil(this._destroy$))
      .subscribe({
        next: (cities) => {
          this._allCities = cities;
          cities.forEach((city) => {
            if (this.user) {
              this._checkIfCityIsFavorite(this.user.uid, city);
            }
          });
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

    const cityExists = this.lastVisitedCities.some(
      (visitedCity) => visitedCity.city === city.city
    );

    if (!cityExists) {
      this.lastVisitedCities.unshift(city);
      this._localstorageService.saveLastVisitedCitiesItem(
        this.lastVisitedCities
      );
    }

    this._router.navigate(['/'], {
      queryParams: { city: city.city, lat: city.lat, long: city.long },
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

  private async loadFavoriteCitiesInSidebar(): Promise<void> {
    if (this.user) {
      this.favoriteCities =
        await this._realtimeDatabaseService.getFavoriteCities(this.user.uid);
    }
  }

  public async saveCityAsFavorite(city: City): Promise<void> {
    if (this.user && city) {
      const exists = await this._realtimeDatabaseService.cityExistsInFavorites(
        this.user.uid,
        city
      );

      if (!exists) {
        await this._realtimeDatabaseService.saveFavoriteCity(
          this.user.uid,
          city
        );
        this._messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: `${this.city?.city} was saved to favorites.`,
          life: 3000,
        });
        this._realtimeDatabaseService.updateIsFavoriteCity(true);
      } else {
        this.removeCityFromFavorites(city);
      }
      this.loadFavoriteCitiesInSidebar();
    } else {
      this.authservice.showSignInDialog();
    }
  }

  public async removeCityFromFavorites(city: City): Promise<void> {
    if (this.user) {
      await this._realtimeDatabaseService.deleteFavoriteCity(
        this.user.uid,
        city
      );
      this.loadFavoriteCitiesInSidebar();
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

  public isFavoriteCityInCitySearch(city: City): boolean {
    return this.favoriteCities.some((favCity) => favCity.id === city.id);
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
                ? 'pi pi-check'
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
                this.settingsItems[0].items[0].icon = 'pi pi-check';
                this._messageService.add({
                  severity: 'success',
                  summary: 'Success',
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
                ? 'pi pi-check'
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
                this.settingsItems[0].items[1].icon = 'pi pi-check';
                this._messageService.add({
                  severity: 'success',
                  summary: 'Success',
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
                ? 'pi pi-check'
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
                this.settingsItems[1].items[0].icon = 'pi pi-check';
                this._messageService.add({
                  severity: 'success',
                  summary: 'Success',
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
                ? 'pi pi-check'
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
                this.settingsItems[1].items[1].icon = 'pi pi-check';
                this._messageService.add({
                  severity: 'success',
                  summary: 'Success',
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
                ? 'pi pi-check'
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
                this.settingsItems[1].items[2].icon = 'pi pi-check';
                this._messageService.add({
                  severity: 'success',
                  summary: 'Success',
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
                ? 'pi pi-check'
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
                this.settingsItems[1].items[3].icon = 'pi pi-check';
                this._messageService.add({
                  severity: 'success',
                  summary: 'Success',
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
                ? 'pi pi-check'
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
                this.settingsItems[2].items[0].icon = 'pi pi-check';
                this._messageService.add({
                  severity: 'success',
                  summary: 'Success',
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
                ? 'pi pi-check'
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
                this.settingsItems[2].items[1].icon = 'pi pi-check';
                this._messageService.add({
                  severity: 'success',
                  summary: 'Success',
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

  public countryName(countryCode: string): string {
    return this._citiesService.getCountryName(countryCode);
  }

  public removeCityfromLastVisited(cityIndex: number): void {
    this.lastVisitedCities.splice(cityIndex, 1);
    this._localstorageService.saveLastVisitedCitiesItem(this.lastVisitedCities);
  }

  public clearSearchInput(): null {
    return (this.city = null);
  }

  public showSidebar(): boolean {
    return (this.sidebarVisible = !this.sidebarVisible);
  }

  public showUnitsDialog(): boolean {
    this.sidebarVisible = false;
    return (this.unitsDialogVisible = !this.unitsDialogVisible);
  }

  public showLastVisitedDialog(): boolean {
    this.sidebarVisible = false;
    return (this.lastVisitedDialogVisible = !this.lastVisitedDialogVisible);
  }
}
