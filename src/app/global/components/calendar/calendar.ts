import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-calendar',
  imports: [CommonModule],
  templateUrl: './calendar.html',
  styleUrl: './calendar.scss'
})
export class Calendar implements OnInit {

  @Input() initialDate?: Date;
  
  currentMonth: number = new Date().getMonth() + 1;
  currentYear: number = new Date().getFullYear();
  daysInMonth: Date [] = [];
  weekdays: string[] = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  months: string[] = ['', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  isInitialDateOnly: boolean = false;

  ngOnInit(): void {
    this.initializeCalendar();
  }

  initializeCalendar() {
    this.daysInMonth = [];
    let firstDay = new Date(this.currentYear, this.currentMonth - 1, 1);

    if (this.isInitialDateOnly) {
      // this.currentYear = this.initialDate?.getFullYear();
      // this.currentMonth = this.initialDate?.getMonth() + 1;
      firstDay = new Date(this.currentYear, this.currentMonth-1, 1);
    }

    let startDay = firstDay.getDay();
    let daysInCurrentMonth = new Date(this.currentYear, this.currentMonth, 0).getDate();
    
    if(startDay)
      this.daysInMonth = Array(startDay).fill(null);

    for (let day = 1; day <= daysInCurrentMonth; day++) {
      this.daysInMonth.push(new Date(this.currentYear, this.currentMonth - 1, day));
    }
  }

  prevMonth() {
    this.isInitialDateOnly = false;
    this.currentMonth--;
    if (this.currentMonth < 1) {
      this.currentMonth = 12;
      this.currentYear--;
    }
    this.initializeCalendar();
  }

  nextMonth() {
    this.isInitialDateOnly = false;
    this.currentMonth++;
    if (this.currentMonth > 12) {
      this.currentMonth = 1;
      this.currentYear++;
    }
    this.initializeCalendar();
  }
}
