import { AfterViewInit, Component, Input, OnInit, viewChild, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgSelectComponent, NgSelectModule } from '@ng-select/ng-select';
import { WingsService } from '../../../services/wings.service';
import { Customer, Customer_Bank_Baby_Allocation, CustomerHat, RawMaterialNameColor, Status, Wing, WingBaby, WingsListItem } from '../../../../types';
import { DecimalPipe, NgClass, NgFor, NgIf } from '@angular/common';
import { WingDiagramComponent } from '../../wings/wing-diagram/wing-diagram.component';
import { PrefixPipe } from '../../../utils/pipes/prefix-pipe';
import { FilterPipe } from '../../../utils/pipes/filter-pipe';
import { Lightbox, LightboxModule } from 'ngx-lightbox';
import { GlobalsService } from '../../../services/globals.service';
import { faArrowLeft, faArrowsRotate, faBasketShopping, faChartPie, faRecordVinyl, faRuler, faScissors, IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { AllocationPickerComponent } from '../allocation-picker/allocation-picker.component';
import { StartsWithPipe } from '../../../utils/pipes/starts-with-pipe';
import { RawMaterialsService } from '../../../services/raw-materials.service';
import { AutocompleteLibModule } from 'angular-ng-autocomplete';
import { ConfirmationDialogComponent } from '../../common/confirmation-dialog/confirmation-dialog.component';
import { BabyLengthModalComponent } from '../../wings/baby-length-modal/baby-length-modal.component';
import { HatAllocationEditorPickerComponent } from '../hat-allocation-editor-picker/hat-allocation-editor-picker.component';
import { aggregated_babies, HatsCalculatorService } from '../../../services/hats-calculator.service';
import { CustomersService } from '../../../services/customers.service';
import { ActivatedRoute, NavigationExtras, Router, RouterLink } from '@angular/router';
import { OrdersService } from '../../../services/orders.service';
import { ToastService } from '../../../services/toast.service';
import { OrderAdvisorComponent } from "../order-advisor/order-advisor.component";
import { StateService } from '../../../services/state.service';
import { NavigatedMessageComponent } from '../../common/navigated-message/navigated-message.component';

/*
sohortening top/crown with slider:
- shortens accordingly
- if the user manually updates a baby, 
    - it remains as the user wanted
    - the wing is in custom mode
    - updates the "unchanged wing" - just the baby
    - will be saved for the user
- if the user manually updates the top, the wing resores to its initial state, top slider is reset, and the wing is custom

save the wing
always use the loaded wing id.
if the wing was customized (not loaded for a custoemr, and changed), set its id to 0, and assign the customer to it

loading wing:
apply the sliders after the load
*/

@Component({
  selector: 'app-single-hat-calculator',
  standalone: true,
  imports: [
    NgSelectModule, FormsModule, NgFor, NgIf, DecimalPipe, NgClass,
    WingDiagramComponent, PrefixPipe, FilterPipe, StartsWithPipe, LightboxModule,
    AllocationPickerComponent, FaIconComponent, AutocompleteLibModule, BabyLengthModalComponent,
    FaIconComponent, ConfirmationDialogComponent, HatAllocationEditorPickerComponent, RouterLink,
    OrderAdvisorComponent
],
  templateUrl: './single-hat-calculator.component.html',
  styleUrl: './single-hat-calculator.component.scss'
})
export class SingleHatCalculatorComponent extends NavigatedMessageComponent implements OnInit, AfterViewInit {


  wings: WingsListItem[] = []; //populating the list of wings to select
  raw_material_names: RawMaterialNameColor[] = []; //populating the raw material selectors

  //the current customer object
  @Input() customer: Customer = {
    id: 0, name: '', business_name: '', email: '', phone: '', tax_id: '',
    created_at: new Date(), updated_at: new Date(), created_by: 0, updated_by: 0,
    banks: [], banks_baby_allocations: [], babies: [],
    customer_code: ''
  };

  //wing representations:
  //the original wing loaded from the DB
  customerHat: CustomerHat = {
    id: 0,
    hat_material_id: null,
    crown_material_id: null,
    wing_quantity: 44,
    customer_id: this.customer.id,
    shorten_top_by: 0,
    shorten_crown_by: 0,
    wing: null,
    wall_allocation_id: 0,
    crown_allocation_id: 0
  };
  //the wing without customizations (shorten top or crown)
  wing_unchanged: Wing | null = null;
  //the original wing loaded (uncustomized at all, in order to revert all changes)
  wing_original: Wing | null = null; //to track changes in the wing
  
  @ViewChild("wing_selector") wing_selector!: NgSelectComponent;
  @ViewChild("length_editor") length_editor!: BabyLengthModalComponent;
  @ViewChild("reset_confirmation") reset_confirmation!: ConfirmationDialogComponent;
  @ViewChild("order_confirmation") order_confirmation!: ConfirmationDialogComponent;
  @ViewChild("allocation_picker") allocation_picker!: HatAllocationEditorPickerComponent;
  is_wing_customized: boolean = false;
  faArrowsRotate: IconDefinition = faArrowsRotate;
  faArrowLeft: IconDefinition = faArrowLeft;
  faBasketShopping:IconDefinition = faBasketShopping;
  faScissors:IconDefinition = faScissors;
  faRecordVinyl:IconDefinition = faRecordVinyl;
  faRuler:IconDefinition = faRuler;

  summary_table_instructions: string = "";
  hat_babies: aggregated_babies[] = []; //containing aggregated babies with length, quantity and num of hats
  crown_babies: aggregated_babies[] = []; //crown_babies are used only if the allocations are split between hat and crown

  order_amount: number = -1;
  
  selected_wing_name:string = "";

  min_knife:number = 4;
  max_knife:number = 12.5;
  knife_steps: number = 0.5;
  arr_knives: number[] = Array(
    (this.max_knife - this.min_knife)*2+1)
    .fill(this.min_knife)
    .map((_,i) => _ + i * this.knife_steps);
  wing_knife: number = 0;
  
  min_wing_total_height:number = 15;
  max_wing_total_height:number = 30;
  wing_height_steps: number = 0.5;
  arr_wing_total_height: number[] = Array(
    (this.max_wing_total_height - this.min_wing_total_height)*2+1)
    .fill(this.min_wing_total_height)
    .map((_,i) => _ + i * this.wing_height_steps);
  wing_total_height: number = 0;

  min_height_for_wing:number = 0;
  max_height_for_wing:number = 0;

  min_kippa:number = 55;
  max_kippa:number = 60;
  kippa_steps: number = 0.5;
  arr_kippa: number[] = Array(
    (this.max_kippa - this.min_kippa)*2+1)
    .fill(this.min_kippa)
    .map((_,i) => _ + i * this.kippa_steps);
  hat_kippa: number = this.min_kippa;
  inch_to_cm: number = 2.54;

  arr_mayler: number[] = [0.15, 0.17, 0.2];
  hat_mayler = 0.17;

  //==================== old stuff below====================

  //server_url: string = environment.serverUrl;
  //album: any[] = [];
  //previewUrl:string = "";
  no_hat_img = "/assets/images/no-hat-picture-dark.png";
  no_hat_message = "No photo for this hat";
  previeImgTitle = this.no_hat_message;
  @ViewChild("diagram") diagram!: WingDiagramComponent;
  
  wall_alocation: Customer_Bank_Baby_Allocation | null = null;
  crown_allocation: Customer_Bank_Baby_Allocation | null = null;
  wall_allocation_units : string = "";
  crown_allocation_units : string = "";
  num_of_allocations_with_wall_material = 0;
  num_of_allocations_with_crown_material = 0;

  //allow_top_max_margin = 0;
  //allow_crown_max_margin = 0;
  baby_margin_min = 0;
  baby_margin_max = 1;
  baby_margin_step = 0.5;
  baby_margins_list: number[] = [];
  pending_allocation_area_selection = ""; // wall/crown
  faChartPie: IconDefinition = faChartPie;
  console=console;
  selected_wing_id: number | null = null;

  /*
  @Input() banks: Customer_Bank[] = [];
  @Input() banks_baby_allocations: Customer_Bank_Baby_Allocation[] = [];
  @Input() babies: Customer_Baby[] = [];
*/
  total_num_of_possible_hats: number = 0;
  highlight_lowest_number_in_table: boolean =  false;

  constructor(
    private customersService: CustomersService,
    private wingsService:WingsService, 
    private lightbox: Lightbox,
    private globalsService: GlobalsService,
    private rawMaterialsService: RawMaterialsService,
    private hatsCalculatorService: HatsCalculatorService,
    private activatedRoute: ActivatedRoute,
    private ordersService: OrdersService,
    router: Router, 
    stateService: StateService,
    toastService: ToastService      
  ) {
    super(toastService, stateService, router);
    this.showNavigationToastIfMessagePending();

    this.globalsService.themeChanged.subscribe((theme: string) => {
      this.no_hat_img = `/assets/images/no-hat-picture-${theme}.png`;
      this.previeImgTitle = this.no_hat_message;
    });
    this.baby_margins_list = Array.from({ length: (((this.baby_margin_max - this.baby_margin_min)*(1/this.baby_margin_step))+1) }, (v, k) => (this.baby_margin_min + this.baby_margin_step + ((k-1)*this.baby_margin_step)));
  }

  ngOnInit(): void {
 
  }

  ngAfterViewInit(): void {
    this.wingsService.getWings_for_customer(this.customer.id).subscribe(wingsListInfo => {
      this.wings = wingsListInfo.data;
      let selected_wing_id = Number(this.activatedRoute.snapshot.queryParamMap.get('wing_id'));
      if(selected_wing_id > 0) {
        this.selected_wing_id = selected_wing_id;
        this.wing_selected(selected_wing_id);
      }
      else {
        this.selected_wing_id = null;
      }
      const id = Number(this.activatedRoute.snapshot.queryParamMap.get('id'));
      this.getCustomer(id);
    });

    this.no_hat_img = `/assets/images/no-hat-picture-${this.globalsService.currentTheme()}.png`;
    this.previeImgTitle = this.no_hat_message;

    this.allocation_picker.allocation_selected.subscribe({
      next: (selectedAllocation: Customer_Bank_Baby_Allocation) => {
        this.allocation_selected(selectedAllocation.id);
      }
    });

    this.reset_confirmation.confirm.subscribe({
      next: () => {
        this.reset_wing_changes();
      }
    });

    this.order_confirmation.confirm.subscribe({
      next: () => {
        this.placeOrderConfirmed();
      }
    });
    this.update_table_instructions();
  }

  getCustomer(id: number){
    if(id == 0)
      return;
    
    this.customersService.getCustomer(id).subscribe(
    {
      next: (customer: Customer) => {
        //failed to fetch material with ID, returned an empty object
        if(Object.keys(customer).length == 0) {
          this.gotoCustomersList("Could not find customer with ID " + id, true);
          return;
        }

        this.customer = customer;
        this.customerHat.customer_id = this.customer.id;

        this.rawMaterialsService.getRawMaterialNamesColors(id).subscribe({
          next: (names)=> {
            this.raw_material_names = names;

        let hat_material = this.activatedRoute.snapshot.queryParamMap.get('w_mat');
        if(hat_material) {
          this.customerHat.hat_material_id = Number(hat_material);
          let material_rec = this.raw_material_names.find(m => m.id == this.customerHat.hat_material_id);
          if(material_rec) {
            this.wall_material_changed(material_rec);
          }
        }
        let crown_material = this.activatedRoute.snapshot.queryParamMap.get('c_mat');
        if(crown_material) {
          this.customerHat.crown_material_id = Number(crown_material);
          let material_rec = this.raw_material_names.find(m => m.id == this.customerHat.hat_material_id);
          if(material_rec) {
            this.crown_material_changed(material_rec);
          }
        }
        let hat_allocation = Number(this.activatedRoute.snapshot.queryParamMap.get('w_aloc'));
        if(hat_allocation) {
          this.pending_allocation_area_selection = "wall";
          this.allocation_selected(hat_allocation);
        }
        let crown_allocation = Number(this.activatedRoute.snapshot.queryParamMap.get('c_aloc'));
        if(crown_allocation) {
          this.pending_allocation_area_selection = "crown";
          this.allocation_selected(crown_allocation);
        }
        let shorten_top = Number(this.activatedRoute.snapshot.queryParamMap.get('s_t'));
        if(shorten_top) {
          this.customerHat.shorten_top_by = shorten_top;
        }
        let shorten_crown = Number(this.activatedRoute.snapshot.queryParamMap.get('s_c'));
        if(shorten_crown) {
          this.customerHat.shorten_crown_by = shorten_crown;
        }
        if(shorten_top || shorten_crown) {
          this.margins_changed();
        }
      }})},
      error: (error) => {
        console.log(error);
      }
    })
  }

  gotoCustomersList(textInfo: string = '', isError: Boolean = false) {
    this.router.navigate(['inventory/customers'], {
      state: {
        info: { 
          textInfo: textInfo, 
          isError: isError 
        }
      },
    });
  }

  //this function analyzes the hat and its wings, aggregates the wing's positions babies by length, 
  //and sees how many matched babies the customer has in the allocation, and how many hats can be made.
  aggregateHatBabiesAndMatchingAllocations() {

    this.highlight_lowest_number_in_table = false;
    let babies_in_wall_allocation = (this.wall_alocation)? (this.customer.babies.filter(b => b.customer_banks_babies_id == this.wall_alocation?.id)) : [];
    let babies_in_crown_allocation = (this.crown_allocation)? (this.customer.babies.filter(b => b.customer_banks_babies_id == this.crown_allocation?.id)) : [];

    let hats_info = this.hatsCalculatorService.aggregateHatBabiesAndMatchingAllocations(
      this.customerHat.wing,
      this.wall_alocation,
      this.crown_allocation,
      babies_in_wall_allocation,
      babies_in_crown_allocation,
      this.customerHat.wing_quantity,
      this.order_amount
    );
    this.hat_babies = (JSON.parse(JSON.stringify(hats_info.hat_babies)));
    this.crown_babies = (JSON.parse(JSON.stringify(hats_info.crown_babies)));
    this.total_num_of_possible_hats = hats_info.total_num_of_possible_hats;

    if(this.total_num_of_possible_hats < Infinity || this.total_num_of_possible_hats == 0) {
      this.highlight_lowest_number_in_table = true;
    }
    /*
    if(this.order_amount != this.total_num_of_possible_hats){
      this.order_amount = this.total_num_of_possible_hats;
    }
    */
  }
 
  //invoked when the selection dialog is closed
  allocation_selected(alloc_id: number){
    // set the allocation(s)
    let alloc = this.customer.banks_baby_allocations.find(a => a.id == alloc_id);
    if(this.pending_allocation_area_selection && alloc){
      let bank = this.customer.banks.find(b => b.id == alloc?.customer_bank_id);
      if(this.pending_allocation_area_selection == "wall") {
        this.wall_alocation = alloc;
        this.wall_allocation_units = bank? bank.raw_material_quantity_units : "";
        if(this.customerHat.crown_material_id == this.customerHat.hat_material_id /* && !this.crown_allocation*/){
          this.crown_allocation = alloc;
          this.crown_allocation_units = bank? bank.raw_material_quantity_units : "";
          this.customerHat.crown_allocation_id = alloc_id;
        }
        this.customerHat.wall_allocation_id = alloc_id;
      }
      else {
        this.crown_allocation = alloc;
        this.crown_allocation_units = bank? bank.raw_material_quantity_units : "";
        this.customerHat.crown_allocation_id = alloc_id;
      }
    }
    this.aggregateHatBabiesAndMatchingAllocations();
    this.update_table_instructions();
    this.order_amount = this.total_num_of_possible_hats;
  }

  num_of_wings_changed(){
    this.aggregateHatBabiesAndMatchingAllocations();
    this.order_amount = this.total_num_of_possible_hats;
  }

  generate_unique_hat_name(){
    let timestamp = new Date();
    if(this.customerHat && this.customerHat.wing) {
      return this.customerHat.wing.name + 
        timestamp.getFullYear() + 
        timestamp.getMonth().toString().padStart(2, "0") +  
        timestamp.getDate().toString().padStart(2, "0") +
        timestamp.getHours().toString().padStart(2, "0") +
        timestamp.getMinutes().toString().padStart(2, "0") +
        timestamp.getSeconds().toString().padStart(2, "0");
    }
    else {
      return "";
    }
  }

  wing_selected(selectedWingId:number | null) {
    this.hat_babies = [];
    if(selectedWingId) {
      this.wingsService.getWing(selectedWingId).subscribe((w:Wing) => {
        //once the customer selects a wing, it gets copied into a new wing which can be customized
        //also given a new name, and will be saved under the hat of the customer.
        //the order won't be affected if the parent wing itself changes.
        this.selected_wing_name = w.name;
        this.customerHat.wing = w;
        this.customerHat.wing.id = 0;
        this.customerHat.wing.name = this.generate_unique_hat_name();
        this.wing_original = (JSON.parse(JSON.stringify(w)));
        this.wing_unchanged = (JSON.parse(JSON.stringify(w)));
        this.is_wing_customized = false;

        this.diagram.setColors(this.globalsService.currentTheme());
        this.aggregateHatBabiesAndMatchingAllocations();
        this.update_table_instructions();
        this.order_amount = this.total_num_of_possible_hats;
        this.recalculate_hat_size();
      });
    }
  }

  wing_cleared(){
    this.customerHat.wing = null;
  }

  wall_material_changed(material: RawMaterialNameColor){
    if(!material)
      return;
    this.customerHat.hat_material_id = material.id;
    //if (this.customerHat.crown_material == "") { 
    this.customerHat.crown_material_id = material.id;
    //}
    this.update_table_instructions();
    this.reload_allocations();
  }

  wall_material_cleared(){
    this.customerHat.hat_material_id = null;
    this.customerHat.crown_material_id = null;
    this.update_table_instructions();
    this.reload_allocations();
  }

  crown_material_changed(material: RawMaterialNameColor){
    if(!material)
      return;
    this.customerHat.crown_material_id = material.id;
    //if (this.customerHat.crown_material == "") { 
    this.customerHat.crown_material_id = material.id;
    //}
    this.update_table_instructions();
    this.reload_allocations();
  }
  
  crown_material_cleared(){
    this.customerHat.crown_material_id = null;
    this.update_table_instructions();
    this.reload_allocations();
  }

  reload_allocations(){
    let banks_with_wall_materials = this.customer.banks.filter(b => b.raw_material_id == this.customerHat.hat_material_id).map(b => b.id);
    let banks_with_crown_materials = this.customer.banks.filter(b => b.raw_material_id == this.customerHat.crown_material_id).map(b => b.id);
    this.num_of_allocations_with_wall_material = this.customer.banks_baby_allocations.filter(a => banks_with_wall_materials.indexOf(a.customer_bank_id) >= 0).length;
    this.num_of_allocations_with_crown_material = this.customer.banks_baby_allocations.filter(a => banks_with_crown_materials.indexOf(a.customer_bank_id) >= 0).length;
    this.update_table_instructions();
  }

  open_material_allocation_picker(materialFilter: number | null, area: string){
    if(materialFilter) {
    this.allocation_picker.dialogWrapper.modalTitle = "Pick allocation";
    this.allocation_picker.banks = this.customer.banks.filter(bank => (materialFilter)? bank.raw_material_id == materialFilter : true);
    this.allocation_picker.banks_baby_allocations = this.customer.banks_baby_allocations;
    this.allocation_picker.babies = this.customer.babies;
    this.allocation_picker.customer = this.customer;
    this.allocation_picker.wing_id = (this.selected_wing_id)?? 0;
    this.pending_allocation_area_selection = area;
    this.allocation_picker.dialogWrapper.open();
    }
  }

  diagram_baby_clicked(baby_position:string){

    let baby = this.customerHat.wing?.babies.find(b => b.position.toUpperCase() == baby_position.toUpperCase());
    if(this.customerHat.wing && baby){
      let crown_units = this.customerHat.wing.babies.filter((b) => b.position.startsWith("C")).length;
      this.length_editor.editedObject = baby;
      this.length_editor.dialogWrapper!.modalTitle = "Edit " + ((baby.position.toUpperCase().startsWith("C"))? "Crown" : baby.position);
      this.length_editor.crown_units = crown_units;
      this.length_editor.crown_babies_options = [];
      this.length_editor.dialogWrapper!.open();
    }
  }

  modal_length_Changed(wing_baby: WingBaby){
  }

  /*
  wing loaded -> the knife is set -> calculate total height: knife + L1 + C1
    Limit the total height:
      total height - (L1 + C1) >= 4
      total height >= 4 + L1 + C1

      total height - (L1 + C1) <= 12.5
      total height <= 12.5 +  + L1 + C1

  Knife changed -> calculate total height: knife + L1 + C1

  Total height changed -> calculate knife: total height - (L1 + C1)
  */

  knife_changed(new_knife: string){
    if(this.customerHat && this.customerHat.wing){
      this.wing_knife = Number(new_knife);
      this.customerHat.wing.knife = this.wing_knife;

      this.recalculate_hat_size();
    }
  }

  recalculate_hat_size(){
    this.wing_total_height = (this.customerHat.wing)?this.customerHat.wing.knife : 0;
    if(this.customerHat && this.customerHat.wing){
      if(this.customerHat.wing.babies){
        const L1 = this.customerHat.wing.babies.find(b => b.position.toUpperCase() == "L1");
        const C1 = this.customerHat.wing.babies.find(b => b.position.toUpperCase() == "C1");
        const L1_len = (L1) ? L1.length : 0;
        const C1_len = (C1) ? C1.length : 0;
        this.wing_total_height += (L1_len + C1_len);
        this.min_height_for_wing = (this.min_knife + L1_len + C1_len);
        this.max_height_for_wing = (this.max_knife + L1_len + C1_len);
      }
    }
  }  

  height_changed(new_height: string){
    if(this.customerHat && this.customerHat.wing){
      //this.customerHat.wing.knife = Number(new_height);
      this.wing_knife = Number(new_height);

      if(this.customerHat.wing.babies){
        const L1 = this.customerHat.wing.babies.find(b => b.position.toUpperCase() == "L1");
        const C1 = this.customerHat.wing.babies.find(b => b.position.toUpperCase() == "C1");
        const L1_len = (L1) ? L1.length : 0;
        const C1_len = (C1) ? C1.length : 0;
        this.wing_knife -= (L1_len + C1_len);
        this.customerHat.wing.knife = this.wing_knife;
      }
    }
  }



  check_for_wing_changes(): boolean{
    let changed = false;
    if(this.wing_original && this.customerHat.wing){
      this.wing_original.babies.forEach(original_baby => {
        let updated_baby = this.customerHat.wing?.babies.find(b => b.position.toUpperCase() == original_baby.position.toUpperCase());
        if(updated_baby && updated_baby.length != original_baby.length){
          changed = true;
        }
      });
    }
    this.is_wing_customized = changed;
    return changed;
  }

  length_editor_closed(wingbaby: WingBaby){
    let unchanged_wing_baby = this.wing_unchanged?.babies.find(b => b.position.toUpperCase() == wingbaby.position.toUpperCase());
    if(unchanged_wing_baby) {
      unchanged_wing_baby.length = wingbaby.length;
    }
    if(wingbaby.position.toUpperCase() == "TOP"){
      this.customerHat.shorten_top_by = 0;
    }
    this.check_for_wing_changes();
    this.aggregateHatBabiesAndMatchingAllocations();
    this.order_amount = this.total_num_of_possible_hats;
    this.recalculate_hat_size();
  }

  margins_changed() {
    //whenever the user plays with the top, reset manual changes in the wing
    this.customerHat.wing = (JSON.parse(JSON.stringify(this.wing_original)));
    this.wing_unchanged = (JSON.parse(JSON.stringify(this.wing_original)));

    let adjustedWing = this.hatsCalculatorService.adjustWingToShortenedTCrownOrTop(
      this.wing_unchanged, 
      this.customerHat.shorten_top_by,
      this.customerHat.shorten_crown_by);
    this.customerHat.wing = (JSON.parse(JSON.stringify(adjustedWing)));

    this.check_for_wing_changes();
    this.aggregateHatBabiesAndMatchingAllocations();
    this.order_amount = this.total_num_of_possible_hats;
    this.recalculate_hat_size();
  }

  confirm_reset(){
    this.reset_confirmation.open();
  }

  reset_wing_changes(){
    this.customerHat.wing = (JSON.parse(JSON.stringify(this.wing_original)));
    this.wing_unchanged = (JSON.parse(JSON.stringify(this.wing_original)));
    this.customerHat.shorten_top_by = 0;
    this.customerHat.shorten_crown_by = 0;
    this.margins_changed();
    this.check_for_wing_changes();
  }

  update_table_instructions(){
    this.summary_table_instructions = "";
    if(this.customerHat.wing == null){
      this.summary_table_instructions = "Please select a wing";
    }
    else {
      if(this.customerHat.hat_material_id == 0) {
        this.summary_table_instructions = "Please select the wall material";
      }
      else {
        if(this.customerHat.crown_material_id == 0) {
          this.summary_table_instructions = "Please select the crown material";
        }
        else {
          if(!this.wall_alocation) {
            this.summary_table_instructions = "Please select the wall allocation";
          }
          else {
            if(!this.crown_allocation) {
              this.summary_table_instructions = "Please select the crown allocation";
            }
          }
        }
      }
    }
  }

  order_amount_changed() {
    this.aggregateHatBabiesAndMatchingAllocations();
  }

  placeOrder(){
    this.order_confirmation.open();
  }

  placeOrderConfirmed() {
    this.ordersService.createOrder({
      id: 0,
      customer_hat: this.customerHat,
      num_of_hats: this.order_amount,
      status: {
        id: 0,
        date: new Date(),
        order_status: Status.new
      }
    }).subscribe(
      {
        next:(data) => { 
          this.toastService.showSuccess(data["message"]);
          this.customerHat.wing?.babies.forEach((hatBaby: WingBaby) => {
            let allocationBaby = hatBaby.position.toUpperCase().startsWith("C")?
              this.customer.babies.find(b => b.customer_banks_babies_id == this.crown_allocation?.id && b.length == hatBaby.length) : 
              this.customer.babies.find(b => b.customer_banks_babies_id == this.wall_alocation?.id && b.length == hatBaby.length);
      
            if(allocationBaby){
              //this.console.log("Reducing baby " + allocationBaby.length  + " by  " + (this.order_amount * this.customerHat.wing_quantity));
              allocationBaby.quantity -= (this.order_amount * this.customerHat.wing_quantity);
              //allocationBaby.quantity_in_allocation += (this.order_amount * this.customerHat.wing_quantity);
            }
          });
          this.aggregateHatBabiesAndMatchingAllocations();
          this.order_amount = this.total_num_of_possible_hats;
          if(this.customerHat && this.customerHat.wing){
            this.customerHat.wing.id = 0;
            this.customerHat.wing.name = this.generate_unique_hat_name();
          }
        },
        error:(error) => { 
          this.toastService.showError("Failed to issue order");
         }
      }
    );
  }

  exceedNumOfHats(margin_instructions: any){
    let change: boolean = false;
    if(margin_instructions.top >= 0){
      this.customerHat.shorten_top_by = margin_instructions.top;
      change = true;
    }
    if(margin_instructions.crown >= 0){
      this.customerHat.shorten_crown_by = margin_instructions.crown;
      change = true;
    }
    if(change) {
      this.margins_changed();
    }
  }

  go_to_orders(){
    this.router.navigate(['/inventory/customer/orders'], {
      queryParams: {
        customer_id: this.customer.id
      },
      state: {
        info: {
          customer_name: this.customer.name
        }
      },
    });
  }
}