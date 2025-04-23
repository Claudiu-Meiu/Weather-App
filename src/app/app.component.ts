import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { FormsModule } from '@angular/forms';

import { CitiesService } from './services/cities.service';

import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { TooltipModule } from 'primeng/tooltip';
import { KnobModule } from 'primeng/knob';

interface Theme {
  isDarkMode: boolean;
  themeIcon: string;
}

interface WeatherProps {
  country: string;
  city: string;
  latitude: string;
  longitude: string;
}

interface CurrentWeather {
  time: string;
  temperature_2m: number;
  apparent_temperature: number;
  wind_speed_10m: number;
  wind_direction_10m: string;
  pressure_msl: number;
  precipitation: number;
  relative_humidity_2m: number;
}

interface City {
  id: string;
  country: string;
  city: string;
  lat: string;
  long: string;
}

interface AutoCompleteCompleteEvent {
  originalEvent: Event;
  query: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    CardModule,
    AutoCompleteModule,
    TooltipModule,
    KnobModule,
  ],
  providers: [CitiesService],
})
export class AppComponent implements OnInit {
  http = inject(HttpClient);
  cities = inject(CitiesService);

  theme: Theme = {
    isDarkMode: true,
    themeIcon: 'pi pi-sun',
  };

  weatherProps: WeatherProps = {
    country: 'RO',
    city: 'Brasov',
    latitude: '45.64861',
    longitude: '25.60613',
  };

  currentWeather: CurrentWeather = {
    time: '',
    temperature_2m: 0,
    apparent_temperature: 0,
    wind_speed_10m: 0,
    wind_direction_10m: '',
    pressure_msl: 0,
    precipitation: 0,
    relative_humidity_2m: 0,
  };
  errorMessage!: string;

  selectedCity!: City;
  allCities!: City[];
  filteredCities!: City[];

  ngOnInit() {
    this.fetchCities();
    this.getCurrentWeather();
  }

  fetchCities() {
    this.cities.getCities(this.selectedCity).subscribe((cities) => {
      this.allCities = cities;
    });
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

    this.filteredCities = filtered;
  }

  setCoordinates() {
    // Extract latitude and longitude from the selected city
    this.weatherProps.latitude = this.selectedCity.lat; // Assuming lat is a string
    this.weatherProps.longitude = this.selectedCity.long; // Assuming long is a string

    // Fetch the current weather for the selected city
    this.getCurrentWeather();

    // Log the coordinates for debugging
    console.log(
      `Latitude: ${this.weatherProps.latitude}, Longitude: ${this.weatherProps.longitude}`
    );
  }

  getCurrentWeather() {
    const OPEN_METEO_API_URL: string = `https://api.open-meteo.com/v1/forecast?latitude=${this.weatherProps.latitude}&longitude=${this.weatherProps.longitude}&current=temperature_2m,apparent_temperature,precipitation,rain,showers,snowfall,wind_speed_10m,wind_direction_10m,wind_gusts_10m,relative_humidity_2m,is_day,weather_code,cloud_cover,pressure_msl,surface_pressure&timezone=auto`;
    this.http
      .get<any>(OPEN_METEO_API_URL)
      .pipe(
        catchError((error) => {
          console.error('Error fetching weather data:', error); // Log the error
          this.errorMessage = 'Error fetching weather data';
          return of(null); // Return an observable with a null value instead of throwing an error
        })
      )
      .subscribe((data) => {
        if (data && data.current) {
          this.currentWeather.time = data.current.time;
          this.currentWeather.temperature_2m = Math.round(
            data.current.temperature_2m
          );
          this.currentWeather.apparent_temperature = Math.round(
            data.current.apparent_temperature
          );
          this.currentWeather.wind_speed_10m = Math.round(
            data.current.wind_speed_10m
          );
          this.currentWeather.wind_direction_10m = this.getCompassDirection(
            data.current.wind_direction_10m
          );
          this.currentWeather.pressure_msl = Math.round(
            data.current.pressure_msl
          );
          this.currentWeather.precipitation = data.current.precipitation;
          this.currentWeather.relative_humidity_2m =
            data.current.relative_humidity_2m;
        } else {
          this.errorMessage = 'No weather data available';
        }
      });
  }

  getCompassDirection(degrees: number): string {
    // Normalize the degrees to be within 0-360
    degrees = degrees % 360;

    // Define the compass directions
    const directions = [
      'N', // 0° (or 360°)
      'NNE', // 22.5°
      'NE', // 45°
      'ENE', // 67.5°
      'E', // 90°
      'ESE', // 112.5°
      'SE', // 135°
      'SSE', // 157.5°
      'S', // 180°
      'SSW', // 202.5°
      'SW', // 225°
      'WSW', // 247.5°
      'W', // 270°
      'WNW', // 292.5°
      'NW', // 315°
      'NNW', // 337.5°
    ];

    // Calculate the index (each direction represents 22.5 degrees)
    const index = Math.round(degrees / 22.5) % 16;

    // Handle the case where index is 16 (which corresponds to 0 degrees)
    return directions[index === 16 ? 0 : index];
  }

  toggleDarkMode() {
    const element: any = document.querySelector('html');
    element.classList.toggle('my-app-dark');
    this.theme.isDarkMode = !this.theme.isDarkMode;
    this.theme.themeIcon = this.theme.isDarkMode ? 'pi pi-sun' : 'pi pi-moon';
  }
}
