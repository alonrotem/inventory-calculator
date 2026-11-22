import { AfterViewInit, Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { ListParams, WingsList, WingsListItem } from '../../../../types';
import { PaginatorComponent } from '../../common/paginator/paginator.component';
import { faArrowsRotate, IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { WingsService } from '../../../services/wings.service';
import { KnivesService } from '../../../services/knives.service';
import { knifeSvgOutline } from '../knife-editor/knife-render';
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
import { TranslatePipe } from '../../../i18n/translate.pipe';
import { loadListSort, saveListSort } from '../../../utils/list-sort-storage';

@Component({
  selector: 'app-wings-table',
  standalone: true,
  imports: [TranslatePipe, DateStrPipe, RouterModule, NgFor, DecimalPipe, FaIconComponent, FontAwesomeModule, 
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
    private knivesService: KnivesService,
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

  // sorting and filtering (by the server, before paging)
  // the sort the list was left with is kept, so that it opens the same way next time
  private static readonly SORT_KEY = 'wings';
  private static readonly SORT_COLUMNS = ['name', 'knife', 'Left', 'Right', 'Top', 'Crown'];
  sortColumn?: string = loadListSort(WingsTableComponent.SORT_KEY, WingsTableComponent.SORT_COLUMNS)?.column;
  sortDirection: 'asc' | 'desc' = loadListSort(WingsTableComponent.SORT_KEY, WingsTableComponent.SORT_COLUMNS)?.direction ?? 'asc';
  filterColumn: string = '';        // '' : all columns
  filterText: string = '';
  private filterTimer: ReturnType<typeof setTimeout> | undefined;

  get filterActive(): boolean {
    return this.filterText.trim() !== '';
  }

  thumbnails: Record<number, { d: string; viewBox: string } | null> = {};

  getWings (page: number){
    console.log(`Getting wings for page ${page} with customerId=${this.customerId} and showOnlyCustomerWings=${this.showOnlyCustomerWings}`);
    const list: ListParams = { page: page, perPage: this.rowsPerPage };
    if (this.sortColumn) {
      list.sort_column = this.sortColumn;
      list.sort_direction = this.sortDirection;
    }
    if (this.filterActive) {
      list.filter_expression = this.filterText.trim();
      if (this.filterColumn) {
        list.filter_column = this.filterColumn;
      }
    }
    const wlist: Observable<WingsList> = (this.customerId === null) ?
      this.wingsService.getWings(list):
      this.wingsService.getWings_for_customer(this.customerId, this.showOnlyCustomerWings, list);

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
    // the pictures of the knives' shapes (by knife id), for the knife column
    this.knivesService.getKnives({ page: 0, perPage: 0 }, true).subscribe({
      next: knives => this.thumbnails = Object.fromEntries(knives.data.map(k => [k.id, knifeSvgOutline(k)])),
      error: () => { }
    });
  }

  /** A column header was clicked: sort by it, ascending; again: descending. */
  sortBy(column: string) {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    }
    else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }
    saveListSort(WingsTableComponent.SORT_KEY, { column: this.sortColumn, direction: this.sortDirection });
    this.getWings(1);
  }

  sortIndicator(column: string): string {
    return this.sortColumn === column ? (this.sortDirection === 'asc' ? '▲' : '▼') : '';
  }

  ariaSort(column: string): 'ascending' | 'descending' | 'none' {
    return this.sortColumn === column ? (this.sortDirection === 'asc' ? 'ascending' : 'descending') : 'none';
  }

  /** The filter text was typed: the list is asked for after a short pause in typing. */
  filterTextChanged(text: string) {
    this.filterText = text;
    clearTimeout(this.filterTimer);
    this.filterTimer = setTimeout(() => this.getWings(1), 300);
  }

  filterColumnChanged(column: string) {
    this.filterColumn = column;
    if (this.filterActive) {
      this.getWings(1);
    }
  }

  clearFilter() {
    clearTimeout(this.filterTimer);
    this.filterText = '';
    this.getWings(1);
  }

  pageChange (page: number) {
    this.getWings(page);
  }

  showSuccess(text: string) {
		this.toastService.showError (text);
	}
}
