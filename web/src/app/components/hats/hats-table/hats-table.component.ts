import { Component, ViewChild } from '@angular/core';
import { HatListItem, HatsList } from '../../../../types';
import { PaginatorComponent } from '../../common/paginator/paginator.component';
import { faArrowsRotate, IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { FaIconComponent, FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { DecimalPipe, NgFor, NgIf } from '@angular/common';
import { HatsService } from '../../../services/hats.service';
import { ToastService } from '../../../services/toast.service';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-hats-table',
  standalone: true,
  imports: [ DecimalPipe, FaIconComponent, FontAwesomeModule, RouterModule, PaginatorComponent, NgFor, NgIf ],
  templateUrl: './hats-table.component.html',
  styleUrl: './hats-table.component.scss'
})
export class HatsTableComponent {
  current_page = 1;
  rowsPerPage:number = 5;
  hatsList: HatListItem[] = [];
  @ViewChild("paginator") paginator!: PaginatorComponent;
  faArrowsRotate: IconDefinition = faArrowsRotate;
  loading: boolean = true;
  totalRecords: number = 0;
  totalbabies: number = 0;

  constructor(private hatsService: HatsService, private toastService: ToastService, private router: Router) {   
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

  getHats (page: number){
    this.hatsService.getHats({ page: page, perPage:this.rowsPerPage }).subscribe(
    {
      next: (hats: HatsList) => {
        //console.log(hats);
        this.loading = false;
        this.current_page = page;
        this.hatsList = hats.data;
        this.paginator.pages = hats.meta.total_pages;
        this.paginator.current_page = hats.meta.page;
        this.totalRecords = hats.meta.total_records;
      },
      error: (error) => {
        console.log(error);
      }
    });
  }

  ngOnInit(): void {
    this.getHats(1);
  }

  pageChange (page: number) {
    this.getHats(page);
  }

  showSuccess(text: string) {
		this.toastService.showError (text);
	}
}
