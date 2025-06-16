import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private _storageKey = 'darkMode';

  private _htmlElement: HTMLElement | null = document.querySelector('html');
  private _bodyElement: HTMLElement | null = document.querySelector('body');

  public isDark: boolean = false;
  public icon: string = 'pi pi-moon';

  constructor() {
    this._loadTheme();
    this._bodyElement && !this.isDark
      ? this._bodyElement.classList.add('bg-surface-600', 'text-surface-0')
      : null;
  }

  public toggleDarkMode(): void {
    this.isDark = !this.isDark;

    if (this._htmlElement) {
      this.isDark
        ? this._htmlElement.classList.add('my-app-dark')
        : this._htmlElement.classList.remove('my-app-dark');
    }

    if (this._bodyElement) {
      !this.isDark
        ? this._bodyElement.classList.add('bg-surface-600', 'text-surface-0')
        : this._bodyElement.classList.remove(
            'bg-surface-600',
            'text-surface-0'
          );
    }

    this.icon = this.isDark ? 'pi pi-sun' : 'pi pi-moon';
    this._saveTheme();
  }

  private _loadTheme(): void {
    const storedTheme = localStorage.getItem(this._storageKey);

    if (storedTheme !== null) {
      this.isDark = storedTheme === 'true';
      this.icon = this.isDark ? 'pi pi-sun' : 'pi pi-moon';

      if (this._htmlElement) {
        this.isDark
          ? this._htmlElement.classList.add('my-app-dark')
          : this._htmlElement.classList.remove('my-app-dark');
      }

      if (this._bodyElement) {
        !this.isDark
          ? this._bodyElement.classList.add('bg-surface-600', 'text-surface-0')
          : this._bodyElement.classList.remove(
              'bg-surface-600',
              'text-surface-0'
            );
      }
    }
  }

  private _saveTheme(): void {
    localStorage.setItem(this._storageKey, this.isDark.toString());
  }
}
