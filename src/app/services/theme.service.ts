import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  isDark: boolean = false;
  icon: string = 'pi pi-moon';

  private _storageKey = 'darkMode';

  constructor() {
    this._loadTheme();
  }

  public toggleDarkMode(): void {
    this.isDark = !this.isDark;
    const element: HTMLElement | null = document.querySelector('html');
    if (element) {
      this.isDark
        ? element.classList.add('my-app-dark')
        : element.classList.remove('my-app-dark');
    }
    this.isDark ? (this.icon = 'pi pi-sun') : (this.icon = 'pi pi-moon');
    this._saveTheme();
  }

  private _loadTheme(): void {
    const storedTheme = localStorage.getItem(this._storageKey);
    if (storedTheme !== null) {
      this.isDark = storedTheme === 'true';
      this.isDark ? (this.icon = 'pi pi-sun') : (this.icon = 'pi pi-moon');
      const element: HTMLElement | null = document.querySelector('html');
      if (element) {
        this.isDark
          ? element.classList.add('my-app-dark')
          : element.classList.remove('my-app-dark');
      }
    }
  }

  private _saveTheme(): void {
    localStorage.setItem(this._storageKey, this.isDark.toString());
  }
}
