import { AfterViewInit, Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { HatsService } from '../../../services/hats.service';
import { WingsService } from '../../../services/wings.service';
import { Baby, Customer_Baby, Customer_Bank, Customer_Bank_Baby_Allocation, Hat, HatBasicInfo, nameIdPair, Wing, WingBaby } from '../../../../types';
import { DecimalPipe, NgFor, NgIf } from '@angular/common';
import { WingDiagramComponent } from '../../wings/wing-diagram/wing-diagram.component';
import { PrefixPipe } from '../../../utils/pipes/prefix-pipe';
import { FilterPipe } from '../../../utils/pipes/filter-pipe';
import { environment } from '../../../../environments/environment';
import { Lightbox, LightboxModule } from 'ngx-lightbox';
import { GlobalsService } from '../../../services/globals.service';
import { faChartPie, IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { AllocationPickerComponent } from '../allocation-picker/allocation-picker.component';
import { se } from 'date-fns/locale';
import { StartsWithPipe } from '../../../utils/pipes/starts-with-pipe';

export interface aggregated_babies { 
  length: number; 
  quantity: number; 
  position: string, 
  quantity_in_allocation: number,
  possible_num_of_hats: number
};

@Component({
  selector: 'app-single-hat-calculator',
  standalone: true,
  imports: [ 
    NgSelectModule, FormsModule, NgFor, NgIf, DecimalPipe, 
    WingDiagramComponent, PrefixPipe, FilterPipe, StartsWithPipe, LightboxModule,
    AllocationPickerComponent, FaIconComponent
  ],
  templateUrl: './single-hat-calculator.component.html',
  styleUrl: './single-hat-calculator.component.scss'
})
export class SingleHatCalculatorComponent implements OnInit, AfterViewInit {

  hats_info: HatBasicInfo[] = [];
  wing: Wing | null = null;
  active_hat: HatBasicInfo | null = null;
  hat_babies: aggregated_babies[] = [];
  //crown_babies are used only if the allocations are split between hat and crown
  crown_babies: aggregated_babies[] = [];
  server_url: string = environment.serverUrl;
  album: any[] = [];
  previewUrl:string = "";
  no_hat_img = "/assets/images/no-hat-picture-dark.png";
  no_hat_message = "No photo for this hat";
  previeImgTitle = this.no_hat_message;
  @ViewChild("diagram") diagram!: WingDiagramComponent;
  @ViewChild("allocation_picker") allocation_picker!: AllocationPickerComponent;
  wall_alocation: Customer_Bank_Baby_Allocation | null = null;
  crown_allocation: Customer_Bank_Baby_Allocation | null = null;
  wall_allocation_units : string = "";
  crown_allocation_units : string = "";
  num_of_allocations_with_wall_material = 0;
  num_of_allocations_with_crown_material = 0;
  pending_allocation_area_selection = ""; // wall/crown
  faChartPie: IconDefinition = faChartPie;
  console=console;

  @Input() banks: Customer_Bank[] = [];
  @Input() banks_baby_allocations: Customer_Bank_Baby_Allocation[] = [];
  @Input() babies: Customer_Baby[] = [];

  total_num_of_possible_hats: number = 0;
  highlight_lowest_number_in_table: boolean =  false;

  //wall_babies_aggregated_by_length: { [key: number]: { quantity: number; position: string }} [] = [];
  /*
  wall_babies_aggregated_by_length: Record<number, { quantity: number; position: string }> = [];
  crown_babies_aggregated_by_length: Record<number, { quantity: number; position: string }> = [];
  //crown_babies_aggregated_by_length: { [key: number]: { quantity: number; position: string }} [] = [];
  cachedKeys: number[] = [];

  -------------------------------------------------------
  When selecting a wing: make an initial aggregation
  When selecting allocation(s)
    Make a new aggregation

    If the allocations are different: split the crown
    If the allocations are the same (or just one), keep crown in one place
  */

    aggregateHatBabiesAndMatchingAllocations(){
      //{ length: number; quantity: number; position: string, quantity_in_allocation: number }
      this.total_num_of_possible_hats = Infinity;
      this.hat_babies = [];
      this.crown_babies = [];
      let wall_allocation_id = (this.wall_alocation)? this.wall_alocation.id : -1;
      let crown_allocation_id = (this.crown_allocation)? this.crown_allocation.id : -1;

      if(this.wing){
        this.wing.babies.forEach((wingBaby: WingBaby) => {
          let appended = false;
          if(wingBaby.position.startsWith("C")){
            //keep crown babies separate
            if(this.crown_allocation && crown_allocation_id != wall_allocation_id) {
              this.append_to_babies_collection(this.crown_babies, wingBaby, this.crown_allocation);
              appended = true;
            }
            else {
              this.append_to_babies_collection(this.hat_babies, wingBaby, this.wall_alocation);
              appended = true;
            }
          }
          if(!appended) {
            this.append_to_babies_collection(this.hat_babies, wingBaby, this.wall_alocation);
          }
        });
      }
      this.hat_babies.sort((a,b) => {return b.length - a.length});
      this.crown_babies.sort((a,b) => {return b.length - a.length});
    }

    append_to_babies_collection(babies_collection: aggregated_babies[], wingBaby: WingBaby, allocation: Customer_Bank_Baby_Allocation | null) {
      let append_to_item = babies_collection.find(baby => baby.length == wingBaby.length);
      let babies_in_allocation = (allocation) ? this.babies.filter(b => b.customer_banks_babies_id == allocation.id) : [];
      let baby_in_allocation_with_length = babies_in_allocation.find(b => b.length == wingBaby.length);
      let allocation_quantity = (baby_in_allocation_with_length)? baby_in_allocation_with_length.quantity : 0;
      let quantity_in_wing = ((this.active_hat)? this.active_hat.wing_quantity : 0);

      if(append_to_item){
        let positions = append_to_item.position.split(", ");
        if(positions.indexOf(wingBaby.position) < 0){
          positions.push(wingBaby.position);
        }
        append_to_item.quantity += quantity_in_wing;
        append_to_item.position = positions.join(", ");
        append_to_item.possible_num_of_hats = -1;
      }
      else {
        append_to_item = {
          length: wingBaby.length,
          quantity: quantity_in_wing,
          position: wingBaby.position,
          quantity_in_allocation: allocation_quantity,
          possible_num_of_hats: -1
        };
        babies_collection.push(append_to_item);
      }
      let how_many_hats = Math.floor((append_to_item.quantity)? (allocation_quantity/append_to_item.quantity) : 0);
      if(how_many_hats < this.total_num_of_possible_hats) {
        //if the total number of hats has already been found, but we found a lower value of it
        //or if the number of hats has dropped to 0
        //this will be highlighted in the table, showing the lowest hat baby allocation
        if(this.total_num_of_possible_hats < Infinity || how_many_hats == 0) {
          this.highlight_lowest_number_in_table = true;
        }
        this.total_num_of_possible_hats = how_many_hats;
      }
      append_to_item.possible_num_of_hats = how_many_hats;
    }

  constructor(
    private hatsService: HatsService, 
    private wingsService:WingsService, 
    private lightbox: Lightbox,
    private globalsService: GlobalsService
  ) {
    this.globalsService.themeChanged.subscribe((theme: string) => {
      this.no_hat_img = `/assets/images/no-hat-picture-${theme}.png`;
      this.previeImgTitle = this.no_hat_message;
    });

  }

  ngAfterViewInit(): void {
    this.no_hat_img = `/assets/images/no-hat-picture-${this.globalsService.currentTheme()}.png`;
    this.previeImgTitle = this.no_hat_message;

    this.allocation_picker.dialogWrapper.confirm.subscribe({
      next: (selectedAllocationID: number) => {
        this.allocation_selected(selectedAllocationID);
      }
    });    
  }

  //invoked when the selection dialog is closed
  allocation_selected(alloc_id: number){
    // set the allocation(s)
    let alloc = this.banks_baby_allocations.find(a => a.id == alloc_id);
    if(this.pending_allocation_area_selection && alloc){
      let bank = this.banks.find(b => b.id == alloc?.customer_bank_id);
      if(this.pending_allocation_area_selection == "wall") {
        this.wall_alocation = alloc;
        this.wall_allocation_units = bank? bank.raw_material_quantity_units : "";
        if(this.active_hat && this.active_hat.crown_material == this.active_hat.crown_material){
          this.crown_allocation = alloc;
          this.crown_allocation_units = bank? bank.raw_material_quantity_units : "";
        }
      }
      else {
        this.crown_allocation = alloc;
        this.crown_allocation_units = bank? bank.raw_material_quantity_units : "";
      }
    }
    this.aggregateHatBabiesAndMatchingAllocations();
    // go through the hat babies and assign allocaiton according to the babies in it
    // first the wall, or wall+crown
    /*
    if(this.wall_alocation && this.wall_alocation.id) {

    }
  

    if(this.babies && this.crown_allocation && this.wall_alocation){
      let wall_babies_in_allocation = this.babies.filter(b => b.customer_banks_babies_id == this.wall_alocation!.id);
      let crown_babies_in_allocation = this.babies.filter(b => b.customer_banks_babies_id == this.crown_allocation!.id);

      this.hat_babies.forEach(h_b => {
        if(h_b.position.startsWith("C")) {
          let matching_babies_in_allocation = crown_babies_in_allocation.find(b => b.length == h_b.length);
          if(matching_babies_in_allocation){
            h_b.quantity_in_allocation = matching_babies_in_allocation.quantity;
          }
        }
      });
    }
    */
  }

    // Helper method to extract keys from each object
  // Helper method to extract keys from each object
  /*
  objectKeys(obj: { [key: number]: any }): number[] {
    console.log("objectKeys");
    return Object.keys(obj).map((key) => Number(key));
  }*/
/*
  append_baby_to_collection(baby:WingBaby, hat: HatBasicInfo) {
    let baby_with_length = this.hat_babies.find(b => b.length == baby.length);
    if(baby_with_length){
      let cur_quantity = baby_with_length.quantity;
      let positions = baby_with_length.position.split(", ");
      //let position = baby.position.toLocaleUpperCase().startsWith("C")? "Crown": baby.position;
      if(positions.indexOf(baby.position) < 0) {
        positions.push(baby.position);
      }
      baby_with_length.quantity = cur_quantity + hat.wing_quantity;
      baby_with_length.position = positions.join(", ");
    }
    else {
      this.hat_babies.push({
        length: baby.length,
        quantity: hat.wing_quantity,
        position: baby.position, //(baby.position.toUpperCase().startsWith("C")? "Crown": baby.position)
        quantity_in_allocation: 0
      });
    }
  }
*/
    // Create a sorted array of keys
    /*
    get sortedWallKeys(): number[] {
      console.log("sorted2")
      return Object.keys(this.wall_babies_aggregated_by_length)
        .map(key => Number(key))  // Convert string keys to numbers
        .sort((a, b) => b - a);   // Sort the keys numerically
    }

    // Create a sorted array of keys
    get sortedCrownKeys(): number[] {
      console.log("sorted")
      return Object.keys(this.crown_babies_aggregated_by_length)
        .map(key => Number(key))  // Convert string keys to numbers
        .sort((a, b) => b - a);   // Sort the keys numerically
    }

  // Function to sort the collection and cache the keys
  private sortAndCacheKeys(): void {
    console.log("sortAndCacheKeys");
    this.cachedKeys = Object.keys(this.wall_babies_aggregated_by_length)
      .map((key) => Number(key))
      .sort((a, b) => a - b);
  }
      */

  hat_selected(selectedHat: HatBasicInfo) {
    this.album = [];
    this.hat_babies = [];
    if(selectedHat) {
      this.active_hat =  selectedHat;
      this.wingsService.getWingByName(selectedHat.wing_name).subscribe((w:Wing) => {
        this.wing = w;
        /*
        //this.crown_babies_aggregated_by_length = [];
        console.dir(this.wing.babies);
        this.wing.babies.forEach(baby => {
          
          this.append_baby_to_collection(baby, selectedHat);
          /*
          //crown baby
          if(baby.position.toUpperCase().startsWith("C")) {
            
          }
          //wall baby
          else {
            this.append_baby_to_collection(this.wall_babies_aggregated_by_length, baby, selectedHat);
          }*//*
        });
        this.hat_babies.sort((a,b) => {return b.length - a.length});
        */
        this.diagram.setColors(this.globalsService.currentTheme());
        this.aggregateHatBabiesAndMatchingAllocations();
      });
      
      let banks_with_wall_materials = this.banks.filter(b => b.raw_material_name == selectedHat.hat_material).map(b => b.id);
      let banks_with_crown_materials = this.banks.filter(b => b.raw_material_name == selectedHat.crown_material).map(b => b.id);
      this.num_of_allocations_with_wall_material = this.banks_baby_allocations.filter(a => banks_with_wall_materials.indexOf(a.customer_bank_id) >= 0).length;
      this.num_of_allocations_with_crown_material = this.banks_baby_allocations.filter(a => banks_with_crown_materials.indexOf(a.customer_bank_id) >= 0).length;
      //this.sortAndCacheKeys();
      
      if(selectedHat.photo) {
        this.previewUrl = `${environment.serverUrl}${selectedHat.photo}`;
        this.album.push({
          src: this.previewUrl,
          caption: selectedHat.hat_name,
          thumb: this.previewUrl
        });
        this.previeImgTitle = "Click to view hat photo";
      }
      else {
        this.previewUrl = this.no_hat_img;
        this.previeImgTitle = this.no_hat_message;
      }
    }
    else {
      this.active_hat = null;
      this.wing = null;
      this.previewUrl = this.no_hat_img;
      this.previeImgTitle = this.no_hat_message;
    }
    //get the hat,
    //get the wing
    //get wing babies
    //--- info
    // Hat comes with: mataerials, and wings: HatWing[];
    //
    // let user select:
    // flexibility
    // allocations
    //
    //show the user
    // hat diagram (With flexibilities)
    // list babies (with flexibilities)
    // show corresponding babies from allocaions
    // total hats possible to make
  }

  open_photo(){
    if(this.album.length > 0) {
      this.lightbox.open(this.album, 0);
    }
  }

  ngOnInit(): void {
    this.hatsService.getHatsBasicInfo().subscribe(info => {
      this.hats_info = info;
    })
  }

  open_wall_material_allocation_picker(materialFilter: string, area: string){
    this.allocation_picker.dialogWrapper.modalTitle = "Pick allocation";
    this.allocation_picker.instructions = "Pick a work allocation for this hat calculation";
    this.allocation_picker.banks = this.banks.filter(bank => (materialFilter)? bank.raw_material_name == materialFilter : true);
    this.allocation_picker.banks_baby_allocations = this.banks_baby_allocations;
    this.allocation_picker.babies = this.babies;
    this.pending_allocation_area_selection = area;
    this.allocation_picker.open(0);
  }
}
