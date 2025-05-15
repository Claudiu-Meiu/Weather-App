import { inject } from '@angular/core';
import { ResolveFn, ActivatedRouteSnapshot, Router } from '@angular/router';
import { CitiesService } from '../services/cities.service';
import { of, switchMap } from 'rxjs';

export const CityResolver: ResolveFn<boolean> = (
  route: ActivatedRouteSnapshot
) => {
  const citiesService = inject(CitiesService);
  const router = inject(Router);

  const cityFromUrl = route.queryParamMap.get('city');
  const latFromUrl = route.queryParamMap.get('lat');
  const longFromUrl = route.queryParamMap.get('long');

  return citiesService.fetchCities().pipe(
    switchMap((cities) => {
      if (cityFromUrl && latFromUrl && longFromUrl) {
        const match = cities.find(
          (city) =>
            city.city.toLowerCase() === cityFromUrl.toLowerCase() &&
            city.lat === latFromUrl &&
            city.long === longFromUrl
        );

        if (match) {
          citiesService.selectCity(match);
          return of(true);
        } else {
          router.navigate(['/not-found']);
          return of(false);
        }
      }

      // No or incomplete query params → find Bucharest
      const bucharest = cities.find(
        (city) => city.city.toLowerCase() === 'bucharest'
      );

      if (bucharest) {
        citiesService.selectCity(bucharest);
        router.navigate([], {
          queryParams: {
            city: bucharest.city,
            lat: bucharest.lat,
            long: bucharest.long,
          },
          replaceUrl: true,
        });
        return of(true);
      }

      // If Bucharest not found in dataset → fail gracefully
      router.navigate(['/not-found']);
      return of(false);
    })
  );
};
