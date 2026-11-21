import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { RawMaterialsService } from '../../../services/raw-materials.service';
import { ListParams, RawMaterial, RawMaterialListItem, RawMaterials } from '../../../../types';
import { DecimalPipe, NgFor, NgIf } from '@angular/common';
import { PaginatorComponent } from "../../common/paginator/paginator.component";
import { ModalDialogComponent } from '../../common/modal-dialog/modal-dialog.component';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
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
import { SettingsService } from '../../../services/settings.service';
import { firstValueFrom } from 'rxjs';
import { PageLoadingComponent } from "../../common/page-loading/page-loading.component";
import { TranslatePipe, TranslateQuantityPipe, TranslateEnumPipe } from '../../../i18n/translate.pipe';
import { loadListSort, saveListSort } from '../../../utils/list-sort-storage';

@Component({
    selector: 'app-raw-materials-table',
    standalone: true,
    templateUrl: './raw-materials-table.component.html',
    styleUrl: './raw-materials-table.component.scss',
    imports: [TranslatePipe, TranslateEnumPipe, TranslateQuantityPipe, 
    NgFor, PaginatorComponent, ModalDialogComponent,
    RouterModule, FaIconComponent, FontAwesomeModule, NgIf, NgSelectModule,
    FormsModule, DateStrPipe, ToastComponent, DecimalPipe,
    PageLoadingComponent
]
})

export class RawMaterialsTableComponent extends NavigatedMessageComponent implements OnInit {
  
  constructor(
    private rawMaterialsService: RawMaterialsService, 
    private settingsService: SettingsService, 
    router: Router, 
    stateService: StateService,
    toastService: ToastService,
    activatedRoute: ActivatedRoute
    ) {
      super(toastService, stateService, router, activatedRoute);
  }
  current_page = 1;
  rowsPerPage:number = 5;
  rawMaterials: RawMaterialListItem[] = [];
  @ViewChild("paginator") paginator!: PaginatorComponent;
  faArrowsRotate: IconDefinition = faArrowsRotate;
  loading: boolean = true;
  totalRecords: number = 0;
  
  selectedCar: number=1;

  // sorting and filtering (by the server, before paging)
  // the sort the list was left with is kept, so that it opens the same way next time
  private static readonly SORT_KEY = 'raw_materials';
  private static readonly SORT_COLUMNS = ['name', 'total_quantity', 'last_purchase', 'last_update_by'];
  sortColumn?: string = loadListSort(RawMaterialsTableComponent.SORT_KEY, RawMaterialsTableComponent.SORT_COLUMNS)?.column;
  sortDirection: 'asc' | 'desc' = loadListSort(RawMaterialsTableComponent.SORT_KEY, RawMaterialsTableComponent.SORT_COLUMNS)?.direction ?? 'asc';
  filterColumn: string = '';        // '' : all columns
  filterText: string = '';
  private filterTimer: ReturnType<typeof setTimeout> | undefined;

  get filterActive(): boolean {
    return this.filterText.trim() !== '';
  }

  getRawMaterials(page: number){
    //console.log("this.rowsPerPage: " + this.rowsPerPage);
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
    this.rawMaterialsService.getRawMaterials(list).subscribe(
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

  async ngOnInit(){
    this.rowsPerPage = await this.settingsService.getNumOfItemsPerPage();

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

  /** A column header was clicked: sort by it, ascending; again: descending. */
  sortBy(column: string) {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    }
    else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }
    saveListSort(RawMaterialsTableComponent.SORT_KEY, { column: this.sortColumn, direction: this.sortDirection });
    this.getRawMaterials(1);
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
    this.filterTimer = setTimeout(() => this.getRawMaterials(1), 300);
  }

  filterColumnChanged(column: string) {
    this.filterColumn = column;
    if (this.filterActive) {
      this.getRawMaterials(1);
    }
  }

  clearFilter() {
    clearTimeout(this.filterTimer);
    this.filterText = '';
    this.getRawMaterials(1);
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
