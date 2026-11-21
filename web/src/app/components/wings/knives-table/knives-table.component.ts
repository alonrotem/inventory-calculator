import { Component, OnInit, ViewChild } from '@angular/core';
import { KnivesService } from '../../../services/knives.service';
import { KnifeListItem, KnivesList, ListParams } from '../../../../types';
import { NgFor } from '@angular/common';
import { TranslationService } from '../../../i18n/translation.service';
import { TranslatePipe } from '../../../i18n/translate.pipe';
import { PaginatorComponent } from "../../common/paginator/paginator.component";
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ToastService } from '../../../services/toast.service';
import { StateService } from '../../../services/state.service';
import { NavigatedMessageComponent } from '../../common/navigated-message/navigated-message.component';
import { SettingsService } from '../../../services/settings.service';
import { PageLoadingComponent } from "../../common/page-loading/page-loading.component";
import { knifeSvgOutline } from '../knife-editor/knife-render';
import { loadListSort, saveListSort } from '../../../utils/list-sort-storage';

@Component({
  selector: 'app-knives-table',
  standalone: true,
  templateUrl: './knives-table.component.html',
  styleUrl: './knives-table.component.scss',
  imports: [NgFor, PaginatorComponent, RouterModule, TranslatePipe, PageLoadingComponent]
})
export class KnivesTableComponent extends NavigatedMessageComponent implements OnInit {

  constructor(
    private knivesService: KnivesService,
    private settingsService: SettingsService,
    private translation: TranslationService,
    router: Router,
    stateService: StateService,
    toastService: ToastService,
    activatedRoute: ActivatedRoute
    ) {
      super(toastService, stateService, router, activatedRoute);
  }
  current_page = 1;
  rowsPerPage: number = 5;
  knives: KnifeListItem[] = [];
  thumbnails: Record<number, { d: string; viewBox: string } | null> = {};
  @ViewChild("paginator") paginator!: PaginatorComponent;
  loading: boolean = true;
  totalRecords: number = 0;

  // sorting and filtering (by the server, before paging)
  // the sort the list was left with is kept, so that it opens the same way next time
  private static readonly SORT_KEY = 'knives';
  private static readonly SORT_COLUMNS = ['name', 'width_cm'];
  sortColumn?: string = loadListSort(KnivesTableComponent.SORT_KEY, KnivesTableComponent.SORT_COLUMNS)?.column;
  sortDirection: 'asc' | 'desc' = loadListSort(KnivesTableComponent.SORT_KEY, KnivesTableComponent.SORT_COLUMNS)?.direction ?? 'asc';
  filterColumn: string = '';        // '' : all columns
  filterText: string = '';
  private filterTimer: ReturnType<typeof setTimeout> | undefined;

  get filterActive(): boolean {
    return this.filterText.trim() !== '';
  }

  getKnives(page: number){
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
    this.knivesService.getKnives(list, true).subscribe(
    {
      next: (knives: KnivesList) => {
        this.loading = false;
        this.current_page = page;
        this.knives = knives.data;
        this.thumbnails = Object.fromEntries(knives.data.map(k => [k.id, knifeSvgOutline(k)]));
        this.paginator.pages = knives.meta.total_pages;
        this.paginator.current_page = knives.meta.page;
        this.totalRecords = knives.meta.total_records;
      },
      error: (error) => {
        this.loading = false;
        console.log(error);
        this.toastService.showError(error.error?.message ?? this.translation.t('knives:list.load_failed'));
      }
    })
  }

  async ngOnInit(){
    this.rowsPerPage = await this.settingsService.getNumOfItemsPerPage();

    this.getKnives(1);
    history.replaceState({}, location.href);
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
    saveListSort(KnivesTableComponent.SORT_KEY, { column: this.sortColumn, direction: this.sortDirection });
    this.getKnives(1);
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
    this.filterTimer = setTimeout(() => this.getKnives(1), 300);
  }

  filterColumnChanged(column: string) {
    this.filterColumn = column;
    if (this.filterActive) {
      this.getKnives(1);
    }
  }

  clearFilter() {
    clearTimeout(this.filterTimer);
    this.filterText = '';
    this.getKnives(1);
  }

  pageChange (page: number) {
    this.getKnives(page);
  }
}
