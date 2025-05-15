import { Routes } from '@angular/router';

import { CityResolver } from './resolvers/city.resolver';
import { WeatherPanelComponent } from './pages/weather-panel/weather-panel.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';

export const routes: Routes = [
  {
    path: '',
    component: WeatherPanelComponent,
    resolve: {
      city: CityResolver,
    },
  },
  {
    path: 'not-found',
    component: NotFoundComponent,
  },
  {
    path: '**',
    redirectTo: 'not-found',
    pathMatch: 'full',
    resolve: {
      city: CityResolver,
    },
  },
];
