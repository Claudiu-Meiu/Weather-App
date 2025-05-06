import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, map } from 'rxjs';

interface WeatherCondition {
  code: number;
  day: string;
  night: string;
  title: string;
}

interface CurrentWeather {
  current: {
    time: string;
    is_day: number;
    weather_code: number;
    temperature_2m: number;
    wind_speed_10m: number;
    wind_direction_10m: number;
    precipitation: number;
    relative_humidity_2m: number;
  };
}

@Injectable({
  providedIn: 'root',
})
export class WeatherService {
  http: HttpClient = inject(HttpClient);

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
      day: 'drizzle',
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

  weatherUnits = {
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

  defaultWeatherUnits = {
    temperature: this.weatherUnits.temperature.celsius,
    windSpeed: this.weatherUnits.windSpeed.kmh,
    precipitation: this.weatherUnits.precipitation.millimeter,
  };

  selectedUnitsSubject = new BehaviorSubject<any>(this.defaultWeatherUnits);
  selectedUnits$ = this.selectedUnitsSubject.asObservable();

  fetchCurrentWeather(
    lat: string,
    long: string,
    tempUnit: string,
    windSpeedUnit: string,
    precipitationUnit: string
  ) {
    const OPEN_METEO_API_URL: string = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${long}&timezone=auto&current=is_day,weather_code,temperature_2m,precipitation,wind_speed_10m,wind_direction_10m,relative_humidity_2m&temperature_unit=${tempUnit}&wind_speed_unit=${windSpeedUnit}&precipitation_unit=${precipitationUnit}`;

    return this.http.get<CurrentWeather>(OPEN_METEO_API_URL).pipe(
      map((weather) => {
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

  weatherSvg(weather: any) {
    const isDay = weather.is_day;
    const weatherCode = weather.weather_code;

    if (weatherCode !== null && isDay !== null) {
      const selectedSvg = this.weatherSvgMap.find(
        (svg) => svg.code === weatherCode
      );
      weather.weatherSvg = selectedSvg
        ? `assets/img/weather-svg/${
            isDay === 1 ? selectedSvg.day : selectedSvg.night
          }`
        : null;
      weather.weatherSvgTitle = selectedSvg!.title;
    }
  }

  getCompassDirection(degrees: number): string {
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
