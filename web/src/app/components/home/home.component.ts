import { Component } from '@angular/core';
import { SummaryCardComponent } from '../dashboard/summary-card/summary-card.component';
import { RawMaterialChartComponent } from '../dashboard/raw-material-chart/raw-material-chart.component';
import { UsersService } from '../../services/users.service';
import { HasPermissionPipe } from '../../utils/pipes/has-permission.pipe';
import { AsyncPipe, NgIf } from '@angular/common';
import { FaIconComponent, IconDefinition } from '@fortawesome/angular-fontawesome';
import { faPersonDigging } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [ 
    SummaryCardComponent, RawMaterialChartComponent, 
    HasPermissionPipe, AsyncPipe, NgIf, FaIconComponent ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

  faPersonDigging: IconDefinition = faPersonDigging;
  user$ = this.usersService.user$;

  constructor(private usersService: UsersService) {
  }
}
