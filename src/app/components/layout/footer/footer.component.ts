import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ThemeService } from '../../../services/theme.service';

@Component({
  selector: 'app-footer',
  imports: [CommonModule],
  templateUrl: './footer.component.html',
})
export class FooterComponent {
  public themeService = inject(ThemeService);

  public currentYear: number = new Date().getFullYear();
}
