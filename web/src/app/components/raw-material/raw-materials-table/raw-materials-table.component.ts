import { AfterViewInit, Component, inject, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { RawMaterialsService } from '../../../services/raw-materials.service';
import { RawMaterial, RawMaterials } from '../../../../types';
import { DecimalPipe, NgFor, NgIf } from '@angular/common';
import { PaginatorComponent } from "../../common/paginator/paginator.component";
import { NgbModal, NgbToast } from '@ng-bootstrap/ng-bootstrap';
import { ModalDialogComponent } from '../../common/modal-dialog/modal-dialog.component';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { IconDefinition, faArrowsRotate } from '@fortawesome/free-solid-svg-icons';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';
import { DateStrPipe } from '../../../utils/date_pipe';
import { ToastComponent } from '../../common/toast/toast.component';
import { ToastService } from '../../../services/toast.service';

@Component({
    selector: 'app-raw-materials-table',
    standalone: true,
    templateUrl: './raw-materials-table.component.html',
    styleUrl: './raw-materials-table.component.scss',
    imports: [ NgFor, PaginatorComponent, PaginatorComponent, ModalDialogComponent, RouterModule, FaIconComponent, FontAwesomeModule, NgIf, NgSelectModule, FormsModule, DateStrPipe, ToastComponent, DecimalPipe ]
})

export class RawMaterialsTableComponent implements OnInit {
  
  constructor(private rawMaterialsService: RawMaterialsService, private modalService: NgbModal, private router: Router) {
    let nav = this.router.getCurrentNavigation();
    if (nav && nav.extras.state && nav.extras.state['info'] && nav.extras.state['info']['textInfo']) {
      let info = nav.extras.state['info']['textInfo'];
      let isError = nav.extras.state['info']['isError'];
      if(isError)
      {
        this.toastService.showError(info);
      }
      else
      {
        this.toastService.showSuccess(info);
      }
      
    }
    else
    {
      //alert("empty");
    }
  }
  current_page = 1;
  rowsPerPage:number = 5;
  rawMaterials: RawMaterial[] = [];
  @ViewChild("paginator") paginator!: PaginatorComponent;
  faArrowsRotate: IconDefinition = faArrowsRotate;
  loading: boolean = true;
  totalRecords: number = 0;
  totalbabies: number = 0;

  selectedCar: number=1;
  toastService = inject(ToastService);

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
        this.totalbabies = rawMaterials.meta.total_babies;
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
