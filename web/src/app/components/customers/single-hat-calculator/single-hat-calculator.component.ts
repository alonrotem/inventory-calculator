import { AfterViewInit, Component, Input, OnInit, viewChild, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgSelectComponent, NgSelectModule } from '@ng-select/ng-select';
import { WingsService } from '../../../services/wings.service';
import { Bank_Allocation_Type, Customer, Customer_Bank_Baby_Allocation, CustomerHat, RawMaterialNameColor, Status, Wing, WingBaby, WingsListItem } from '../../../../types';
import { DecimalPipe, formatDate, JsonPipe, NgClass, NgFor, NgIf } from '@angular/common';
import { WingDiagramComponent } from '../../wings/wing-diagram/wing-diagram.component';
import { PrefixPipe } from '../../../utils/pipes/prefix-pipe';
import { FilterPipe } from '../../../utils/pipes/filter-pipe';
import { Lightbox, LightboxModule } from 'ngx-lightbox';
import { GlobalsService } from '../../../services/globals.service';
import { faArrowLeft, faArrowsRotate, faBasketShopping, faChartPie, faRecordVinyl, faRuler, faScissors, faTriangleExclamation, IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { AllocationPickerComponent } from '../allocation-picker/allocation-picker.component';
import { StartsWithPipe } from '../../../utils/pipes/starts-with-pipe';
import { RawMaterialsService } from '../../../services/raw-materials.service';
import { AutocompleteLibModule } from 'angular-ng-autocomplete';
import { ConfirmationDialogComponent } from '../../common/confirmation-dialog/confirmation-dialog.component';
import { BabyLengthModalComponent } from '../../wings/baby-length-modal/baby-length-modal.component';
import { HatAllocationEditorPickerComponent } from '../hat-allocation-editor-picker/hat-allocation-editor-picker.component';
import { aggregated_babies, hats_calculated, HatsCalculatorService } from '../../../services/hats-calculator.service';
import { CustomersService } from '../../../services/customers.service';
import { ActivatedRoute, NavigationExtras, Router, RouterLink } from '@angular/router';
import { OrdersService } from '../../../services/orders.service';
import { ToastService } from '../../../services/toast.service';
import { OrderAdvisorComponent } from "../order-advisor/order-advisor.component";
import { StateService } from '../../../services/state.service';
import { NavigatedMessageComponent } from '../../common/navigated-message/navigated-message.component';
import { ModalDialogComponent } from '../../common/modal-dialog/modal-dialog.component';
import { MiscUtils } from '../../../utils/misc-utils';
import { SortBabiesPipe } from '../../../utils/pipes/sort-babies-pipe';

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
    OrderAdvisorComponent, ModalDialogComponent, JsonPipe, SortBabiesPipe
],
  templateUrl: './single-hat-calculator.component.html',
  styleUrl: './single-hat-calculator.component.scss'
})
export class SingleHatCalculatorComponent extends NavigatedMessageComponent implements OnInit, AfterViewInit {


  wings: WingsListItem[] = []; //populating the list of wings to select
  raw_material_names: RawMaterialNameColor[] = []; //populating the raw material selectors
  raw_material_names_babies: RawMaterialNameColor[] = []; //populating the raw material selectors
  raw_material_names_tails: RawMaterialNameColor[] = []; //populating the raw material selectors

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
    crown_allocation_id: 0,
    tails_material_id: null,
    tails_allocation_id: null,
    kippa_size: 55,
    mayler_width: 0.17,
    hr_hl_width: 0,
    white_hair: false,
    white_hair_notes: '',
    order_date: null,
    isurgent: false,
    order_notes: '',
    adjusted_wings_per_hat: '',
    original_wing_name: '',
    crown_visible: 0,
    crown_length: 0,
    tails_overdraft: 0
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
  @ViewChild("order_wing_adjustment") order_wing_adjustment!: ModalDialogComponent;
  @ViewChild("advisor") advisor!: OrderAdvisorComponent;
  is_wing_customized: boolean = false;
  faArrowsRotate: IconDefinition = faArrowsRotate;
  faArrowLeft: IconDefinition = faArrowLeft;
  faBasketShopping:IconDefinition = faBasketShopping;
  faScissors:IconDefinition = faScissors;
  faRecordVinyl:IconDefinition = faRecordVinyl;
  faRuler:IconDefinition = faRuler;
  faTriangleExclamation:IconDefinition = faTriangleExclamation;

