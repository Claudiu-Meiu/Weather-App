import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs';

interface WeatherCondition {
  code: number;
  day: string;
  night: string;
  title: string;
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
      title: 'Slight rain',
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
      title: 'Slight snow fall',
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
      title: 'Slight rain showers',
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
      title: 'Slight snow showers',
    },
    {
      code: 86,
      day: 'snow.svg',
      night: 'snow.svg',
      title: 'Heavy snow showers',
    },
    {
      code: 95,
      day: 'thunderstorms-day.svg',
      night: 'thunderstorms-night.svg',
      title: 'Slight or moderate thunderstorm',
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

  fetchCurrentWeather(lat: string, long: string) {
    const OPEN_METEO_API_URL: string = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${long}&timezone=auto&current=is_day,weather_code,temperature_2m,precipitation,wind_speed_10m,wind_direction_10m,relative_humidity_2m`;

    return this.http.get<any>(OPEN_METEO_API_URL).pipe(
      map((data) => {
        if (data.current) {
          return {
            time: data.current.time,
            is_day: data.current.is_day,
            weather_code: data.current.weather_code,
            temperature_2m: Math.round(data.current.temperature_2m),
            wind_speed_10m: Math.round(data.current.wind_speed_10m),
            wind_direction_10m: this.getCompassDirection(
              data.current.wind_direction_10m
            ),
            precipitation: data.current.precipitation,
            relative_humidity_2m: data.current.relative_humidity_2m,
          };
        }
        throw new Error('No weather data available');
      })
    );
  }

  weatherSvg(weather: any) {
    const weatherCode = weather.weather_code;
    const isDay = weather.is_day;

    if (weatherCode !== null && isDay !== null) {
      const svgMapping = this.weatherSvgMap.find(
        (svg) => svg.code === weatherCode
      );
      weather.weatherSvg = svgMapping
        ? `assets/img/weather-svg/${
            isDay === 1 ? svgMapping.day : svgMapping.night
          }`
        : null;
      weather.weatherSvgTitle = svgMapping!.title;
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
