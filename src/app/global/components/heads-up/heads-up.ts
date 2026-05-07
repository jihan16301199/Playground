import { CommonModule } from '@angular/common';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, HostBinding } from '@angular/core';

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
        animate('150ms ease-out', style({
          transform: 'translate3D(0, 0, 0)',
          opacity: 1
        }))
      ]),
      transition(':leave', [
        animate('150ms ease-in', style({
          transform: 'translate3D(0, 100%, 0)',
          opacity: 0
        }))
      ])
    ])
  ]
})
export class HeadsUp {
  @HostBinding('style.position') position = 'fixed';
  @HostBinding('style.zIndex') zIndex = '1000';
  @HostBinding('style.overflow') overflow = 'hidden';
  @HostBinding('style.pointerEvents') pointerEvents = 'none';
  
  showToast: boolean = true;
  toastMessage: string = 'Donate: If you use this site regularly and would like.';
  type: string = 'primary'; //popup--success popup--danger

  closeToast() {
    this.showToast = false;
    this.toastMessage = '';
    this.type = '';
  }
}
