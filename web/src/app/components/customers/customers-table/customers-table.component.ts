import { Component, inject, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Customer, CustomerListItem, Customers } from '../../../../types';
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
import { CustomersService } from '../../../services/customers.service';
import { SingleHatCalculatorComponent } from '../single-hat-calculator/single-hat-calculator.component';
import { StateService } from '../../../services/state.service';

@Component({
  selector: 'app-customers-table',
  standalone: true,
  imports: [ NgFor, PaginatorComponent, PaginatorComponent, ModalDialogComponent, RouterModule, FaIconComponent, FontAwesomeModule, NgIf, NgSelectModule, FormsModule, DateStrPipe, ToastComponent, DecimalPipe, SingleHatCalculatorComponent ],
  templateUrl: './customers-table.component.html',
  styleUrl: './customers-table.component.scss'
})
export class CustomersTableComponent implements OnInit {
  
  constructor(private customersService: CustomersService, private modalService: NgbModal, private router: Router, private stateService:StateService) {
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
      const state = this.stateService.getState();
      if(state && state.message){
        if(!state.isError) {
          this.toastService.showSuccess(state.message);
        }
        else {
          this.toastService.showError(state.message);
        }
      }
      this.stateService.clearState();
    }
  }
  current_page = 1;
  rowsPerPage:number = 5;
  customers: CustomerListItem[] = [];
  @ViewChild("paginator") paginator!: PaginatorComponent;
  faArrowsRotate: IconDefinition = faArrowsRotate;
  loading: boolean = true;
  totalRecords: number = 0;

  selectedCar: number=1;
  toastService = inject(ToastService);

  getCustomers(page: number){
    this.customersService.getCustomers({ page: page, perPage:this.rowsPerPage }).subscribe(
    {
      next: (customers: Customers) => {
        this.loading = false;
        this.current_page = page;
        this.customers = customers.data;
        this.paginator.pages = customers.meta.total_pages;
        this.paginator.current_page = customers.meta.page;
        this.totalRecords = customers.meta.total_records;
      },
      error: (error) => {
        console.log(error);
      }
    })
  }

  ngOnInit(){
    this.getCustomers(1);
    history.replaceState({}, location.href);
  }

  pageChange (page: number) {
    this.getCustomers(page);
  }

  open() {
    //this.dialog.open();
  }

  showSuccess(text: string) {
		this.toastService.showError (text);
	}
}
