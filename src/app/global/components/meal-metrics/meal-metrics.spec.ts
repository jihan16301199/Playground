import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MealMetrics } from './meal-metrics';

describe('MealMetrics', () => {
  let component: MealMetrics;
  let fixture: ComponentFixture<MealMetrics>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MealMetrics]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MealMetrics);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
