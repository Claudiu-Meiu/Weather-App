import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

import { City } from '../../../models/city-search.model';

import { initializeApp } from 'firebase/app';
import { environment } from '../../../../environments/environment';
import { getDatabase, ref, set, get, type Database } from 'firebase/database';

@Injectable({
  providedIn: 'root',
})
export class RealtimeDatabaseService {
  private _db: Database;

  private _favoriteCitiesUpdated$ = new Subject<void>();

  public favoriteCitiesUpdatedObservable$ =
    this._favoriteCitiesUpdated$.asObservable();

  private _isFavoriteCity: BehaviorSubject<boolean> = new BehaviorSubject(
    false
  );

  public isFavoriteCity$ = this._isFavoriteCity.asObservable();

  constructor() {
    const app = initializeApp(environment.firebaseConfig);
    this._db = getDatabase(app);
  }

  public updateIsFavoriteCity(isFavorite: boolean): void {
    this._isFavoriteCity.next(isFavorite);
  }

  public async getFavoriteCities(userId: string): Promise<any[]> {
    const favoritesRef = ref(this._db, `users/${userId}/favorites`);
    const snapshot = await get(favoritesRef);
    if (snapshot.exists()) {
      return snapshot.val();
    } else {
      return [];
    }
  }

  public async saveFavoriteCity(userId: string, city: City): Promise<void> {
    const favoritesRef = ref(this._db, `users/${userId}/favorites`);
    const snapshot = await get(favoritesRef);

    const favorites = snapshot.exists() ? snapshot.val() : [];

    if (!favorites.some((fav: City) => fav.city === city.city)) {
      favorites.unshift(city);
      await set(favoritesRef, favorites);
      this._favoriteCitiesUpdated$.next();
    }
  }

  public async deleteFavoriteCity(userId: string, city: City): Promise<void> {
    const favoritesRef = ref(this._db, `users/${userId}/favorites`);
    const snapshot = await get(favoritesRef);

    if (snapshot.exists()) {
      const favorites = snapshot.val();

      const cityIndex = favorites.findIndex(
        (fav: City) => fav.city === city.city
      );

      if (cityIndex !== -1) {
        favorites.splice(cityIndex, 1);
        await set(favoritesRef, favorites);
        this._favoriteCitiesUpdated$.next();
      }
    }
  }

  public async cityExistsInFavorites(userId: string, city: City): Promise<any> {
    const favoritesRef = ref(this._db, `users/${userId}/favorites`);
    const snapshot = await get(favoritesRef);

    if (!snapshot.exists()) {
      return false;
    }

    const favorites = snapshot.val();
    return favorites.some((fav: City) => fav.city === city.city);
  }

  public async deleteUserData(userId: string): Promise<void> {
    const userRef = ref(this._db, `users/${userId}`);
    await set(userRef, null);
  }
}
