import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
  animations: [
    trigger('slideDown', [
      transition(':enter', [
        style({
          transform: 'translateY(-100%)',
          opacity: 0
        }),
        animate('150ms ease-out', style({
          transform: 'translateY(0)',
          opacity: 1
        }))
      ]),
      transition(':leave', [
        animate('150ms ease-in', style({
          transform: 'translateY(-100%)',
          opacity: 0
        }))
      ])
    ])
  ]
})
export class Login {

  loginForm;

  constructor(private fb: FormBuilder) {
    this.loginForm = this.fb.nonNullable.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  get f() {
    return this.loginForm.controls;
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    console.log(this.loginForm.value);
  }

  current: number = 0;

  toStep(index: number) {
    this.current = index;
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

  getDashClass(index: number): string {
    if (index === this.current) return 'section__dashs--dash__current'
    else if (index < this.current) return 'section__dashs--dash__previous'
    else if (index > this.current) return 'section__dashs--dash__next'
    return '';
  }

  getServiceClass(index: number): string {
    if (index === this.current) return 'service__current'
    else if (index < this.current) return 'service__previous'
    else if (index > this.current) return 'service__next'
    return '';
  }
}
