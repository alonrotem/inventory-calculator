import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { RawMaterialsService } from '../../../services/raw-materials.service';
import { RawMaterial, RawMaterials } from '../../../../types';
import { DecimalPipe, NgFor, NgIf } from '@angular/common';
import { PaginatorComponent } from "../../common/paginator/paginator.component";
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalDialogComponent } from '../../common/modal-dialog/modal-dialog.component';
import { Router, RouterModule } from '@angular/router';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { IconDefinition, faArrowsRotate } from '@fortawesome/free-solid-svg-icons';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';
import { DateStrPipe } from '../../../utils/pipes/date_pipe';
import { ToastComponent } from '../../common/toast/toast.component';
import { ToastService } from '../../../services/toast.service';
import { StateService } from '../../../services/state.service';
import { NavigatedMessageComponent } from '../../common/navigated-message/navigated-message.component';

@Component({
    selector: 'app-raw-materials-table',
    standalone: true,
    templateUrl: './raw-materials-table.component.html',
    styleUrl: './raw-materials-table.component.scss',
    imports: [ 
      NgFor, PaginatorComponent, PaginatorComponent, ModalDialogComponent, 
      RouterModule, FaIconComponent, FontAwesomeModule, NgIf, NgSelectModule, 
      FormsModule, DateStrPipe, ToastComponent, DecimalPipe 
    ]
})

export class RawMaterialsTableComponent extends NavigatedMessageComponent implements OnInit {
  
  constructor(
    private rawMaterialsService: RawMaterialsService, 
    private modalService: NgbModal, 
    router: Router, 
    stateService: StateService,
    toastService: ToastService
    ) {
      super(toastService, stateService, router);
      this.showNavigationToastIfMessagePending();
  }
  current_page = 1;
  rowsPerPage:number = 5;
  rawMaterials: RawMaterial[] = [];
  @ViewChild("paginator") paginator!: PaginatorComponent;
  faArrowsRotate: IconDefinition = faArrowsRotate;
  loading: boolean = true;
  totalRecords: number = 0;
  
  selectedCar: number=1;

  getRawMaterials(page: number){
    this.rawMaterialsService.getRawMaterials({ page: page, perPage:this.rowsPerPage }).subscribe(
    {
      next: (rawMaterials: RawMaterials) => {
        this.loading = false;
        this.current_page = page;
        this.rawMaterials = rawMaterials.data;
        this.paginator.pages = rawMaterials.meta.total_pages;
        this.paginator.current_page = rawMaterials.meta.page;
        this.totalRecords = rawMaterials.meta.total_records;
      },
      error: (error) => {
        console.log(error);
      }
    })
  }

  ngOnInit(){
    this.getRawMaterials(1);
    history.replaceState({}, location.href);
  }

  deleteRawMaterial(id:number) {
    this.rawMaterialsService.deleteRawMaterial(id).subscribe(
    {
      next:(data) => { this.getRawMaterials(this.current_page); },
      error:(error) => { console.log(error); }
    });
  }

  pageChange (page: number) {
    this.getRawMaterials(page);
  }

  open() {
    //this.dialog.open();
  }

  showSuccess(text: string) {
		this.toastService.showError (text);
	}
}
