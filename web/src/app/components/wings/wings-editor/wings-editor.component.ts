import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ConfirmationDialogComponent } from '../../common/confirmation-dialog/confirmation-dialog.component';
import { faSave, faTimesCircle, faTrashAlt, IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { Wing, WingBaby, WingPosition } from '../../../../types';
import { Form, FormsModule, NgForm } from '@angular/forms';
import { WingsService } from '../../../services/wings.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NgIf } from '@angular/common';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { WingsBabiesTableComponent } from '../wings-babies-table/wings-babies-table.component';

@Component({
  selector: 'app-wings-editor',
  standalone: true,
  imports: [ ConfirmationDialogComponent, FormsModule, NgIf, FaIconComponent, WingsBabiesTableComponent ],
  templateUrl: './wings-editor.component.html',
  styleUrl: './wings-editor.component.scss'
})
export class WingsEditorComponent implements OnInit {

  faSave: IconDefinition = faSave;
  faTrashAlt:IconDefinition = faTrashAlt;
  faTimesCircle:IconDefinition = faTimesCircle;
  title: string = "Create Wing";
  is_new_wing: Boolean = true;

  @ViewChild("wingName", { read: ElementRef }) wingName!: ElementRef;
  @ViewChild('wingForm') wingForm!: NgForm;
  @ViewChild('delete_confirmation') delete_confirmation!: ConfirmationDialogComponent;
  @ViewChild("btn_save", { read: ElementRef }) btn_save!: ElementRef;

  babiesLeft : WingBaby[] = [];
  babiesRight : WingBaby[] = [];
  babiesTop : WingBaby[] = [];
  babiesCrown : WingBaby[] = [];

  left_id :number = 0;
  right_id :number  = 0;
  top_id  :number = 0;
  crown_id  :number = 0;
  wing_id: number = 0;

  public wing : Wing = {
    id: 0,
    name: '',
    babies: []
  }

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
        this.setBabies();
      },
      error: (error) => {
        console.log(error);
      }
    })
  }

  setBabies(){
    this.wingsService.getWingPositions().subscribe({
      next: (pos: WingPosition[]) => {
        this.left_id = pos.find(p => p.name.toLowerCase() == "left")?.id || 0;
        this.right_id = pos.find(p => p.name.toLowerCase() == "right")?.id || 0;
        this.top_id  = pos.find(p => p.name.toLowerCase() == "top")?.id || 0;
        this.crown_id = pos.find(p => p.name.toLowerCase() == "crown")?.id || 0;

        this.babiesLeft = this.wing.babies.filter(b => b.position_id == this.left_id);
        this.babiesRight = this.wing.babies.filter(b => b.position_id == this.right_id);
        this.babiesTop = this.wing.babies.filter(b => b.position_id == this.top_id);
        this.babiesCrown = this.wing.babies.filter(b => b.position_id == this.crown_id);
      }

    });
  }

  save()
  {
    this.wingForm.form.markAllAsTouched();
    if(this.wingForm.form.valid)
    {
      this.wing.babies = this.babiesLeft.concat(this.babiesRight).concat(this.babiesCrown).concat(this.babiesTop);

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


