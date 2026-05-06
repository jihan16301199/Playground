import { CommonModule } from '@angular/common';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component } from '@angular/core';

@Component({
  selector: 'app-heads-up',
  imports: [CommonModule],
  templateUrl: './heads-up.html',
  styleUrl: './heads-up.scss',
  animations: [
    trigger('slideDown', [
      transition(':enter', [
        style({
          transform: 'translate3D(0, 100%, 0)',
          opacity: 0
        }),
        animate('300ms ease-out', style({
          transform: 'translate3D(0, 0, 0)',
          opacity: 1
        }))
      ]),
      transition(':leave', [
        animate('300ms ease-in', style({
          transform: 'translate3D(0, 100%, 0)',
          opacity: 0
        }))
      ])
    ])
  ]
})
export class HeadsUp {
  showToast: boolean = true;
  toastMessage: string = '';
  toastClass: string = ''; //popup--success popup--danger

  closeToast() {
    this.showToast = false;
    this.toastMessage = '';
    this.toastClass = '';
  }
}
