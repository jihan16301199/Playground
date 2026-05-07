import { Component } from '@angular/core';
import { MealCount } from '../../global/components/meal-count/meal-count';
import { MealToday } from '../../global/components/meal-today/meal-today';
import { Calendar } from '../../global/components/calendar/calendar';
import { MealCard } from '../../global/components/meal-card/meal-card';

@Component({
  selector: 'app-test',
  imports: [MealCount, MealToday, Calendar, MealCard],
  templateUrl: './test.html',
  styleUrl: './test.scss'
})
export class Test {

}
