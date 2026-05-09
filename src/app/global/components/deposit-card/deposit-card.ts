import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TimeDuration } from "../../kit/time-duration/time-duration";

@Component({
  selector: 'app-deposit-card',
  imports: [CommonModule, TimeDuration],
  templateUrl: './deposit-card.html',
  styleUrl: './deposit-card.scss'
})
export class DepositCard {

  paid: boolean = true;
}
