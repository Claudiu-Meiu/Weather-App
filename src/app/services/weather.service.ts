import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, map, Observable } from 'rxjs';

import {
  type WeatherUnits,
  type SelectedWeatherUnits,
  type CurrentWeather,
  type DailyWeather,
  type HourlyWeather,
  CurrentWeatherData,
  DailyWeatherData,
  HourlyWeatherData,
} from '../models/weather.model';

@Injectable({
  providedIn: 'root',
})
export class WeatherService {
  private _http = inject(HttpClient);

  public weatherUnits: WeatherUnits = {
    temperature: {
      celsius: ['celsius', '°C'],
      fahrenheit: ['fahrenheit', '°F'],
    },
    windSpeed: {
      kmh: ['kmh', 'km/h'],
      ms: ['ms', 'm/s'],
      mph: ['mph', 'mph'],
      knots: ['kn', 'kn'],
    },
    precipitation: {
      millimeter: ['mm', 'mm'],
      inch: ['inch', 'in'],
    },
  };

  private _defaultWeatherUnits: SelectedWeatherUnits = {
    temperature: this.weatherUnits.temperature.celsius,
    windSpeed: this.weatherUnits.windSpeed.kmh,
    precipitation: this.weatherUnits.precipitation.millimeter,
  };

  public selectedUnitsSubject = new BehaviorSubject<SelectedWeatherUnits>(
    this._defaultWeatherUnits
  );

  public selectedUnits$ = this.selectedUnitsSubject.asObservable();

  constructor() {}

  public currentWeather(
    lat: string,
    long: string,
    tempUnit: string,
    windSpeedUnit: string,
    precipitationUnit: string
  ): Observable<CurrentWeatherData> {
    const OPEN_METEO_API_URL: string = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${long}&timezone=auto&current=is_day,weather_code,temperature_2m,precipitation,wind_speed_10m,wind_direction_10m,relative_humidity_2m&temperature_unit=${tempUnit}&wind_speed_unit=${windSpeedUnit}&precipitation_unit=${precipitationUnit}`;

    return this._http.get<CurrentWeather>(OPEN_METEO_API_URL).pipe(
      map((weather) => {
        if (weather.current) {
          return {
            time: weather.current.time,
            is_day: weather.current.is_day,
            weather_code: weather.current.weather_code,
            temperature_2m: Math.round(weather.current.temperature_2m),
            wind_speed_10m: Math.round(weather.current.wind_speed_10m),
            wind_direction_10m: this._getCompassDirection(
              weather.current.wind_direction_10m
            ),
            precipitation: weather.current.precipitation,
            relative_humidity_2m: weather.current.relative_humidity_2m,
          };
        }
        throw new Error('No current weather data available');
      })
    );
  }

  public dailyWeather(
    lat: string,
    long: string,
    tempUnit: string,
    windSpeedUnit: string,
    precipitationUnit: string
  ): Observable<DailyWeatherData> {
    const OPEN_METEO_API_URL: string = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${long}&daily=weather_code,temperature_2m_min,temperature_2m_max,wind_direction_10m_dominant,wind_speed_10m_max,precipitation_sum,precipitation_probability_max,sunshine_duration&timezone=auto&temperature_unit=${tempUnit}&wind_speed_unit=${windSpeedUnit}&precipitation_unit=${precipitationUnit}`;

    return this._http.get<DailyWeather>(OPEN_METEO_API_URL).pipe(
      map((weather) => {
        if (weather.daily) {
          return {
            time: weather.daily.time,
            weather_code: weather.daily.weather_code,
            temperature_2m_max: weather.daily.temperature_2m_max.map((temp) =>
              Math.round(temp)
            ),
            temperature_2m_min: weather.daily.temperature_2m_min.map((temp) =>
              Math.round(temp)
            ),
            wind_speed_10m_max: weather.daily.wind_speed_10m_max.map(
              Math.round
            ),
            wind_direction_10m_dominant:
              weather.daily.wind_direction_10m_dominant.map((wind) =>
                this._getCompassDirection(wind)
              ),
            precipitation_probability_max:
              weather.daily.precipitation_probability_max.map((precip) =>
                Math.round(precip)
              ),
            precipitation_sum: weather.daily.precipitation_sum,
            sunshine_duration: weather.daily.sunshine_duration.map((sec) =>
              Math.round(sec / 3600)
            ),
          };
        }
        throw new Error('No daily weather data available');
      })
    );
  }

  public hourlyWeather(
    lat: string,
    long: string,
    tempUnit: string,
    windSpeedUnit: string,
    precipitationUnit: string
  ): Observable<HourlyWeatherData> {
    const OPEN_METEO_API_URL: string = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${long}&hourly=temperature_2m,is_day,wind_speed_10m,wind_direction_10m,weather_code,precipitation_probability,apparent_temperature,precipitation&timezone=auto&temperature_unit=${tempUnit}&wind_speed_unit=${windSpeedUnit}&precipitation_unit=${precipitationUnit}`;

    return this._http.get<HourlyWeather>(OPEN_METEO_API_URL).pipe(
      map((weather) => {
        if (weather.hourly) {
          return {
            time: weather.hourly.time,
            is_day: weather.hourly.is_day,
            weather_code: weather.hourly.weather_code,
            temperature_2m: weather.hourly.temperature_2m.map((temp) =>
              Math.round(temp)
            ),
            wind_speed_10m: weather.hourly.wind_speed_10m.map(Math.round),
            wind_direction_10m: weather.hourly.wind_direction_10m.map((wind) =>
              this._getCompassDirection(wind)
            ),
            precipitation_probability:
              weather.hourly.precipitation_probability.map((precip) =>
                Math.round(precip)
              ),
            precipitation: weather.hourly.precipitation,
          };
        }
        throw new Error('No hourly weather data available');
      })
    );
  }

  private _getCompassDirection(degrees: number): string {
    // Normalize the degrees to be within 0-360
    degrees = degrees % 360;
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
    const index = Math.round(degrees / 22.5) % 16;
    return directions[index === 16 ? 0 : index];
  }
}
