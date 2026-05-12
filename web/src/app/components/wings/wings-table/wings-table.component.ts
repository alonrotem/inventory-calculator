import { AfterViewInit, Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { WingsList, WingsListItem } from '../../../../types';
import { PaginatorComponent } from '../../common/paginator/paginator.component';
import { faArrowsRotate, IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { WingsService } from '../../../services/wings.service';
import { DateStrPipe } from "../../../utils/pipes/date_pipe";
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { DecimalPipe, NgFor, NgIf } from '@angular/common';
import { FaIconComponent, FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ToastService } from '../../../services/toast.service';
import { StateService } from '../../../services/state.service';
import { NavigatedMessageComponent } from '../../common/navigated-message/navigated-message.component';
import { SettingsService } from '../../../services/settings.service';
import { PageLoadingComponent } from "../../common/page-loading/page-loading.component";
import { Observable } from 'rxjs';

@Component({
  selector: 'app-wings-table',
  standalone: true,
  imports: [DateStrPipe, RouterModule, NgFor, DecimalPipe, FaIconComponent, FontAwesomeModule, 
    PaginatorComponent, PaginatorComponent, PageLoadingComponent, NgIf],
  templateUrl: './wings-table.component.html',
  styleUrl: './wings-table.component.scss'
})
export class WingsTableComponent extends NavigatedMessageComponent implements OnInit, AfterViewInit, OnChanges {

  current_page = 1;
  rowsPerPage:number = 5;
  wingsList: WingsListItem[] = [];
  @ViewChild("paginator") paginator!: PaginatorComponent;
  faArrowsRotate: IconDefinition = faArrowsRotate;
  loading: boolean = true;
  totalRecords: number = 0;
  totalbabies: number = 0;
  @Input() customerId: number | null = null;
  @Input() full_width: boolean = false;
  @Input() show_title: boolean = true;
  @Input() showOnlyCustomerWings: boolean = false;
  

  constructor(
    private wingsService: WingsService, 
    private settingsService: SettingsService,
    router: Router, 
    stateService: StateService,
    toastService: ToastService,
    activatedRoute: ActivatedRoute  
  ) {
      super(toastService, stateService, router, activatedRoute);
  }

  async ngAfterViewInit() {
    this.rowsPerPage = await this.settingsService.getNumOfItemsPerPage();
    this.getWings(1);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['customerId'] || changes['showOnlyCustomerWings']) {
      this.loading = true;
      this.getWings(1);
    }
  }

  getWings (page: number){
    console.log(`Getting wings for page ${page} with customerId=${this.customerId} and showOnlyCustomerWings=${this.showOnlyCustomerWings}`);
    const wlist: Observable<WingsList> = (this.customerId === null) ?
      this.wingsService.getWings({ page: page, perPage:this.rowsPerPage }):
      this.wingsService.getWings_for_customer(this.customerId, this.showOnlyCustomerWings);

    wlist.subscribe(
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

  async ngOnInit() {

  }

  pageChange (page: number) {
    this.getWings(page);
  }

  showSuccess(text: string) {
		this.toastService.showError (text);
	}
}
