import { Component, OnInit } from '@angular/core';
import { InfoService } from '../../services/info.service';
import { Stats } from '../../../types';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [ DecimalPipe ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {

  raw_material_records: number = 0;
  total_baby_records: number = 0;
  total_babies: number = 0;

  constructor(private infoService: InfoService) {
  }

  ngOnInit(): void {
    this.infoService.getStatistics().subscribe({
      next: (stats: Stats) => {
        this.raw_material_records = stats.raw_material_records;
        this.total_baby_records = stats.total_baby_records;
        this.total_babies = stats.total_babies;
      },
      error: (error) => {
        console.log(error);
      }
    })
  }
}
