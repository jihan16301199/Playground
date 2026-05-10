import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IMealCount } from '../../model/meal-model';

@Component({
  selector: 'app-meal-metrics',
  imports: [CommonModule],
  templateUrl: './meal-metrics.html',
  styleUrl: './meal-metrics.scss'
})
export class MealMetrics implements OnInit {
  mealCount: IMealCount = {
    totalMeal: 14,
    upcoming: 2,
    delivered: 5,
    deliveredLunch: 2,
    deliveredDinner: 3,
    cancelled: 1
  };

  @Input() steps: { title: string }[] = [];
  current: number = 0;
  private touchStartX: number = 0;
  private touchEndX: number = 0;
  private readonly SWIPE_THRESHOLD: number = 50;

  ngOnInit() {
    // Initialize with default steps matching the HTML structure
    if (this.steps.length === 0) {
      this.steps = [
        { title: 'Step 1' },
        { title: 'Step 2' }
      ];
    }
  }

  handleKeyboardEvent(event: KeyboardEvent) {
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      this.goToPreviousStep();
    } else if (event.key === 'ArrowRight') {
      event.preventDefault();
      this.goToNextStep();
    }
  }

  toStep(index: number) {
    if (index >= 0 && index < this.steps.length) {
      this.current = index;
    }
  }

  goToNextStep() {
    if (this.current < this.steps.length - 1) {
      this.current++;
    }
  }

  goToPreviousStep() {
    if (this.current > 0) {
      this.current--;
    }
  }

  getStepsArray(): number[] {
    return Array.from({ length: this.steps.length }, (_, i) => i);
  }

  onTouchStart(event: TouchEvent) {
    this.touchStartX = event.changedTouches[0].screenX;
  }

  onTouchEnd(event: TouchEvent) {
    this.touchEndX = event.changedTouches[0].screenX;
    this.handleSwipe();
  }

  private handleSwipe() {
    const diffX = this.touchStartX - this.touchEndX;

    if (Math.abs(diffX) > this.SWIPE_THRESHOLD) {
      if (diffX > 0) {
        // Swiped left - go to next step
        this.goToNextStep();
      } else {
        // Swiped right - go to previous step
        this.goToPreviousStep();
      }
    }
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

  getServiceClass(index: number): string {
    if (index === this.current) return 'service__current'
    else if (index < this.current) return 'service__previous'
    else if (index > this.current) return 'service__next'
    return '';
  }

  validParam(value: any): boolean {
    if (value === null || value === undefined) return false;
    if (typeof value === 'string') {
      return value.trim().length > 0;
    }
    if (typeof value === 'number') {
      return value !== 0;
    }
    return true;
  }
}
