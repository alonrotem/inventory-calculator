import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { RawMaterialsService } from '../../../services/raw-materials.service';
import { RawMaterial, RawMaterials } from '../../../../types';
import { NgFor, NgIf } from '@angular/common';
import { PaginatorComponent } from "../../common/paginator/paginator.component";
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalDialogComponent } from '../../common/modal-dialog/modal-dialog.component';
import { RawMaterialDialogComponent } from '../raw-material-dialog/raw-material-dialog.component';
import { RouterModule } from '@angular/router';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { IconDefinition, faArrowsRotate } from '@fortawesome/free-solid-svg-icons';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';
import { DateStrPipe } from '../../../utils/date_pipe';

@Component({
    selector: 'app-raw-materials-table',
    standalone: true,
    templateUrl: './raw-materials-table.component.html',
    styleUrl: './raw-materials-table.component.scss',
    imports: [ NgFor, PaginatorComponent, PaginatorComponent, ModalDialogComponent, RawMaterialDialogComponent, RouterModule, FaIconComponent, FontAwesomeModule, NgIf, NgSelectModule, FormsModule, DateStrPipe ]
})

export class RawMaterialsTableComponent implements OnInit, AfterViewInit {
  constructor(private rawMaterialsService: RawMaterialsService, private modalService: NgbModal) {
    
  }
  current_page = 1;
  rowsPerPage:number = 5;
  rawMaterials: RawMaterial[] = [];
  @ViewChild("paginator") paginator!: PaginatorComponent;
  faArrowsRotate: IconDefinition = faArrowsRotate;
  loading: boolean = true;
  //@ViewChild("dialog") dialog!: ModalDialogComponent;
  
  selectedCar: number=1;

  cars = [
      { id: 1, name: 'Volvo' },
      { id: 2, name: 'Saab' },
      { id: 3, name: 'Opel' },
      { id: 4, name: 'Audi' },
  ];

  getRawMaterials(page: number){
    this.rawMaterialsService.getRawMaterials({ page: page, perPage:this.rowsPerPage }).subscribe(
    {
      next: (rawMaterials: RawMaterials) => {
        this.loading = false;
        this.current_page = page;
        this.rawMaterials = rawMaterials.data;
        this.paginator.pages = rawMaterials.meta.total_pages;
        this.paginator.current_page = rawMaterials.meta.page;
      },
      error: (error) => {
        console.log(error);
      }
    })
  }

  ngOnInit(){
    this.getRawMaterials(1);

  }

  ngAfterViewInit() {
    /*
    this.dialog.confirm.subscribe((rawMaterial:RawMaterial) => {
      console.log("submitting! " + rawMaterial);
      this.addRawMaterial(rawMaterial);
    });
    */
  }
/*
  addRawMaterial(material:RawMaterial)
  {
    this.rawMaterialsService.addRawMaterial(material).subscribe(
      {
        next:(data) => { console.log(data); this.getRawMaterials(this.current_page); },
        error:(error) => { console.log(error); }
      }
    );
  }

  editRawMaterial(id: number, material:RawMaterial)
  {
    this.rawMaterialsService.editRawMaterial(material).subscribe(
    {
      next:(data) => { console.log(data); this.getRawMaterials(this.current_page); },
      error:(error) => { console.log(error); }
    });
  }
    */

  deleteRawMaterial(id:number) {
    this.rawMaterialsService.deleteRawMaterial(id).subscribe(
    {
      next:(data) => { console.log(data); this.getRawMaterials(this.current_page); },
      error:(error) => { console.log(error); }
    });
  }

  pageChange (page: number) {
    this.getRawMaterials(page);
  }

  open() {
    //this.dialog.open();
  }
}
