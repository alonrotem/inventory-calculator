import { Component, OnInit } from '@angular/core';
import { InfoService } from '../../../services/info.service';
import { Stats } from '../../../../types';
import { DecimalPipe, NgClass } from '@angular/common';
import { faArrowsRotate, faTrashCan, IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'app-summary-card',
  standalone: true,
  imports: [ DecimalPipe, FaIconComponent, NgClass ],
  templateUrl: './summary-card.component.html',
  styleUrl: './summary-card.component.scss'
})
export class SummaryCardComponent implements OnInit {

  raw_material_records: number = 0;
  total_baby_records: number = 0;
  total_babies: number = 0;
  total_wings: number = 0;
  total_hats: number = 0;

  loading: boolean = true;
  faArrowsRotate: IconDefinition = faArrowsRotate;

  constructor(private infoService: InfoService) {
  }

  ngOnInit(): void {
    this.infoService.getStatistics().subscribe({
      next: (stats: Stats) => {
        this.raw_material_records = stats.raw_material_records;
        this.total_baby_records = stats.total_baby_records;
        this.total_babies = stats.total_babies;
        this.total_wings = stats.total_wings;
        this.total_hats = stats.total_hats;
        this.loading = false;
      },
      error: (error) => {
        console.log(error);
      }
    })
  }
}
