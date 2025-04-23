import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

interface City {
  id: string;
  country: string;
  city: string;
  lat: string;
  long: string;
}

@Injectable({
  providedIn: 'root',
})
export class CitiesService {
  http = inject(HttpClient);

  getCities(selectedCity: City): Observable<City[]> {
    return this.http.get<City[]>('cities500.json');
  }
}
