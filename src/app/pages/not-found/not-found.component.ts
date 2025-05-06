import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { Button } from 'primeng/button';
import { DividerModule } from 'primeng/divider';

@Component({
  selector: 'app-not-found',
  imports: [RouterLink, Button, DividerModule],
  templateUrl: './not-found.component.html',
})
export class NotFoundComponent {}
