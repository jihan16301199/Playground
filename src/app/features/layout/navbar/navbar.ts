import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ThemeService } from '../../../services/theme.service';

@Component({
  selector: 'app-navbar',
  imports: [CommonModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss'
})
export class Navbar {

  constructor(public theme : ThemeService){}

  titleCenter: boolean = false;

  toggle() {
    this.titleCenter = !this.titleCenter;
  }

}
