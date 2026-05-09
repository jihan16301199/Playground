import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimeDurationPage } from './time-duration';

describe('TimeDurationPage', () => {
  let component: TimeDurationPage;
  let fixture: ComponentFixture<TimeDurationPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TimeDurationPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TimeDurationPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
