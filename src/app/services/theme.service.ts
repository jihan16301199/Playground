import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private readonly THEME_KEY = 'theme-mode';

  constructor() { }

  loadTheme(): void {
    const savedTheme = localStorage.getItem(this.THEME_KEY);
    if (savedTheme === 'dark') {
      this.setDarkMode(true);
    } else {
      this.setDarkMode(false);
    }
  }

  toggleTheme(): void {
    const body = document.body;
    const isDark = body.classList.contains('dark-mode');
    this.setDarkMode(!isDark);
  }

  private setDarkMode(isDark: boolean): void {
    const body = document.body;
    if (isDark) {
      body.classList.add('dark-mode');
      localStorage.setItem(this.THEME_KEY, 'dark');
    } else {
      body.classList.remove('dark-mode');
      localStorage.setItem(this.THEME_KEY, 'light');
    }
  }
}
