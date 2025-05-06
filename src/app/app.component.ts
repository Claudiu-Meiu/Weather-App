import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';

import { NavDesktopComponent } from './layout/nav/nav-desktop/nav-desktop.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  imports: [CommonModule, RouterOutlet, NavDesktopComponent],
})
export class AppComponent {}
