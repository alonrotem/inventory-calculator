import { ChangeDetectionStrategy, Component, ElementRef, OnInit, viewChild, ViewChild } from '@angular/core';
import { ConfirmationDialogComponent } from '../../common/confirmation-dialog/confirmation-dialog.component';
import { faSave, faTimesCircle, faTrashAlt, IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { Wing, WingBaby, WingPosition } from '../../../../types';
import { Form, FormsModule, NgForm } from '@angular/forms';
import { WingsService } from '../../../services/wings.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NgFor, NgIf } from '@angular/common';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { WingsBabiesTableComponent } from '../wings-babies-table/wings-babies-table.component';
import { WingDiagramComponent } from '../wing-diagram/wing-diagram.component';
import { PrefixPipe } from "../wings-babies-table/prefix-pipe";
import { BabiesLengthPickerComponent } from "../../babies/babies-length-picker/babies-length-picker.component";

@Component({
  selector: 'app-wings-editor',
  standalone: true,
  imports: [ConfirmationDialogComponent, FormsModule, NgIf, NgFor, FaIconComponent, WingsBabiesTableComponent, WingDiagramComponent, PrefixPipe, BabiesLengthPickerComponent],
  templateUrl: './wings-editor.component.html',
  styleUrl: './wings-editor.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WingsEditorComponent implements OnInit {

  faSave: IconDefinition = faSave;
  faTrashAlt:IconDefinition = faTrashAlt;
  faTimesCircle:IconDefinition = faTimesCircle;
  title: string = "Create Wing";
  is_new_wing: Boolean = true;

  crown_units: number = 0;
  crown_length: number = 0;

  @ViewChild("diagram") diagram!: WingDiagramComponent;
  @ViewChild("wingName", { read: ElementRef }) wingName!: ElementRef;
  @ViewChild('wingForm') wingForm!: NgForm;
  @ViewChild('delete_confirmation') delete_confirmation!: ConfirmationDialogComponent;
  @ViewChild("btn_save", { read: ElementRef }) btn_save!: ElementRef;
  @ViewChild("top_picker") top_picker!: BabiesLengthPickerComponent;

  @ViewChild("crown_size", { read: ElementRef }) crown_size!: ElementRef;
  @ViewChild("crown_picker") crown_picker!: BabiesLengthPickerComponent;

  wing_id: number = 0;

  public wing : Wing = {
    id: 0,
    name: '',
    babies: []
  }
  crown_babies_options = Array(5).fill(0).map((_, i)=> i+1)

  constructor(private wingsService: WingsService, private activatedRoute: ActivatedRoute, private router: Router){
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
      },
      error: (error) => {
        console.log(error);
      }
    })
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
        /*id: 0,*/
        position: "TOP",
        length: new_length,
        wing_id: this.wing_id
      });
    }
    else {
      tops[0].length = new_length;
    }
  }

  //set the crown controls according to the babies objects
  set_crown(){
    console.log(this.crown_size.nativeElement);
    let num_of_crown_items = this.crown_size.nativeElement.value;
    let new_length = this.crown_picker.get_length(); 
    this.crown_units = num_of_crown_items;
    this.crown_length = new_length;

    this.wing.babies = this.wing.babies.filter(b => !b.position.startsWith("C"));
    for(let i=0; i < num_of_crown_items; i++) {
      this.wing.babies.push({
        length: new_length,
        position: "C" + (i+1),
        wing_id: this.wing_id
      })
    }
  }

  save()
  {
    this.wingForm.form.markAllAsTouched();
    if(this.wingForm.form.valid)
    {
      //this.wing.babies = this.babiesLeft.concat(this.babiesRight).concat(this.babiesCrown).concat(this.babiesTop);

      //edit
      if(!this.is_new_wing)
      {
        const id = Number(this.activatedRoute.snapshot.queryParamMap.get('id'));
        this.updateWing(id, this.wing);
      }
      //add
      else
      {
        this.saveNewWing(this.wing);
      }
    }
  }

  saveNewWing(wing:Wing)
  {
    this.btn_save.nativeElement.classList.add("disabled");

    this.wingsService.saveNewWing(wing).subscribe(
      {
        next:(data) => { this.btn_save.nativeElement.classList.remove("disabled"); this.gotoWingsList(data['message'], false); },
        error:(error) => { this.btn_save.nativeElement.classList.remove("disabled"); this.gotoWingsList(error, true); }
      }
    );
  }

  updateWing(id: number, wing:Wing)
  {
    this.btn_save.nativeElement.classList.add("disabled");

    this.wingsService.updateWing(wing).subscribe(
    {
      next:(data) => { this.btn_save.nativeElement.classList.remove("disabled"); this.gotoWingsList(data['message'], false); },//this.getRawMaterials(this.current_page); },
      error:(error) => { this.btn_save.nativeElement.classList.remove("disabled"); this.gotoWingsList(error, true); }
    });
  }

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
    //this.location.back();
    this.router.navigate(['templates/wings'], {
      state: {
        info: { 
          textInfo: textInfo, 
          isError: isError 
        }
      },
    });
  }
}


