import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

import { Button } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { CitiesService } from '../../../services/cities.service';

@Component({
  selector: 'app-not-found',
  imports: [Button, DividerModule],
  templateUrl: './not-found.component.html',
})
export class NotFoundComponent {
  private router = inject(Router);
  private citiesService = inject(CitiesService);

  public goBack() {
    const city = this.citiesService.defaultCity;

    this.router.navigate(['/'], {
      queryParams: {
        city: city.city,
        lat: city.lat,
        long: city.long,
      },
    });
  }
}
