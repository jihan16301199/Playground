import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimeDuration } from './time-duration';

describe('TimeDuration', () => {
  let component: TimeDuration;
  let fixture: ComponentFixture<TimeDuration>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TimeDuration]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TimeDuration);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
