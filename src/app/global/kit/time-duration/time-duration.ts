import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-time-duration',
  imports: [CommonModule],
  templateUrl: './time-duration.html',
  styleUrl: './time-duration.scss'
})
export class TimeDuration {
  @Input() size: string = ''; //sm, md, lg
  @Input() type: string = ''; //default, primary, accent, warning, error
  @Input() duration: number = 0;
  @Input() short: boolean = false;

  get formattedDuration(): string {
    return this.formatDuration(this.duration);
  }

  private formatDuration(seconds: number): string {
    const units = [
      { label: 'd', seconds: 86400 },
      { label: 'h', seconds: 3600 },
      { label: 'm', seconds: 60 }
    ];

    let remaining = Math.floor(seconds);
    const parts: string[] = [];

    for (const unit of units) {
      const value = Math.floor(remaining / unit.seconds);
      
      if (value > 0) {
        parts.push(`${value}${unit.label}`);
        
        // In short mode: show only 2 units
        if (this.short && parts.length === 2) {
          break;
        }
      }
      
      remaining %= unit.seconds;
    }

    return parts.length > 0 ? parts.join(' ') : 'Expired';
  }

  formatText(text: string | null | undefined): string {
    if (!text || text.trim() === '') {
      return 'default';
    }
    return text.toLowerCase().replace(/\s+/g, '');
  }
}
