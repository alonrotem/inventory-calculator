import { Component, OnInit } from '@angular/core';
import { InfoService } from '../../../services/info.service';
import { Stats } from '../../../../types';
import { AsyncPipe, DecimalPipe, NgClass, NgIf } from '@angular/common';
import { faArrowsRotate, faBasketShopping, faTrashCan, IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { HasPermissionPipe } from '../../../utils/pipes/has-permission.pipe';
import { UsersService } from '../../../services/users.service';

@Component({
  selector: 'app-summary-card',
  standalone: true,
  imports: [ DecimalPipe, FaIconComponent, NgClass, HasPermissionPipe, AsyncPipe, NgIf ],
  templateUrl: './summary-card.component.html',
  styleUrl: './summary-card.component.scss'
})
export class SummaryCardComponent implements OnInit {

  raw_material_records: number = 0;
  //total_baby_records: number = 0;
  //total_babies: number = 0;
  total_wings: number = 0;
  num_of_orders: number = 0;
  total_hats: number = 0;
  raw_material_kg: number = 0;
  raw_material_remaining_kg: number = 0;
  raw_material_units: number = 0;
  raw_material_remaining_units: number = 0;

  loading: boolean = true;
  faArrowsRotate: IconDefinition = faArrowsRotate;
  faBasketShopping: IconDefinition = faBasketShopping;

  user$ = this.usersService.user$;

  constructor(private infoService: InfoService, private usersService: UsersService) {
  }

  ngOnInit(): void {
    this.infoService.getStatistics().subscribe({
      next: (stats: Stats) => {
        //console.dir(stats);
        this.raw_material_records = stats.raw_material_records;
        //this.total_baby_records = stats.total_baby_records;
        //this.total_babies = stats.total_babies;
        this.total_wings = stats.total_wings;
        this.num_of_orders = stats.num_of_orders;
        this.total_hats = stats.total_hats;
        this.raw_material_kg = stats.cur_raw_material_quantity_kg;
        this.raw_material_remaining_kg = stats.cur_raw_material_remaining_kg;
        this.raw_material_units = stats.cur_raw_material_quantity_units;
        this.raw_material_remaining_units = stats.cur_raw_material_remaining_units;
        this.loading = false;
      },
      error: (error) => {
        console.log(error);
      }
    })
  }
}