  summary_table_instructions: string = "";
  hat_babies: aggregated_babies[] = []; //containing aggregated babies with length, quantity and num of hats
  crown_babies: aggregated_babies[] = []; //crown_babies are used only if the allocations are split between hat and crown

  order_amount: number = -1;
  total_babies_per_hat: number = 0;
  
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
  //hat_kippa: number = this.min_kippa;
  inch_to_cm: number = 2.54;

  arr_mayler: number[] = [0.15, 0.17, 0.2];
  //hat_mayler = 0.17;

  arr_hr_hl: number[] = [3.5, 4, 4.5];
  hat_hr_hl: number = 3.5;

  //hat_crown_visible: number = 0;
  //hat_white_hair: boolean = false;
  //hat_white_hair_notes: string = '';

  //order_date: Date | null = null;
  //order_urgent: boolean = false;
  //order_notes: string = '';
  minDate = formatDate(Date.now(),'yyyy-MM-dd','en-US');

  wings_per_hat_in_order_previous_values: number[] = [];
  wings_per_hat_in_order: number[] = [];
  max_number_of_wings_in_all_allocations: number = 0;
  allWingsInOrder: number = 0;
  calculated_hats_info: hats_calculated = {
    total_num_of_possible_hats: 0,
    hat_babies: [],
    tails_used: 0,
    tails_remaining: 0,
    tails_overdraft: 0,
    max_num_of_hats_with_tails: 0,
    crown_babies: []
  };

