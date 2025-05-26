import { Component, OnInit, ViewChild } from '@angular/core';
import { WingsList, WingsListItem } from '../../../../types';
import { PaginatorComponent } from '../../common/paginator/paginator.component';
import { faArrowsRotate, IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { WingsService } from '../../../services/wings.service';
import { DateStrPipe } from "../../../utils/pipes/date_pipe";
import { Router, RouterModule } from '@angular/router';
import { DecimalPipe, NgFor } from '@angular/common';
import { FaIconComponent, FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ToastService } from '../../../services/toast.service';
import { StateService } from '../../../services/state.service';
import { NavigatedMessageComponent } from '../../common/navigated-message/navigated-message.component';

@Component({
  selector: 'app-wings-table',
  standalone: true,
  imports: [ DateStrPipe, RouterModule, NgFor, DecimalPipe, FaIconComponent, FontAwesomeModule, PaginatorComponent, PaginatorComponent ],
  templateUrl: './wings-table.component.html',
  styleUrl: './wings-table.component.scss'
})
export class WingsTableComponent extends NavigatedMessageComponent implements OnInit {

  current_page = 1;
  rowsPerPage:number = 5;
  wingsList: WingsListItem[] = [];
  @ViewChild("paginator") paginator!: PaginatorComponent;
  faArrowsRotate: IconDefinition = faArrowsRotate;
  loading: boolean = true;
  totalRecords: number = 0;
  totalbabies: number = 0;
  

  constructor(
    private wingsService: WingsService, 
    router: Router, 
    stateService: StateService,
    toastService: ToastService  
  ) {
      super(toastService, stateService, router);
      this.showNavigationToastIfMessagePending();
  }

  getWings (page: number){
    this.wingsService.getWings({ page: page, perPage:this.rowsPerPage }).subscribe(
      {
        next: (wings: WingsList) => {
          this.loading = false;
          this.current_page = page;
          this.wingsList = wings.data;
          this.paginator.pages = wings.meta.total_pages;
          this.paginator.current_page = wings.meta.page;
          this.totalRecords = wings.meta.total_records;
        },
        error: (error) => {
          console.log(error);
        }
      })
  }

  ngOnInit(): void {
    this.getWings(1);
  }

  pageChange (page: number) {
    this.getWings(page);
  }

  showSuccess(text: string) {
		this.toastService.showError (text);
	}
}
