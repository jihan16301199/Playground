import { Component } from '@angular/core';
import { ThemeService } from '../../../services/theme.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sidebar',
  imports: [CommonModule],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss'
})
export class Sidebar {
  constructor(private ts: ThemeService) { }

  isDarkMode(): boolean {
    return this.ts.isDarkMode();
  }
  
  enableDarkMode() {
    this.ts.enableDarkMode();
  }

  enableLightMode() {
    this.ts.enableLightMode();
  }
}
