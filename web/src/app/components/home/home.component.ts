import { Component } from '@angular/core';
import { SummaryCardComponent } from '../dashboard/summary-card/summary-card.component';
import { RawMaterialChartComponent } from '../dashboard/raw-material-chart/raw-material-chart.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [ SummaryCardComponent, RawMaterialChartComponent ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

  constructor() {
  }
}
