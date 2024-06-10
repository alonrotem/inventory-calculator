import { Component, OnInit } from '@angular/core';
import { RawMaterialsService } from '../../../services/raw-materials.service';
import { RawMaterial, RawMaterials } from '../../../../types';
import { NgFor } from '@angular/common';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-raw-materials-table',
  standalone: true,
  imports: [ NgFor ],
  templateUrl: './raw-materials-table.component.html',
  styleUrl: './raw-materials-table.component.scss'
})

export class RawMaterialsTableComponent implements OnInit {
  constructor(private rawMaterialsService: RawMaterialsService) {
    
  }
  rawMaterials: RawMaterial[] = [];
  ngOnInit(){
    this.rawMaterialsService.getRawMaterials('http://localhost:3000/raw_materials/', { page: 1, perPage:10 }).subscribe((rawMaterials: RawMaterials) => {
      console.log(rawMaterials);
      this.rawMaterials = rawMaterials.data;
    });
  }
}
