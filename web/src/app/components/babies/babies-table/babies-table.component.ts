import { AfterViewChecked, AfterViewInit, Component, Input, OnChanges, OnInit, Output, ViewChild } from '@angular/core';
import { PaginatorComponent } from '../../common/paginator/paginator.component';
import { Babies, Baby } from '../../../../types';
import { faArrowsRotate, faTrash, faTrashAlt, faTrashCan, IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { DateStrPipe } from "../../../utils/date_pipe";
import { DecimalPipe, NgFor, NgIf } from '@angular/common';
import { ModalDialogComponent } from '../../common/modal-dialog/modal-dialog.component';
import { RouterModule } from '@angular/router';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';
import { BabiesService } from '../../../services/babies.service';
import { BabyEditorDialogComponent } from "../../babies/baby-editor-dialog/baby-editor-dialog.component";
import { ConfirmationDialogComponent } from '../../common/confirmation-dialog/confirmation-dialog.component';

enum DialogMode {
  Add,
  Edit
};

@Component({
  selector: 'app-babies-table',
  standalone: true,
  imports: [ NgFor, DateStrPipe, PaginatorComponent, ModalDialogComponent, RouterModule, FaIconComponent, FontAwesomeModule, NgIf, NgSelectModule, FormsModule, BabyEditorDialogComponent, ConfirmationDialogComponent, FaIconComponent, DecimalPipe ],
  templateUrl: './babies-table.component.html',
  styleUrl: './babies-table.component.scss'
})


export class BabiesTableComponent implements OnInit, AfterViewInit, AfterViewChecked, OnChanges {
  @Input() raw_material_id!: number;
  @Input() is_new_material: Boolean = false; //don't load babies if this is a new material
  @Input() show_material_col: Boolean = true; //don't load babies if this is a new material
  @Input() loadAll: Boolean = true;   //load all regardless of material
  @Input() readOnly: Boolean = true;  //Disable adding/deleting
  @Input() paged: Boolean = true;     //enable pagination
  @Input() bigTitle: Boolean = true;  //enable big page title
  @ViewChild("paginator") paginator!: PaginatorComponent;
  @ViewChild("baby_editor") babyEditorDialog!: ModalDialogComponent;
  loading: boolean = true;
  current_page = 1;
  rowsPerPage:number = 5;
  totalRecords: number = 0;
  totalquantity: number = 0;
  @Output() babies: Baby[] = [];
  faArrowsRotate: IconDefinition = faArrowsRotate;
  dialogMode: DialogMode = DialogMode.Add;
  faTrashCan: IconDefinition = faTrashCan;


  constructor(private babiesService: BabiesService) {  
  }

  getBabies(page: number){
    const params = {
    } as any;

    if(this.paged) {
      params.page = page;
      params.perPage = this.rowsPerPage;
    }
    
    if(this.raw_material_id && !this.loadAll)
    {
      params.raw_material_id = this.raw_material_id;
    }

    this.babiesService.getBabies(params).subscribe(
    {
      next: (babies: Babies) => {
        if(babies && babies.data && babies.data.length)
        {  
          this.loading = false;
          this.current_page = page;
          this.babies = babies.data;
          if(this.paged) {
            this.paginator.pages = babies.meta.total_pages;
            this.paginator.current_page = babies.meta.page;
          }
          this.totalRecords = babies.meta.total_records;
          this.totalquantity = babies.meta.sum_quantity;
        }
        else
        {
          this.loading = false;
          this.current_page = 1;
          this.babies = [];
          if(this.paged) {
            this.paginator.pages = 0;
            this.paginator.current_page = 0;
          }
          this.totalRecords = 0;
          this.totalquantity = 0;
        }
      },
      error: (error) => {
        console.log(error);
      }
    })
  }

  ngOnInit(){
  }

  recalculateTotalsOnClient (){
    this.totalRecords = this.babies.length;
    this.totalquantity = this.babies.reduce((total, { quantity }) => total + quantity, 0);
  }

  ngAfterViewInit() {
    if(this.loadAll){
      this.getBabies(1);
    }

    this.babyEditorDialog.confirm.subscribe((baby:Baby) => {
      if(this.dialogMode == DialogMode.Add)
      {
        let matchingBabyLength = this.babies.find(b => b.length === baby.length);
        if(matchingBabyLength) {
          matchingBabyLength.quantity += baby.quantity;
        }
        else {
          this.babies.push(baby);
        }
      }
      this.recalculateTotalsOnClient();
    });
  }

  ngAfterViewChecked (){
  }

  ngOnChanges () {
    if(!this.is_new_material)
    {
      this.getBabies(1);
    }
    else
    {
      this.loading = false;
    }
  }

  pageChange (page: number) {
    if(!this.is_new_material)
    {
        this.getBabies(page);
    }
    else
    {
      this.loading = false;
    }
  }

  openDialog (baby?:Baby | null) {
    if(!this.readOnly) {
      if(baby == null) {
        this.dialogMode = DialogMode.Add;
        this.babyEditorDialog.dialog_content_component.editedObject = {
          id: 0, raw_material_parent_id: 0,  raw_material: '',
          length: 0, quantity: 0,
          created_at: new Date(), updated_at: new Date(),
          created_by: 1, updated_by: 1
        };
        this.babyEditorDialog.modalTitle = "<span class='icon-baby'></span> Add new babies";
      }
      else {
        this.dialogMode = DialogMode.Edit;
        this.babyEditorDialog.modalTitle = "<span class='icon-baby'></span> Edit babies";
        this.babyEditorDialog.dialog_content_component.editedObject = baby;
      }
      this.babyEditorDialog.open();
    }
  }

  deleteBaby(baby: Baby) {
    let babyIndex = this.babies.findIndex(b => b.id == baby.id);
    if(babyIndex >= 0)
    {
      this.babies.splice(babyIndex, 1);
    }
    this.recalculateTotalsOnClient();
  }
}
