import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { RawMaterialsService } from '../../../services/raw-materials.service';
import { RawMaterial, RawMaterials } from '../../../../types';
import { NgFor } from '@angular/common';
import { PaginatorComponent } from "../../common/paginator/paginator.component";
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalDialogComponent } from '../../common/modal-dialog/modal-dialog.component';
import { RawMaterialDialogComponent } from '../raw-material-dialog/raw-material-dialog.component';

@Component({
    selector: 'app-raw-materials-table',
    standalone: true,
    templateUrl: './raw-materials-table.component.html',
    styleUrl: './raw-materials-table.component.scss',
    imports: [ NgFor, PaginatorComponent, PaginatorComponent, ModalDialogComponent, RawMaterialDialogComponent ]
})

export class RawMaterialsTableComponent implements OnInit, AfterViewInit {
  constructor(private rawMaterialsService: RawMaterialsService, private modalService: NgbModal) {
    
  }
  current_page = 1;
  rowsPerPage:number = 5;
  rawMaterials: RawMaterial[] = [];
  @ViewChild("paginator") paginator!: PaginatorComponent;
  @ViewChild("dialog") dialog!: ModalDialogComponent;
  
  getRawMaterials(page: number){
    this.rawMaterialsService.getRawMaterials('http://localhost:3000/raw_materials/', { page: page, perPage:this.rowsPerPage }).subscribe(
    {
      next: (rawMaterials: RawMaterials) => {
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
    this.dialog.confirm.subscribe((rawMaterial:RawMaterial) => {
      console.log("submitting! " + rawMaterial);
      this.addRawMaterial(rawMaterial);
    });
  }

  addRawMaterial(material:RawMaterial)
  {
    this.rawMaterialsService.addRawMaterial(`http://localhost:3000/raw_materials/`, material).subscribe(
      {
        next:(data) => { console.log(data); this.getRawMaterials(this.current_page); },
        error:(error) => { console.log(error); }
      }
    );
  }

  editRawMaterial(id: number, material:RawMaterial)
  {
    this.rawMaterialsService.editRawMaterial(`http://localhost:3000/raw_materials/${id}`, material).subscribe(
    {
      next:(data) => { console.log(data); this.getRawMaterials(this.current_page); },
      error:(error) => { console.log(error); }
    });
  }

  deleteRawMaterial(id:number) {
    this.rawMaterialsService.deleteRawMaterial(`http://localhost:3000/raw_materials/${id}`).subscribe(
    {
      next:(data) => { console.log(data); this.getRawMaterials(this.current_page); },
      error:(error) => { console.log(error); }
    });
  }

  pageChange (page: number) {
    this.getRawMaterials(page);
  }

  open() {
    this.dialog.open();
    //this.dialog.open();
    //const modalRef = this.modalService.open(RawMaterialDialogComponent);
    //modalRef.componentInstance.name = 'World';
  }
}
