import { Component } from '@angular/core';
import { ThemeService } from '../../services/theme.service';
import { TimeDuration } from '../../global/kit/time-duration/time-duration';

@Component({
  selector: 'app-time-duration-page',
  imports: [TimeDuration],
  templateUrl: './time-duration.html',
  styleUrl: './time-duration.scss'
})
export class TimeDurationPage {
  constructor(private ts: ThemeService) { }

  toggleTheme() {
    this.ts.toggleTheme();
  }
}
