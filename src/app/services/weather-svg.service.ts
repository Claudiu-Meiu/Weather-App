import { Injectable } from '@angular/core';

import {
  type CurrentWeatherData,
  type DailyWeatherData,
  type HourlyWeatherData,
  type WeatherCondition,
} from '../models/weather.model';

import { WEATHER_SVG_MAP } from '../constants/weather-svg-map.constant';

@Injectable({
  providedIn: 'root',
})
export class WeatherSvgService {
  private _WEATHER_SVG_MAP: WeatherCondition[] = WEATHER_SVG_MAP;

  public weatherSvg(
    weather: CurrentWeatherData | DailyWeatherData | HourlyWeatherData
  ) {
    const weatherCode = weather.weather_code;
    const isDay = weather.is_day;

    if (weatherCode !== null && isDay !== null) {
      const selectedSvg = this._WEATHER_SVG_MAP.find(
        (svg) => svg.code === weatherCode
      );
      selectedSvg
        ? (weather.weatherSvg = {
            svgPath: `assets/img/weather-svg/${
              isDay === 1 ? selectedSvg.day : selectedSvg.night
            }`,
            title: selectedSvg.title,
          })
        : (weather.weatherSvg = null);
    }

    if (Array.isArray(weatherCode) && !isDay) {
      const selectedSvgs = weatherCode
        .map((code: any) => {
          const selectedSvg = this._WEATHER_SVG_MAP.find(
            (svg) => svg.code === code
          );
          return selectedSvg
            ? {
                svgPath: `assets/img/weather-svg/${selectedSvg.day}`,
                title: selectedSvg.title,
              }
            : null;
        })
        .filter((svg) => svg !== null);

      weather.weatherSvg = selectedSvgs;
    }

    if (Array.isArray(weatherCode) && Array.isArray(isDay)) {
      const selectedSvgs = weatherCode.map((code: any, index: number) => {
        const selectedSvg = this._WEATHER_SVG_MAP.find(
          (svg) => svg.code === code
        );
        const svgPath = selectedSvg
          ? `assets/img/weather-svg/${
              isDay[index] === 1 ? selectedSvg.day : selectedSvg.night
            }`
          : null;
        const title = selectedSvg ? selectedSvg.title : null;

        return { svgPath, title };
      });

      weather.weatherSvg = selectedSvgs;
    }
  }
}
