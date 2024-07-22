import { AfterViewChecked, AfterViewInit, Component, Input, OnChanges, OnInit, ViewChild } from '@angular/core';
import { PaginatorComponent } from '../../common/paginator/paginator.component';
import { Babies, Baby } from '../../../../types';
import { faArrowsRotate, IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { DateStrPipe } from "../../../utils/date_pipe";
import { NgFor, NgIf } from '@angular/common';
import { ModalDialogComponent } from '../../common/modal-dialog/modal-dialog.component';
import { RawMaterialDialogComponent } from '../../raw-material/raw-material-dialog/raw-material-dialog.component';
import { RouterModule } from '@angular/router';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';
import { BabiesService } from '../../../services/babies.service';
import { BabyEditorDialogComponent } from "../../babies/baby-editor-dialog/baby-editor-dialog.component";

@Component({
  selector: 'app-babies-table',
  standalone: true,
  imports: [ NgFor, DateStrPipe, PaginatorComponent, ModalDialogComponent, RawMaterialDialogComponent, RouterModule, FaIconComponent, FontAwesomeModule, NgIf, NgSelectModule, FormsModule, BabyEditorDialogComponent ],
  templateUrl: './babies-table.component.html',
  styleUrl: './babies-table.component.scss'
})
export class BabiesTableComponent implements OnInit, AfterViewInit, AfterViewChecked, OnChanges {
  @Input() raw_material_id!: number;
  loading: boolean = true;
  current_page = 1;
  rowsPerPage:number = 5;
  babies: Baby[] = [];
  @ViewChild("paginator") paginator!: PaginatorComponent;
  faArrowsRotate: IconDefinition = faArrowsRotate;
  @ViewChild("baby_editor") babyEditorDialog!: ModalDialogComponent;

  constructor(private babiesService: BabiesService) {  }

  getBabiesForRawMaterial(page: number){
    this.babiesService.getBabiesForRawMaterial({  raw_material_id: this.raw_material_id, page: page, perPage:this.rowsPerPage }).subscribe(
    {
      next: (babies: Babies) => {
        if(babies && babies.data && babies.data.length)
        {  
          this.loading = false;
          this.current_page = page;
          this.babies = babies.data;
          this.paginator.pages = babies.meta.total_pages;
          this.paginator.current_page = babies.meta.page;
        }
        else
        {
          this.loading = false;
          this.current_page = 1;
          this.babies = [];
          this.paginator.pages = 0;
          this.paginator.current_page = 0;
        }
      },
      error: (error) => {
        console.log(error);
      }
    })
  }

  ngOnInit(){
  }

  ngAfterViewInit() {
  }
  
  ngAfterViewChecked (){
  }

  ngOnChanges () {
    this.getBabiesForRawMaterial(1);
  }

  pageChange (page: number) {
    this.getBabiesForRawMaterial(page);
  }

  openDialog () {
    this.babyEditorDialog.open();
  }
}
