import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IMealCount } from '../../model/meal-model';

@Component({
  selector: 'app-meal-count',
  imports: [CommonModule],
  templateUrl: './meal-count.html',
  styleUrl: './meal-count.scss'
})
export class MealCount {
  mealCount: IMealCount = {
    totalMeal: 0,
    totalLunch: 1,
    totalDinner: 2,
    delivered: 1,
    cancelled: 1
  };

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
