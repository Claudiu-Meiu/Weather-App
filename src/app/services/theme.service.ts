import { Injectable } from '@angular/core';
import { type Theme } from '../models/theme.model';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  isDark: boolean = false;
  icon: string = 'pi pi-moon';

  public toggleDarkMode(): void {
    const element: HTMLElement | null = document.querySelector('html');
    if (element) {
      element.classList.toggle('my-app-dark')
        ? ((this.icon = 'pi pi-sun'), (this.isDark = true))
        : ((this.icon = 'pi pi-moon'), (this.isDark = false));
    }
  }
}
