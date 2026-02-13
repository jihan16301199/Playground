import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-login',
  imports: [CommonModule],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class Login {
  current: number = 0;

  toStep(index: number) {
    this.current = index;
  }

  getDotClass(index: number): string {
    if (index === this.current) return 'stepper__dots--dot__selected'
    return '';
  }

  getStepClass(index: number): string {
    if (index === this.current) return 'step__current'
    else if (index < this.current) return 'step__previous'
    else if (index > this.current) return 'step__next'
    return '';
  }

  getBackgroundClass(index: number): string {
    if (index == 0) return 'stepper__background--primary'
    else if (index == 1) return 'stepper__background--secondary'
    else if (index == 2) return 'stepper__background--image'
    return '';
  }

  getDashClass(index: number): string {
    if (index === this.current) return 'section__dashs--dash__current'
    else if (index < this.current) return 'section__dashs--dash__previous'
    else if (index > this.current) return 'section__dashs--dash__next'
    return '';
  }

  getServiceClass(index: number): string {
    if (index === this.current) return 'service__current'
    else if (index < this.current) return 'service__previous'
    else if (index > this.current) return 'service__next'
    return '';
  }
}
