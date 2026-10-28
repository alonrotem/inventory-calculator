import { Component, OnInit, ViewChild } from '@angular/core';
import { KnivesService } from '../../../services/knives.service';
import { KnifeListItem, KnivesList } from '../../../../types';
import { DecimalPipe, NgFor } from '@angular/common';
import { PaginatorComponent } from "../../common/paginator/paginator.component";
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ToastService } from '../../../services/toast.service';
import { StateService } from '../../../services/state.service';
import { NavigatedMessageComponent } from '../../common/navigated-message/navigated-message.component';
import { SettingsService } from '../../../services/settings.service';
import { PageLoadingComponent } from "../../common/page-loading/page-loading.component";

@Component({
  selector: 'app-knives-table',
  standalone: true,
  templateUrl: './knives-table.component.html',
  styleUrl: './knives-table.component.scss',
  imports: [NgFor, PaginatorComponent, RouterModule, DecimalPipe, PageLoadingComponent]
})
export class KnivesTableComponent extends NavigatedMessageComponent implements OnInit {

  constructor(
    private knivesService: KnivesService,
    private settingsService: SettingsService,
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
  @ViewChild("paginator") paginator!: PaginatorComponent;
  loading: boolean = true;
  totalRecords: number = 0;

  getKnives(page: number){
    this.knivesService.getKnives({ page: page, perPage: this.rowsPerPage }).subscribe(
    {
      next: (knives: KnivesList) => {
        this.loading = false;
        this.current_page = page;
        this.knives = knives.data;
        this.paginator.pages = knives.meta.total_pages;
        this.paginator.current_page = knives.meta.page;
        this.totalRecords = knives.meta.total_records;
      },
      error: (error) => {
        this.loading = false;
        console.log(error);
        this.toastService.showError(error.error?.message ?? 'Could not load the knives');
      }
    })
  }

  async ngOnInit(){
    this.rowsPerPage = await this.settingsService.getNumOfItemsPerPage();

    this.getKnives(1);
    history.replaceState({}, location.href);
  }

  pageChange (page: number) {
    this.getKnives(page);
  }
}