  allow_shortening_material_babies_in_pairs: boolean = false;
  placing_order: boolean = false;

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
  tails_allocation: Customer_Bank_Baby_Allocation | null = null;
  wall_allocation_units : string = "";
  crown_allocation_units : string = "";
  tails_allocation_units : string = "";
  /*
  num_of_allocations_with_wall_material = 0;
  num_of_allocations_with_crown_material = 0;
  num_of_allocations_with_tails_material = 0;
  */

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
    this.length_editor.crown_babies_quantity_changed.subscribe((new_length: number) => this.crown_babies_quantity_changed(new_length));
    this.wingsService.getWings_for_customer(this.customer.id).subscribe(wingsListInfo => {
      this.wings = wingsListInfo.data.sort((w1:WingsListItem, w2:WingsListItem) => {
        this.console.log(w1.name);
        const w1_len = w1.name.match(/[^\d]*(\d*)[^\d]*/);
        const w2_len = w2.name.match(/[^\d]*(\d*)[^\d]*/);
        if(w1_len && w2_len && w1_len.length > 1 && w2_len.length > 1){
          return Number(w2_len[1]) - Number(w1_len[1]);
        }
        else {
          return 0;
        }
      });
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

    this.order_wing_adjustment.confirm.subscribe({
      next: () => {
        this.customerHat.adjusted_wings_per_hat = this.wings_per_hat_in_order.join(",");
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

            //--- find materials with baby allocations:
            //Find the ids of customer banks which have allocations of type babies
            let bank_ids_with_babies_allocations = this.customer.banks_baby_allocations
              .filter(alloc =>  alloc.allocation_type  == Bank_Allocation_Type.babies)
              .map(alloc => alloc.customer_bank_id);
            
            //Find the raw material IDs of those banks
            let raw_material_ids_with_baby_allocations = this.customer.banks
              .filter(bank => bank_ids_with_babies_allocations
              .find(id => id == bank.id))
              .map(a => a.raw_material_id);
            
            //filter the raw materials lists to only ones with baby allocations
            this.raw_material_names_babies = names;
              //.filter(material => raw_material_ids_with_baby_allocations.find(id => id == material.id));
            
            
            //--- find materials with tails allocations:
            //Find the ids of customer banks which have allocations of type babies
            let bank_ids_with_tails_allocations = this.customer.banks_baby_allocations
              .filter(alloc => alloc.allocation_type == Bank_Allocation_Type.tails)//Bank_Allocation_Type[Bank_Allocation_Type.tails])
              .map(alloc => alloc.customer_bank_id);
            
            //Find the raw material IDs of those banks
            let raw_material_ids_with_tails_allocations = this.customer.banks
              .filter(bank => bank_ids_with_tails_allocations
              .find(id => id == bank.id))
              .map(a => a.raw_material_id);
            
            //filter the raw materials lists to only ones with baby allocations
            this.raw_material_names_tails = names;
              //.filter(material => raw_material_ids_with_tails_allocations.find(id => id == material.id));


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

          let tails_material = this.activatedRoute.snapshot.queryParamMap.get('t_mat');
          if(tails_material && Number(tails_material) != 0) {
            this.customerHat.tails_material_id = Number(tails_material);
            let material_rec = this.raw_material_names.find(m => m.id == this.customerHat.tails_material_id);
            if(material_rec) {
              this.tails_material_changed(material_rec);
            }
          }
          let tails_allocation = Number(this.activatedRoute.snapshot.queryParamMap.get('t_aloc'));
          if(tails_allocation  && Number(tails_allocation) != 0) {
            this.pending_allocation_area_selection = "tails";
            this.allocation_selected(tails_allocation);
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
          //this.recauculate_overdraft_tails();
          this.calculateVisibleCrown();
      }})},
      error: (error) => {
        console.log(error);
      }
    })
  }

  update_customer(customer: Customer){
    this.customer = { ...customer };
    this.update_table_instructions();
    this.calculateVisibleCrown();
    //this.babies = [... data["customer"]["babies"]];
  }

  calculateVisibleCrown(){
    this.customerHat.crown_visible = 0;
    this.customerHat.crown_length = 0;
    if(this.customerHat && this.customerHat.wing) {
      const C1 = this.customerHat.wing.babies.find(b => b.position.toUpperCase() == "C1");
      this.customerHat.crown_visible = (C1) ? C1.length : 0;
      this.customerHat.crown_length = (C1)? C1.length : 0;
    }
    if(this.customerHat.tails_allocation_id && this.customerHat.crown_visible > 0){
      this.customerHat.crown_visible -= this.hat_hr_hl;
    }
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
    let babies_in_wall_allocation = (this.wall_alocation)? (this.customer.babies.filter(b => b.allocation_id == this.wall_alocation?.id)) : [];
    let babies_in_crown_allocation = (this.crown_allocation)? (this.customer.babies.filter(b => b.allocation_id == this.crown_allocation?.id)) : [];

    this.calculated_hats_info = this.hatsCalculatorService.aggregateHatBabiesAndMatchingAllocations(
      this.customerHat.wing,
      this.wall_alocation,
      this.crown_allocation,
      this.tails_allocation,
      babies_in_wall_allocation,
      babies_in_crown_allocation,
      this.customerHat.wing_quantity,
      this.order_amount
    );
    /*
    this.console.log("=-=-=-=-=-=-=-=-=-=-=-=-=-=-");
    this.console.log("CALVULATED HATS:");
    this.console.dir(this.calculated_hats_info);
    this.console.log("=-=-=-=-=-=-=-=-=-=-=-=-=-=-");
    */
    this.hat_babies = (JSON.parse(JSON.stringify(this.calculated_hats_info.hat_babies)));
    this.crown_babies = (JSON.parse(JSON.stringify(this.calculated_hats_info.crown_babies)));
    this.total_num_of_possible_hats = this.calculated_hats_info.total_num_of_possible_hats;

    if(this.total_num_of_possible_hats < Infinity || this.total_num_of_possible_hats == 0) {
      this.highlight_lowest_number_in_table = true;
    }
    this.total_babies_per_hat = (this.customerHat.wing? this.customerHat.wing.babies.length : 0) * this.customerHat.wing_quantity;
    /*
    if(this.order_amount != this.total_num_of_possible_hats){
      this.order_amount = this.total_num_of_possible_hats;
    }
    */
    if(!this.tails_allocation) {      
      this.calculated_hats_info.tails_used = 0;
      this.calculated_hats_info.tails_remaining = 0;
      this.calculated_hats_info.tails_overdraft = this.customerHat.wing_quantity * this.order_amount;
    }
    this.customerHat.tails_overdraft = this.calculated_hats_info.tails_overdraft;

   this.advisor.runCalculations();
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
      else if(this.pending_allocation_area_selection == "crown") {
        this.crown_allocation = alloc;
        this.crown_allocation_units = bank? bank.raw_material_quantity_units : "";
        this.customerHat.crown_allocation_id = alloc_id;
      }
      else if(this.pending_allocation_area_selection == "tails") {
        this.tails_allocation = alloc;
        this.crown_allocation_units = bank? bank.raw_material_quantity_units : "";
        this.customerHat.tails_allocation_id = alloc_id;
      }      
    }
    this.aggregateHatBabiesAndMatchingAllocations();
    this.update_table_instructions();
    this.order_amount = this.total_num_of_possible_hats;
    //this.recauculate_overdraft_tails();
    this.calculateVisibleCrown();
  }

  num_of_wings_changed(){
    this.aggregateHatBabiesAndMatchingAllocations();
    //this.recauculate_overdraft_tails();
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
        this.customerHat.original_wing_name = this.selected_wing_name;

        this.diagram.setColors(this.globalsService.currentTheme());

        /**/
        this.customerHat.hat_material_id = null;
        this.customerHat.crown_material_id = null;
        this.customerHat.tails_material_id = null;
        
        this.wall_alocation = null;
        this.crown_allocation = null;
        this.tails_allocation = null;
        this.customerHat.wall_allocation_id = 0;
        this.customerHat.crown_allocation_id = 0;
        this.customerHat.tails_allocation_id = 0;
        /*
        this.num_of_allocations_with_wall_material = 0;
        this.num_of_allocations_with_crown_material = 0;
        this.num_of_allocations_with_tails_material = 0;
        /**/

        this.aggregateHatBabiesAndMatchingAllocations();
        this.update_table_instructions();
        this.order_amount = this.total_num_of_possible_hats;
        this.recalculate_hat_size();
        this.calculateVisibleCrown();
        //this.recauculate_overdraft_tails();
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
    this.customerHat.crown_material_id = material.id;
    this.wall_alocation = null;
    this.crown_allocation = null;
    this.customerHat.wall_allocation_id = 0;
    this.customerHat.crown_allocation_id = 0;
    this.allow_shortening_material_babies_in_pairs = material.allow_shortening_babies_in_pairs;
    this.customerHat.shorten_top_by = 0;
    this.customerHat.shorten_crown_by = 0;
    this.margins_changed();
    this.update_table_instructions();
    this.calculateVisibleCrown();  
  }

  wall_material_cleared(){
    this.customerHat.hat_material_id = null;
    this.customerHat.crown_material_id = null;
    this.wall_alocation = null;
    this.crown_allocation = null;
    this.customerHat.wall_allocation_id = 0;
    this.customerHat.crown_allocation_id = 0;
    this.customerHat.shorten_top_by = 0;
    this.customerHat.shorten_crown_by = 0;
    this.margins_changed();
    this.update_table_instructions();
    this.calculateVisibleCrown();  
  }

  crown_material_changed(material: RawMaterialNameColor){
    if(!material)
      return;
    this.customerHat.crown_material_id = material.id;
    this.customerHat.crown_allocation_id = 0;
    this.crown_allocation = null;
    this.customerHat.shorten_top_by = 0;
    this.customerHat.shorten_crown_by = 0;
    this.margins_changed();
    this.update_table_instructions();
    this.calculateVisibleCrown();
  }

  tails_material_changed(material: RawMaterialNameColor){
    if(!material)
      return;
    this.customerHat.tails_material_id = material.id;
    this.customerHat.tails_allocation_id = 0;
    this.tails_allocation = null;
    
    this.calculated_hats_info.tails_used = 0;
    this.calculated_hats_info.tails_remaining = 0;
    this.calculated_hats_info.tails_overdraft = this.customerHat.wing_quantity * this.order_amount;

    this.update_table_instructions();
    this.calculateVisibleCrown();  
  }

  /*
  recauculate_overdraft_tails(){
    this.customerHat.tails_Overdraft = 0;

    if(!this.tails_allocation) {
      this.customerHat.tails_Overdraft = this.order_amount * this.customerHat.wing_quantity;
    }
  }
  */
  crown_material_cleared(){
    this.customerHat.crown_material_id = null;
    this.customerHat.crown_allocation_id = 0;
    this.crown_allocation = null;
    this.customerHat.shorten_top_by = 0;
    this.customerHat.shorten_crown_by = 0;
    this.margins_changed();
    this.update_table_instructions();
    this.calculateVisibleCrown();
  }

  tails_material_cleared() {
    this.customerHat.tails_material_id = null;
    this.customerHat.tails_allocation_id = 0;
    this.tails_allocation = null;
    this.update_table_instructions();
    this.calculateVisibleCrown();
    //this.recauculate_overdraft_tails();
  }

  open_material_allocation_picker(materialFilter: number | null, area: string){
    if(materialFilter) {
      this.allocation_picker.dialogWrapper.modalTitle = "Pick allocation";
      this.allocation_picker.banks = this.customer.banks.filter(bank => (materialFilter)? bank.raw_material_id == materialFilter : true);
      //this.allocation_picker.banks_baby_allocations = this.customer.banks_baby_allocations.filter(a => a.allocation_type == ((area!="tails")? Object.keys(Bank_Allocation_Type)[Object.values(Bank_Allocation_Type).indexOf(Bank_Allocation_Type.babies)] : Object.keys(Bank_Allocation_Type)[Object.values(Bank_Allocation_Type).indexOf(Bank_Allocation_Type.tails)]));
      this.allocation_picker.banks_baby_allocations = this.customer.banks_baby_allocations;
      this.allocation_picker.banks_baby_allocation_type_filter = (area=="tails")? Bank_Allocation_Type.tails : Bank_Allocation_Type.babies;
      this.allocation_picker.babies = this.customer.babies;
      this.allocation_picker.customer = this.customer;
      this.allocation_picker.wing_id = (this.selected_wing_id)?? 0;
      this.pending_allocation_area_selection = area;
      this.allocation_picker.dialogWrapper.open();
    }
  }

  diagram_baby_clicked(baby_position:string){
    this.console.log("baby clicked " + baby_position );
    let baby = this.customerHat.wing?.babies.find(b => b.position.toUpperCase() == baby_position.toUpperCase());
    if(this.customerHat.wing && baby){
      let crown_units = this.customerHat.wing.babies.filter((b) => b.position.startsWith("C")).length;
      this.length_editor.editedObject = baby;
      this.length_editor.dialogWrapper!.modalTitle = "Edit " + ((baby.position.toUpperCase().startsWith("C"))? "Crown" : baby.position);
      this.length_editor.crown_units = crown_units;
      //this.length_editor.crown_babies_options = [];
      this.length_editor.dialogWrapper!.open();
    }
  }

  crown_babies_quantity_changed(new_crown_quantity:number){
    if(this.customerHat.wing) {
      let crown_units = this.customerHat.wing.babies.filter((b) => b.position.startsWith("C"));
      if(crown_units.length > 0){
        //remove the crown
        this.customerHat.wing.babies = this.customerHat.wing.babies.filter((b) => !b.position.startsWith("C"));
        //this.console.log("new crown quantity " + new_crown_quantity + ", previously " + crown_units.length);
      }
      this.customerHat.wing.babies = [ 
        ...this.customerHat.wing.babies, 
        ...Array(new_crown_quantity).fill(0).map((_, i)=> ({ 
                                              id: 0,
                                              wing_id: this.customerHat.wing!.id,
                                              length: this.customerHat.crown_length,
                                              position: 'C' + (i+1) }))
      ];
    }
    this.recalculate_hat_size();
    this.aggregateHatBabiesAndMatchingAllocations();
    this.update_table_instructions();
    this.calculateVisibleCrown();
  }

  modal_length_Changed(updated_wing_baby: WingBaby){
      //for crown, don't close immediately, but update the crown length
    if(this.customerHat.wing){
      if(updated_wing_baby.position.toUpperCase().startsWith("C")) {
        this.customerHat.crown_length = updated_wing_baby.length;
        this.customerHat.wing.babies.forEach(b => {
          if(b.position.toUpperCase().startsWith("C")){
            b.length = updated_wing_baby.length;
          }
        });
      }
      else {
        let wing_baby = this.customerHat.wing.babies.find(b => b.position == updated_wing_baby.position);
        if(wing_baby){
          wing_baby.length = updated_wing_baby.length;
        }
      }
    }
    this.recalculate_hat_size();
    this.aggregateHatBabiesAndMatchingAllocations();
    this.update_table_instructions();
    this.calculateVisibleCrown();
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
    this.calculateVisibleCrown();
  }

  margins_changed() {
    //whenever the user plays with the top, reset manual changes in the wing
    this.customerHat.wing = (JSON.parse(JSON.stringify(this.wing_original)));
    this.wing_unchanged = (JSON.parse(JSON.stringify(this.wing_original)));
    
    const allow_shortening_in_pairs = (
      this.customerHat.wing != null &&
      this.customerHat.wing.allow_shortening_babies_in_pairs &&
      this.allow_shortening_material_babies_in_pairs
    );

    let adjustedWing = this.hatsCalculatorService.adjustWingToShortenedTCrownOrTop(
      this.wing_unchanged, 
      this.customerHat.shorten_top_by,
      this.customerHat.shorten_crown_by,
      allow_shortening_in_pairs);
    this.customerHat.wing = (JSON.parse(JSON.stringify(adjustedWing)));

    this.check_for_wing_changes();
    this.aggregateHatBabiesAndMatchingAllocations();
    this.order_amount = this.total_num_of_possible_hats;
    this.recalculate_hat_size();
    this.calculateVisibleCrown();
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
    this.calculateVisibleCrown();
  }

  update_table_instructions(){
    this.summary_table_instructions = "";
    if(this.customerHat.wing == null){
      this.summary_table_instructions = "Please select a wing";
    }
    else {
      if(this.customerHat.hat_material_id == 0) {
        this.summary_table_instructions = "Please select the wall material";
      }/*
      else {
        if(this.customerHat.tails_material_id == 0){
          this.summary_table_instructions = "Please select the H material";
        }*/
        else
        {
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
              }/*
              else {
                if(!this.tails_allocation) {
                  this.summary_table_instructions = "Please select the H allocation";
                }
              }*/
            }
          }
        }
      //}
    }
  }

  order_amount_changed() {
    this.aggregateHatBabiesAndMatchingAllocations();
    //this.recauculate_overdraft_tails();
  }

  placeOrder(){
    let babies_in_wall_allocation = (this.wall_alocation)? (this.customer.babies.filter(b => b.allocation_id == this.wall_alocation?.id)) : [];
    let babies_in_crown_allocation = (this.crown_allocation)? (this.customer.babies.filter(b => b.allocation_id == this.crown_allocation?.id)) : [];

    this.wings_per_hat_in_order = Array(this.order_amount).fill(this.customerHat.wing_quantity);
    this.wings_per_hat_in_order_previous_values = Array(this.order_amount).fill(this.customerHat.wing_quantity);
    this.allWingsInOrder = this.wings_per_hat_in_order.reduce((partialSum, a) => partialSum + a, 0);
    
    this.max_number_of_wings_in_all_allocations = this.hatsCalculatorService.getMaxNumberOfWingsInAllocations(this.customerHat.wing,
      babies_in_wall_allocation,
      babies_in_crown_allocation,
      null,//this.tails_allocation, //ommit the tails, because they don't affect the wings per order (go to overdraft if needed)
      (this.wall_alocation?.id != this.crown_allocation?.id));
    this.console.log("You can produce " + this.max_number_of_wings_in_all_allocations + " wings with your allocations, and you are producing " + this.allWingsInOrder);
    this.order_wing_adjustment.open();
    //this.order_confirmation.open();
  }

  //prevent the focus from jumping between boxes
  trackByIndex(index: number, item: number): number {
    return index;
  }

  dont_exceed_max_wings(event:any, index: number): void {
    let max_gap = this.max_number_of_wings_in_all_allocations - this.allWingsInOrder;
    let increased_value = this.wings_per_hat_in_order[index] - this.wings_per_hat_in_order_previous_values[index];
    if(increased_value > max_gap) {
      let limited_new_value = this.wings_per_hat_in_order_previous_values[index] + max_gap;
      this.wings_per_hat_in_order[index] = limited_new_value;
      event.target.value = limited_new_value;
      this.wings_per_hat_in_order_previous_values[index] = limited_new_value;
    }
    else {
      this.wings_per_hat_in_order_previous_values[index] = this.wings_per_hat_in_order[index];
      event.target.value = this.wings_per_hat_in_order[index];
    }
    this.allWingsInOrder = this.wings_per_hat_in_order.reduce((partialSum, a) => partialSum + a, 0);
  }

  placeOrderConfirmed() {
    this.placing_order = true;
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
              this.customer.babies.find(b => b.allocation_id == this.crown_allocation?.id && b.length == hatBaby.length) : 
              this.customer.babies.find(b => b.allocation_id == this.wall_alocation?.id && b.length == hatBaby.length);
      
            if(allocationBaby){
              //this.console.log("Reducing baby " + allocationBaby.length  + " by  " + (this.order_amount * this.customerHat.wing_quantity));
              allocationBaby.quantity -= (this.order_amount * this.customerHat.wing_quantity);
              allocationBaby.quantity_in_pending_orders += (this.order_amount * this.customerHat.wing_quantity);
              //allocationBaby.quantity_in_allocation += (this.order_amount * this.customerHat.wing_quantity);
            }
          });
          //this.customerHat.tails_allocation_id
          let arr_adjusted_wings_per_hat = this.customerHat.adjusted_wings_per_hat.split(",");
          const total_num_of_wings = arr_adjusted_wings_per_hat
            .reduce((accumulator, currentValue) => { 
              let curVal_num = parseInt(currentValue);
              if(isNaN(curVal_num)){
                curVal_num = 0;
              }
              return accumulator + curVal_num;
            }, 0);
          if(this.tails_allocation){
            if(this.tails_allocation.tails_quantity >= total_num_of_wings) {
              this.tails_allocation.tails_quantity -= total_num_of_wings;
              this.tails_allocation.tails_in_orders += total_num_of_wings;
            }
            else {
              const missing_tails_in_allocation = total_num_of_wings - this.tails_allocation.tails_quantity;
              //move all the tails in the allocation to the orders, and the remainder to overdraft
              this.tails_allocation.tails_in_orders += this.tails_allocation.tails_quantity;
              this.tails_allocation.tails_quantity = 0;
              this.customerHat.tails_overdraft = missing_tails_in_allocation;
            }
          }
          else {
            this.customerHat.tails_overdraft = total_num_of_wings;
          }
          this.aggregateHatBabiesAndMatchingAllocations();
          this.order_amount = this.total_num_of_possible_hats;
          if(this.customerHat && this.customerHat.wing){
            this.customerHat.wing.id = 0;
            this.customerHat.wing.name = this.generate_unique_hat_name();
          }
          this.placing_order = false;
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
      //this.recauculate_overdraft_tails();
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