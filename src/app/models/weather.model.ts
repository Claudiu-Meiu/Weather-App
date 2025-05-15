export interface WeatherCondition {
  code: number;
  day: string;
  night: string;
  title: string;
}

export interface WeatherUnits {
  temperature: {
    celsius: string[];
    fahrenheit: string[];
  };
  windSpeed: {
    kmh: string[];
    ms: string[];
    mph: string[];
    knots: string[];
  };
  precipitation: {
    millimeter: string[];
    inch: string[];
  };
}

export interface SelectedWeatherUnits {
  temperature: string | string[];
  windSpeed: string | string[];
  precipitation: string | string[];
}

export interface CurrentWeather {
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

export interface DailyWeather {
  daily: {
    time: string[];
    weather_code: number[];
    temperature_2m_min: number[];
    temperature_2m_max: number[];
    winddirection_10m_dominant: number[];
    wind_speed_10m_max: number[];
    precipitation_sum: number[];
    precipitation_probability_max: number[];
    sunshine_duration: number[];
  };
}

export interface CurrentWeatherData {
  time: string;
  is_day?: number;
  weather_code: number;
  temperature_2m: number;
  wind_speed_10m: number;
  wind_direction_10m: string;
  precipitation: number;
  relative_humidity_2m: number;
  weatherSvg?: string;
  weatherSvgTitle?: string;
}

export interface DailyWeatherData {
  time: string[];
  is_day?: number[];
  weather_code: number[];
  precipitation_probability_max: number[];
  precipitation_sum: number[];
  sunshine_duration: number[];
  temperature_2m_max: number[];
  temperature_2m_min: number[];
  wind_speed_10m_max: number[];
  winddirection_10m_dominant: string[];
  weatherSvg?: any;
  weatherSvgTitle?: any;
}
