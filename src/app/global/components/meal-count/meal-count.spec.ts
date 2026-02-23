import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MealCount } from './meal-count';

describe('MealCount', () => {
  let component: MealCount;
  let fixture: ComponentFixture<MealCount>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MealCount]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MealCount);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
