import { Component } from '@angular/core';
import { SummaryCardComponent } from '../dashboard/summary-card/summary-card.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [ SummaryCardComponent ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

  constructor() {
  }
}
