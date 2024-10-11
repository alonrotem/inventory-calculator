import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, OnInit, viewChild, ViewChild } from '@angular/core';
import { ConfirmationDialogComponent } from '../../common/confirmation-dialog/confirmation-dialog.component';
import { faArrowLeft, faSave, faTimesCircle, faTrashAlt, IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { Hat, Wing, WingBaby } from '../../../../types';
import { FormsModule, NgForm } from '@angular/forms';
import { WingsService } from '../../../services/wings.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NgFor, NgIf } from '@angular/common';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { BabiesLengthPickerComponent } from "../../babies/babies-length-picker/babies-length-picker.component";
import { ModalDialogComponent } from '../../common/modal-dialog/modal-dialog.component';
import { HatsService } from '../../../services/hats.service';
import { NgOption, NgSelectComponent, NgSelectModule } from '@ng-select/ng-select';
import { WingDiagramComponent } from '../../wings/wing-diagram/wing-diagram.component';
import { PrefixPipe } from '../../../utils/pipes/prefix-pipe';
import { ToastService } from '../../../services/toast.service';
import { RawMaterialsService } from '../../../services/raw-materials.service';
import { AutocompleteComponent, AutocompleteLibModule } from 'angular-ng-autocomplete';


@Component({
  selector: 'app-hats-editor',
  standalone: true,
  imports: [ ConfirmationDialogComponent, FormsModule, NgIf, FaIconComponent, NgSelectModule, WingDiagramComponent, PrefixPipe, AutocompleteLibModule ],
  templateUrl: './hats-editor.component.html',
  styleUrl: './hats-editor.component.scss'
})
export class HatsEditorComponent  implements OnInit, AfterViewInit{
  faSave: IconDefinition = faSave;
  faTrashAlt:IconDefinition = faTrashAlt;
  faTimesCircle:IconDefinition = faTimesCircle;
  title: string = "Create Hat";
  is_new_hat: Boolean = true;

  @ViewChild("hatName", { read: ElementRef }) hatName!: ElementRef;
  @ViewChild('hatForm') hatForm!: NgForm;
  @ViewChild('delete_confirmation') delete_confirmation!: ConfirmationDialogComponent;
  @ViewChild("btn_save", { read: ElementRef }) btn_save!: ElementRef;
  @ViewChild("wing_name_selector") wing_name_selector! :NgSelectComponent;
  @ViewChild("diagram") diagram! :WingDiagramComponent;
  @ViewChild("numberOfWings", { read: ElementRef }) numberOfWings!: ElementRef;
  @ViewChild("hatmaterialName") hatmaterialName! :AutocompleteComponent;
  @ViewChild("crownmaterialName") crownmaterialName! :AutocompleteComponent;

  hat_id: number = 0;

  public hat : Hat = {
    id: 0,
    name: '',
    wings: [],
    hat_material: '',
    crown_material: ''
  }
  wing_names : string[] = [];
  blank_wing: Wing = {
    id: 0,
    name: '',
    width: 0,
    babies: []
  };
  wing: Wing = this.blank_wing;
  wing_exists = false;
  wing_loaded = false;
  active_wing_name :string = "";
  raw_material_names: string[] = [];
  faArrowLeft: IconDefinition = faArrowLeft;

  constructor(private hatsService: HatsService, private wingsService: WingsService, private activatedRoute: ActivatedRoute, private router: Router, private toastService:ToastService, private rawMaterialsService: RawMaterialsService){
    this.rawMaterialsService.getRawMaterialNames().subscribe({
      next: (names)=> {
        this.raw_material_names = names;
      }
    });

    let nav = this.router.getCurrentNavigation();
    if (nav && nav.extras.state && nav.extras.state['info'] && nav.extras.state['info']['textInfo']) {
      let info = nav.extras.state['info']['textInfo'];
      let isError = nav.extras.state['info']['isError'];
      let wingName = nav.extras.state['info']['wingName'];
      if(isError)
      {
        this.toastService.showError(info);
      }
      else
      {
        this.toastService.showSuccess(info);
      }
      this.active_wing_name = wingName;
      /*
      if(!this.hat.wings || this.hat.wings.length == 0 || !this.hat.wings[0])
        this.hat.wings.push({
          id: 0,
          parent_hat_id: 0,
          wing_name: '',
          wing_quantity: 0
        });
        this.hat.wings[0].wing_name = wingName;
        */
    }    
  }

  addWingNameToList(wing:string){
    return wing;
  }

  wing_name_change(selected_wing_name:string){
    this.active_wing_name = selected_wing_name;
    if(!selected_wing_name) {
      this.wing_loaded = false;
    }
    else {
      this.wingsService.getWingByName(selected_wing_name).subscribe({
        next: (wing:Wing) => {
          this.wing_loaded = true;
          if(Object.keys(wing).length > 0) {
            this.wing = wing;
            this.wing_exists = true;
            //this.numberOfWings.nativeElement.value = 
          }
          else {
            this.wing = this.blank_wing;
            this.wing_exists = false;
          }
        }
      });
    }
  }

  ngOnInit(): void {
    this.is_new_hat = !this.activatedRoute.snapshot.queryParamMap.has('id');
    this.getWingNames();
    if(!this.is_new_hat)
    {
      this.title = "Edit Hat";
      this.is_new_hat = false;
      this.hat_id = Number(this.activatedRoute.snapshot.queryParamMap.get('id'));
      this.getHat(this.hat_id);
    }
  }

  ngAfterViewInit(): void {
    this.hatName.nativeElement.focus();
    this.hatName.nativeElement.select();

    this.delete_confirmation.confirm.subscribe((value: Boolean) => {
      this.hatsService.deleteHat(this.hat.id).subscribe(
        {
          next:(data) => {
            this.gotoHatsList(data['message'], false);
          }
        });
    });

    //if(selected_wing) {
    //  let item = this.wing_name_selector.itemsList.findByLabel('RT100');
    //  this.wing_name_selector.select(item);
    //}
  }

  getWingNames(){
    this.wingsService.getWingsNames().subscribe({
      next: (names: string[]) => {
        this.wing_names = names;
      }
    });
  }

  getHat(id: number){
    this.hatsService.getHat(id).subscribe(
    {
      next: (hat: Hat) => {
        this.hat = hat;
        //this.wing_name_selector.set
        if(hat.wings && hat.wings.length > 0) {
          this.numberOfWings.nativeElement.value = this.hat.wings[0].wing_quantity;
          this.active_wing_name = this.hat.wings[0].wing_name;
          this.wing_name_change(this.hat.wings[0].wing_name);
        }
      },
      error: (error) => {
        console.log(error);
      }
    })
  }

  save(createWing: boolean = false)
  {
    this.hatForm.form.markAllAsTouched();
    if(this.hatForm.form.valid)
    {
      if(!this.hat.wings || this.hat.wings.length == 0) {
        this.hat.wings.push({
          id: 0,
          parent_hat_id: this.hat.id,
          wing_name: this.active_wing_name,
          wing_quantity: this.numberOfWings.nativeElement.value
        });
      }
      else {
        this.hat.wings[0].parent_hat_id = this.hat.id;
        this.hat.wings[0].wing_name = this.active_wing_name;
        this.hat.wings[0].wing_quantity = this.numberOfWings.nativeElement.value;
      }
      
      //edit
      if(!this.is_new_hat)
      {
        const id = Number(this.activatedRoute.snapshot.queryParamMap.get('id'));
        this.updateHat(id, this.hat, createWing);
      }
      //add
      else
      {
        this.saveNewHat(this.hat, createWing);
      }
    }
  }

  saveNewHat(hat:Hat, goToCreateWing: boolean = false)
  {
    this.btn_save.nativeElement.classList.add("disabled");

    this.hatsService.saveNewHat(hat).subscribe(
      {
        next:(data) => { 
          this.btn_save.nativeElement.classList.remove("disabled"); 
          if(goToCreateWing && hat.wings && hat.wings.length > 0 && hat.wings[0].wing_name) {
            this.gotoCreateWing(hat.wings[0].wing_name, data['message'], false);
          }
          else {
            this.gotoHatsList(data['message'], false);
          }
        },
        error:(error) => { 
          this.btn_save.nativeElement.classList.remove("disabled"); 
          this.gotoHatsList(error, true); 
        }
      }
    );
  }

  updateHat(id: number, hat:Hat, goToCreateWing: boolean = false)
  {
    this.btn_save.nativeElement.classList.add("disabled");

    this.hatsService.updateHat(hat).subscribe(
    {
      next:(data) => { 
        this.btn_save.nativeElement.classList.remove("disabled"); 
        if(goToCreateWing && hat.wings && hat.wings.length > 0 && hat.wings[0].wing_name) {
          this.gotoCreateWing(hat.wings[0].wing_name, data['message'], false);
        }
        else {
          this.gotoHatsList(data['message'], false); 
        }
      },
      error:(error) => { 
        this.btn_save.nativeElement.classList.remove("disabled"); 
        this.gotoHatsList(error, true); 
      }
    });
  }

  confirm_delete() {
    this.delete_confirmation.open();
  }

  gotoHatsList(textInfo: string = '', isError: Boolean = false) {
    this.router.navigate(['templates/hats'], {
      state: {
        info: { 
          textInfo: textInfo, 
          isError: isError 
        }
      },
    });
  }

  gotoCreateWing(wingName: string = '', textInfo: string = '', isError: Boolean = false) {
    this.router.navigate(['templates/wings/editor'], {
      state: {
        info: { 
          wingName: wingName,
          textInfo: textInfo,
          isError: isError 
        }
      },
    });
  }

  wall_material_changed(value:string){
      this.hat.crown_material = value;
  }

  wall_material_cleared(){
      this.hat.crown_material = "";
  }
}
