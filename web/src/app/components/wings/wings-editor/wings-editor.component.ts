import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, HostListener, OnDestroy, OnInit, viewChild, ViewChild } from '@angular/core';
import { ConfirmationDialogComponent } from '../../common/confirmation-dialog/confirmation-dialog.component';
import { faArrowLeft, faArrowUp, faL, faSave, faTimesCircle, faTrashAlt, IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { Wing, WingBaby } from '../../../../types';
import { FormsModule, NgForm } from '@angular/forms';
import { WingsService } from '../../../services/wings.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { DecimalPipe, NgFor, NgIf, PlatformLocation } from '@angular/common';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { WingsBabiesTableComponent } from '../wings-babies-table/wings-babies-table.component';
import { WingDiagramComponent } from '../wing-diagram/wing-diagram.component';
import { PrefixPipe } from "../../../utils/pipes/prefix-pipe";
import { BabiesLengthPickerComponent } from "../../babies/babies-length-picker/babies-length-picker.component";
import { BabyLengthModalComponent } from '../baby-length-modal/baby-length-modal.component';
import { ModalDialogComponent } from '../../common/modal-dialog/modal-dialog.component';
import { ToastService } from '../../../services/toast.service';
import { HasUnsavedChanges } from '../../../guards/unsaved-changes-guard';
import { Observable } from 'rxjs';
import { UnsavedChangesDialogComponent } from '../../common/unsaved-changes-dialog/unsaved-changes-dialog.component';
import { UnsavedNavigationConfirmationService } from '../../../services/unsaved-navigation-confirmation.service';
import { NavigatedMessageComponent } from '../../common/navigated-message/navigated-message.component';
import { StateService } from '../../../services/state.service';
import { SortBabiesPipe } from '../../../utils/pipes/sort-babies-pipe';

@Component({
  selector: 'app-wings-editor',
  standalone: true,
  imports: [ ConfirmationDialogComponent, FormsModule, NgIf, NgFor, FaIconComponent, WingsBabiesTableComponent, 
    WingDiagramComponent, PrefixPipe, BabiesLengthPickerComponent, BabyLengthModalComponent, 
    UnsavedChangesDialogComponent, DecimalPipe, SortBabiesPipe ],
  templateUrl: './wings-editor.component.html',
  styleUrl: './wings-editor.component.scss',/*
  changeDetection: ChangeDetectionStrategy.OnPush*/
  
})
export class WingsEditorComponent extends NavigatedMessageComponent implements OnInit, AfterViewInit,/*, OnDestroy*/ HasUnsavedChanges {

  faSave: IconDefinition = faSave;
  faTrashAlt:IconDefinition = faTrashAlt;
  faArrowLeft:IconDefinition = faArrowLeft;
  faTimesCircle:IconDefinition = faTimesCircle;
  faArrowUp: IconDefinition = faArrowUp;
  title: string = "Create Wing";
  is_new_wing: Boolean = true;

  crown_units: number = 0;
  crown_length: number = 0;
  total_wing_height: number = 0;

  @ViewChild("diagram") diagram!: WingDiagramComponent;
  @ViewChild("wingName", { read: ElementRef }) wingName!: ElementRef;
  @ViewChild('wingForm') wingForm!: NgForm;
  @ViewChild('delete_confirmation') delete_confirmation!: ConfirmationDialogComponent;
  @ViewChild("btn_save", { read: ElementRef }) btn_save!: ElementRef;
  @ViewChild("top_picker") top_picker!: BabiesLengthPickerComponent;
  @ViewChild('unsaved_changes_dialog') unsaved_changes_dialog!: UnsavedChangesDialogComponent;
  //@ViewChild("length_editor") length_editor! :ModalDialogComponent;
  @ViewChild("length_editor") length_editor! :BabyLengthModalComponent;

  @ViewChild("crown_size", { read: ElementRef }) crown_size!: ElementRef;
  @ViewChild("crown_picker") crown_picker!: BabiesLengthPickerComponent;
  @ViewChild("diagram_container", { read: ElementRef }) diagram_container!: ElementRef;
  @ViewChild("wing_preview", { read: ElementRef }) wing_preview!: ElementRef;

  wing_id: number = 0;

  public wing : Wing = {
    id: 0,
    name: '',
    knife: 0,
    babies: [],
    allow_shortening_babies_in_pairs: false
  }
  crown_babies_options = Array(5).fill(0).map((_, i)=> i+1);

  // for opening the unsave changes dialog
  private confirmResult: boolean | null = null;

  constructor(
    private wingsService: WingsService, 
    private activatedRoute: ActivatedRoute, 
    private _location: PlatformLocation,
    private unsavedNavigationConfirmationService: UnsavedNavigationConfirmationService,
    router: Router, 
    stateService: StateService,
    toastService: ToastService    
  ){
      super(toastService, stateService, router);
      this.showNavigationToastIfMessagePending();
  }

  hasUnsavedChanges(): Observable<boolean> | Promise<boolean> | boolean {
    return this.unsavedNavigationConfirmationService.handle({
      hasChanges: () =>
        (!this.wingForm.pristine),

      saveFn: () => this.wingsService.saveWing(this.wing),

      confirmationDialog: this.unsaved_changes_dialog
    });
  }

  ngOnInit(): void {
    this.is_new_wing = !this.activatedRoute.snapshot.queryParamMap.has('id');
    if(!this.is_new_wing)
    {
      this.title = "Edit Wing";
      this.is_new_wing = false;
      this.wing_id = Number(this.activatedRoute.snapshot.queryParamMap.get('id'));
      this.getWing(this.wing_id);
    }
  }

  getWing(id: number){
    this.wingsService.getWing(id).subscribe(
    {
      next: (wing: Wing) => {
        this.wing = wing;
        let crownBabies = this.wing.babies.filter((b) => b.position.startsWith("C"));
        this.crown_units = crownBabies.length;
        this.crown_length = (crownBabies.length > 0)? crownBabies[0].length: 0;
        this.calculate_total_wing_height();
      },
      error: (error) => {
        console.log(error);
      }
    })
  }

  calculate_total_wing_height(){
    this.total_wing_height = this.wing.knife;
    const L1 = this.wing.babies.find(b => b.position.toUpperCase()=="L1");
    const C1 = this.wing.babies.find(b => b.position.toUpperCase()=="C1");
    const L1_len = (L1)? L1.length : 0;
    const C1_len = (C1)? C1.length : 0;
    this.total_wing_height += (L1_len + C1_len);
  }

  babies_length_clicked() {
    this.calculate_total_wing_height();
    this.wingForm.form.markAsDirty();
  }

  babyLengths(pos: string){
    return this.wing.babies.filter((b)=> b.position.startsWith(pos) ).map((b)=> b.length);
  }

  //get the length to the picker
  get_top() :number {
    let tops = this.wing.babies.filter(b => b.position == "TOP");
    return (tops.length == 0)? 0: tops[0].length;
  }
  
  //set the length from the picker
  set_top() {
    let tops = this.wing.babies.filter(b => b.position == "TOP");
    let new_length = this.top_picker.get_length();
    if(tops.length == 0) {
      this.wing.babies.push({
        id: 0,
        position: "TOP",
        length: new_length,
        wing_id: this.wing_id
      });
    }
    else {
      tops[0].length = new_length;
    }
    this.calculate_total_wing_height();
  }

  //set the crown controls according to the babies objects
  set_crown(){
    this.wingForm.form.markAsDirty();
    let num_of_crown_items = this.crown_size.nativeElement.value;
    this.crown_babies_quantity_changed(num_of_crown_items);
  }

  crown_babies_quantity_changed(new_crown_quantity: number){
    this.crown_units = new_crown_quantity;
    let new_length = this.crown_picker.get_length();
    this.crown_length = new_length;

    this.wing.babies = this.wing.babies.filter(b => !b.position.startsWith("C"));
    for(let i=0; i < new_crown_quantity; i++) {
      this.wing.babies.push({
        id: 0,
        length: new_length,
        position: "C" + (i+1),
        wing_id: this.wing_id
      })
    }
    this.calculate_total_wing_height();

  }

  save(goToHatEditor: boolean = false)
  {
    this.wingForm.form.markAllAsTouched();
    if(this.wingForm.form.valid)
    {
      this.wingForm.form.markAsPristine();
      /*
      //edit
      if(!this.is_new_wing)
      {
        const id = Number(this.activatedRoute.snapshot.queryParamMap.get('id'));
        this.updateWing(id, this.wing, goToHatEditor);
      }
      //add
      else
      {
        this.saveNewWing(this.wing, goToHatEditor);
      }
      */
      this.saveWing(this.wing, goToHatEditor);
    }
    else {
      let form = document.getElementById('wingForm');
      if(form){
        let firstInvalidControl = form.getElementsByClassName('ng-invalid')[0];
        firstInvalidControl.classList.remove("ng-invalid");
        firstInvalidControl.scrollIntoView();
        (firstInvalidControl as HTMLElement).focus();
        firstInvalidControl.classList.add("ng-invalid");
      }
    }
  }

  saveWing(wing:Wing, goToHatEditor: boolean)
  {
    this.btn_save.nativeElement.classList.add("disabled");

    this.wingsService.saveWing(wing).subscribe(
      {
        next:(data) => { 
          this.btn_save.nativeElement.classList.remove("disabled");
          if(goToHatEditor){
            this.gotoHatEditor(data['message'], wing.name ,false)
          }
          else {
            this.gotoWingsList(data['message'], false);
          }
        },
        error:(error) => { 
          this.btn_save.nativeElement.classList.remove("disabled");  
          //console.dir(error); 
          this.toastService.showError(error.error["message"]); }
      }
    );
  }
/*
  updateWing(id: number, wing:Wing, goToHatEditor: boolean)
  {
    this.btn_save.nativeElement.classList.add("disabled");

    this.wingsService.updateWing(wing).subscribe(
    {
      next:(data) => { 
        this.btn_save.nativeElement.classList.remove("disabled"); 
        if(goToHatEditor){
          this.gotoHatEditor(data['message'], wing.name ,false)
        }
        else {
          this.gotoWingsList(data['message'], false); 
        }
      },
      error:(error) => { this.btn_save.nativeElement.classList.remove("disabled"); this.gotoWingsList(error, true); }
    });
  }
*/
  ngAfterViewInit() {
    this.wingName.nativeElement.focus();
    this.wingName.nativeElement.select();

    this.delete_confirmation.confirm.subscribe((value: Boolean) => {
      this.wingsService.deleteWing(this.wing.id).subscribe(
        {
          next:(data) => {
            this.gotoWingsList(data['message'], false);
          }
        });
    });    
  }

  confirm_delete() {
    this.delete_confirmation.open();
  }

  gotoWingsList(textInfo: string = '', isError: Boolean = false) {
    this.router.navigate(['templates/wings'], {
      state: {
        info: { 
          textInfo: textInfo, 
          isError: isError 
        }
      },
    });
  }

  gotoHatEditor(textInfo: string = '', wingName: string="", isError: Boolean = false) {
    this.router.navigate(['templates/hats/editor'], {
      state: {
        info: { 
          textInfo: textInfo,
          wingName: wingName,
          isError: isError 
        }
      },
    });
  }
  
  diagram_babyClicked(baby_pos: string){
    let b = this.wing.babies.find((baby) => baby.position.toUpperCase() == baby_pos.toUpperCase());
    if(b) {
      this.openLengthModal(b);
    }
  }

  openLengthModal(obj: WingBaby){
    this.length_editor.editedObject = obj;
    this.length_editor.dialogWrapper!.modalTitle = "Edit " + ((obj.position.toUpperCase().startsWith("C"))? "Crown" : obj.position);
    this.crown_units = this.wing.babies.filter((b) => b.position.startsWith("C")).length;
    this.length_editor.crown_units = this.crown_units;
    this.length_editor.crown_babies_options = this.crown_babies_options;
    this.length_editor.dialogWrapper!.open();
  }

  length_editor_closed(){
    this.crown_units =  this.length_editor.crown_units;
    this.crown_size.nativeElement.value =  this.length_editor.crown_units;
    this.set_crown();
    this.calculate_total_wing_height();
  }

  modal_length_Changed(obj: WingBaby){
      //for crown, don't close immediately, but update the crown length
      if(obj.position.toUpperCase().startsWith("C")) {
      this.crown_length = obj.length;
    }
    else {
      this.length_editor.dialogWrapper!.onConfirm();
    }

    //"refresh" the array, to detect the change
    this.wing.babies = this.wing.babies.map(el => Object.assign({}, el));
    this.form_touched();
    this.calculate_total_wing_height();
  }

  form_touched() {
    //window.addEventListener('beforeunload', (e) => {  console.log(this); /*e.preventDefault();*/ e.returnValue="hello"; return false; });
  }

  scrollToFullDiagram() {
    this.diagram_container.nativeElement.scrollIntoView();
  }

  // Listen for the window scroll event
  @HostListener('window:scroll', [])
  onWindowScroll(): void {
    const elementPosition = this.diagram_container.nativeElement.getBoundingClientRect().top;
   if(elementPosition < 0){
      this.wing_preview.nativeElement.classList.remove("hidden_preview");
    } else {
      this.wing_preview.nativeElement.classList.add("hidden_preview");
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize($event: any) {
    /*
    console.log(window.innerWidth);
    if (window.innerWidth <= 652 ) {
      this.diagram.scale = 0.3;
      this.diagram.Rebuild();
    }
    else {
      this.diagram.scale = 1;
      this.diagram.pan.y = 0;
      this.diagram.Rebuild();
    }*/
  }
}


