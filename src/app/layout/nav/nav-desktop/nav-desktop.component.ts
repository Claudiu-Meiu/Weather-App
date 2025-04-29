import { Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { type City } from '../../../models/city.model';
import { type AutoCompleteCompleteEvent } from 'primeng/autocomplete';
import { CitiesService } from '../../../services/cities.service';

import { TooltipModule } from 'primeng/tooltip';
import { ButtonModule } from 'primeng/button';
import { DrawerModule } from 'primeng/drawer';
import { AutoCompleteModule } from 'primeng/autocomplete';

@Component({
  selector: 'app-nav-desktop',
  imports: [
    FormsModule,
    DrawerModule,
    TooltipModule,
    ButtonModule,
    AutoCompleteModule,
  ],
  templateUrl: './nav-desktop.component.html',
})
export class NavDesktopComponent implements OnInit {
  @Output() citySelected = new EventEmitter<City>();
  cities = inject(CitiesService);

  sidebarVisibility: boolean = false;

  allCities: City[] = [];
  filteredCities: City[] = [];
  selectedCity!: City;

  ngOnInit(): void {
    this.cities.getCities().subscribe({
      next: (cities) => {
        return (this.allCities = cities);
      },
      error: (err) => {
        return console.error('Error fetching cities:', err);
      },
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

    return (this.filteredCities = filtered);
  }

  useCoordinates() {
    this.citySelected.emit(this.selectedCity);
    this.cities.setCoordinates(this.selectedCity);
  }
}
