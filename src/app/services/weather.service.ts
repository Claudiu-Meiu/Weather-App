import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, map } from 'rxjs';

import {
  type WeatherUnits,
  type SelectedWeatherUnits,
  type WeatherCondition,
  type CurrentWeather,
  type CurrentWeatherData,
  type DailyWeather,
  type DailyWeatherData,
} from '../models/weather.model';

@Injectable({
  providedIn: 'root',
})
export class WeatherService {
  private http: HttpClient = inject(HttpClient);

  private weatherSvgMap: WeatherCondition[] = [
    {
      code: 0,
      day: 'clear-day.svg',
      night: 'clear-night.svg',
      title: 'Clear sky',
    },
    {
      code: 1,
      day: 'partly-cloudy-day.svg',
      night: 'partly-cloudy-night.svg',
      title: 'Mainly clear',
    },
    {
      code: 2,
      day: 'partly-cloudy-day.svg',
      night: 'partly-cloudy-night.svg',
      title: 'Partly cloudy',
    },
    {
      code: 3,
      day: 'overcast-day.svg',
      night: 'overcast-night.svg',
      title: 'Overcast',
    },
    { code: 45, day: 'fog-day.svg', night: 'fog-night.svg', title: 'Fog' },
    { code: 48, day: 'fog-day.svg', night: 'fog-night.svg', title: 'Rime fog' },
    {
      code: 51,
      day: 'drizzle.svg',
      night: 'drizzle.svg',
      title: 'Light drizzle',
    },
    {
      code: 53,
      day: 'drizzle.svg',
      night: 'drizzle.svg',
      title: 'Moderate drizzle',
    },
    {
      code: 55,
      day: 'drizzle.svg',
      night: 'drizzle.svg',
      title: 'Dense drizzle',
    },
    {
      code: 56,
      day: 'drizzle.svg',
      night: 'drizzle.svg',
      title: 'Freezing light drizzle',
    },
    {
      code: 57,
      day: 'drizzle.svg',
      night: 'drizzle.svg',
      title: 'Freezing dense drizzle',
    },
    {
      code: 61,
      day: 'rain.svg',
      night: 'rain.svg',
      title: 'Light rain',
    },
    {
      code: 63,
      day: 'rain.svg',
      night: 'rain.svg',
      title: 'Moderate rain',
    },
    {
      code: 65,
      day: 'rain.svg',
      night: 'rain.svg',
      title: 'Heavy rain',
    },
    {
      code: 66,
      day: 'rain.svg',
      night: 'rain.svg',
      title: 'Freezing light rain',
    },
    {
      code: 67,
      day: 'rain.svg',
      night: 'rain.svg',
      title: 'Freezing heavy rain',
    },
    {
      code: 71,
      day: 'snow.svg',
      night: 'snow.svg',
      title: 'Light snow fall',
    },
    {
      code: 73,
      day: 'snow.svg',
      night: 'snow.svg',
      title: 'Moderate snow fall',
    },
    {
      code: 75,
      day: 'snow.svg',
      night: 'snow.svg',
      title: 'Heavy snow fall',
    },
    {
      code: 77,
      day: 'snow.svg',
      night: 'snow.svg',
      title: 'Snow grains',
    },
    {
      code: 80,
      day: 'rain.svg',
      night: 'rain.svg',
      title: 'Light rain showers',
    },
    {
      code: 81,
      day: 'rain.svg',
      night: 'rain.svg',
      title: 'Moderate rain showers',
    },
    {
      code: 82,
      day: 'rain.svg',
      night: 'rain.svg',
      title: 'Violent rain showers',
    },
    {
      code: 85,
      day: 'snow.svg',
      night: 'snow.svg',
      title: 'Light snow showers',
    },
    {
      code: 86,
      day: 'snow.svg',
      night: 'snow.svg',
      title: 'Heavy snow showers',
    },
    {
      code: 95,
      day: 'thunderstorms-day-rain.svg',
      night: 'thunderstorms-night-rain.svg',
      title: 'Light or moderate thunderstorm',
    },
    {
      code: 96,
      day: 'thunderstorms-day-rain.svg',
      night: 'thunderstorms-night-rain.svg',
      title: 'Thunderstorm with slight hail',
    },
    {
      code: 99,
      day: 'thunderstorms-day-rain.svg',
      night: 'thunderstorms-night-rain.svg',
      title: 'Thunderstorm with moderate hail',
    },
  ];

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

