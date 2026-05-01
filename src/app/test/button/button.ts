import { Component } from '@angular/core';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-button',
  imports: [],
  templateUrl: './button.html',
  styleUrl: './button.scss'
})
export class Button {
  constructor(private ts: ThemeService) { }

  toggleTheme() {
    this.ts.toggleTheme();
  }
}
