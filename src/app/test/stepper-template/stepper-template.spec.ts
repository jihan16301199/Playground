import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StepperTemplate } from './stepper-template';

describe('StepperTemplate', () => {
  let component: StepperTemplate;
  let fixture: ComponentFixture<StepperTemplate>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StepperTemplate]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StepperTemplate);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