  private defaultWeatherUnits: SelectedWeatherUnits = {
    temperature: this.weatherUnits.temperature.celsius,
    windSpeed: this.weatherUnits.windSpeed.kmh,
    precipitation: this.weatherUnits.precipitation.millimeter,
  };

  public selectedUnitsSubject = new BehaviorSubject<SelectedWeatherUnits>(
    this.defaultWeatherUnits
  );
  public selectedUnits$ = this.selectedUnitsSubject.asObservable();

  public currentWeather(
    lat: string,
    long: string,
    tempUnit: string,
    windSpeedUnit: string,
    precipitationUnit: string
  ) {
    const OPEN_METEO_API_URL: string = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${long}&timezone=auto&current=is_day,weather_code,temperature_2m,precipitation,wind_speed_10m,wind_direction_10m,relative_humidity_2m&temperature_unit=${tempUnit}&wind_speed_unit=${windSpeedUnit}&precipitation_unit=${precipitationUnit}`;

    return this.http.get<CurrentWeather>(OPEN_METEO_API_URL).pipe(
      map((weather: CurrentWeather) => {
        if (weather.current) {
          return {
            time: weather.current.time,
            is_day: weather.current.is_day,
            weather_code: weather.current.weather_code,
            temperature_2m: Math.round(weather.current.temperature_2m),
            wind_speed_10m: Math.round(weather.current.wind_speed_10m),
            wind_direction_10m: this.getCompassDirection(
              weather.current.wind_direction_10m
            ),
            precipitation: weather.current.precipitation,
            relative_humidity_2m: weather.current.relative_humidity_2m,
          };
        }
        throw new Error('No weather data available');
      })
    );
  }

  public dailyWeather(
    lat: string,
    long: string,
    tempUnit: string,
    windSpeedUnit: string,
    precipitationUnit: string
  ) {
    const OPEN_METEO_API_URL: string = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${long}&daily=weather_code,temperature_2m_min,temperature_2m_max,winddirection_10m_dominant,wind_speed_10m_max,precipitation_sum,precipitation_probability_max,sunshine_duration&timezone=auto&temperature_unit=${tempUnit}&wind_speed_unit=${windSpeedUnit}&precipitation_unit=${precipitationUnit}`;

    return this.http.get<DailyWeather>(OPEN_METEO_API_URL).pipe(
      map((weather: DailyWeather) => {
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
            winddirection_10m_dominant:
              weather.daily.winddirection_10m_dominant.map((wind) =>
                this.getCompassDirection(wind)
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
        throw new Error('No weather data available');
      })
    );
  }

  public weatherSvg(weather: CurrentWeatherData | DailyWeatherData) {
    const weatherCode = weather.weather_code;
    const isDay = weather.is_day;

    if (weatherCode !== null && isDay !== null) {
      const selectedSvg = this.weatherSvgMap.find(
        (svg) => svg.code === weatherCode
      );
      weather.weatherSvg = selectedSvg
        ? `assets/img/weather-svg/${
            isDay === 1 ? selectedSvg.day : selectedSvg.night
          }`
        : null;
      weather.weatherSvgTitle = selectedSvg?.title;
    }

    if (Array.isArray(weatherCode) && !isDay) {
      const selectedSvgs = weatherCode.map((code: any) =>
        this.weatherSvgMap.find((svg) => svg.code === code)
      );
      weather.weatherSvg = selectedSvgs;
    }
  }

  private getCompassDirection(degrees: number): string {
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
