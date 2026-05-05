import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MealToday } from './meal-today';

describe('MealToday', () => {
  let component: MealToday;
  let fixture: ComponentFixture<MealToday>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MealToday]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MealToday);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
