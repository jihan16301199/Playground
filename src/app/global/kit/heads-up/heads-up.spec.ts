import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeadsUp } from './heads-up';

describe('HeadsUp', () => {
  let component: HeadsUp;
  let fixture: ComponentFixture<HeadsUp>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeadsUp]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HeadsUp);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
