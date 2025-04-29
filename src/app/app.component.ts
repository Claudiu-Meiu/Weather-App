import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import { City } from './models/city.model';

import { NavDesktopComponent } from './layout/nav/nav-desktop/nav-desktop.component';
import { WeatherPanelComponent } from './pages/weather-panel/weather-panel.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  imports: [CommonModule, NavDesktopComponent, WeatherPanelComponent],
})
export class AppComponent {
  selectedCity!: City;
}
