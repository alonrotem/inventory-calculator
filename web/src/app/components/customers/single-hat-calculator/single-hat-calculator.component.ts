import { AfterViewInit, ChangeDetectorRef, Component, HostListener, Input, OnInit, viewChild, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgSelectComponent, NgSelectModule } from '@ng-select/ng-select';
import { WingsService } from '../../../services/wings.service';
import { Bank_Allocation_Type, Customer, Customer_Bank_Baby_Allocation, CustomerHat, RawMaterialBasicDetails, Status, Wing, WingBaby, WingsListItem } from '../../../../types';
import { DecimalPipe, formatDate, JsonPipe, NgClass, NgFor, NgIf } from '@angular/common';
import { WingDiagramComponent } from '../../wings/wing-diagram/wing-diagram.component';
import { PrefixPipe } from '../../../utils/pipes/prefix-pipe';
import { FilterPipe } from '../../../utils/pipes/filter-pipe';
import { Lightbox, LightboxModule } from 'ngx-lightbox';
import { GlobalsService } from '../../../services/globals.service';
import { faArrowDown, faArrowDown19, faArrowLeft, faArrowsRotate, faBasketShopping, faChartPie, faCopy, faLightbulb, faRecordVinyl, faRuler, faSave, faScissors, faTriangleExclamation, IconDefinition } from '@fortawesome/free-solid-svg-icons';
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
import { CrownEditorComponent } from "../../wings/crown-editor/crown-editor.component";
import { WingsEditorComponent } from "../../wings/wings-editor/wings-editor.component";
import { PageLoadingComponent } from "../../common/page-loading/page-loading.component";

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
    OrderAdvisorComponent, ModalDialogComponent, JsonPipe, SortBabiesPipe,
    CrownEditorComponent,
    WingsEditorComponent,
    PageLoadingComponent
],
  templateUrl: './single-hat-calculator.component.html',
  styleUrl: './single-hat-calculator.component.scss'
})
export class SingleHatCalculatorComponent extends NavigatedMessageComponent implements OnInit, AfterViewInit {

  wings: WingsListItem[] = []; //populating the list of wings to select
  raw_material_names: RawMaterialBasicDetails[] = []; //populating the raw material selectors
  raw_material_names_babies: RawMaterialBasicDetails[] = []; //populating the raw material selectors
  raw_material_names_tails: RawMaterialBasicDetails[] = []; //populating the raw material selectors

  //the current customer object
  @Input() customer: Customer = {
    id: 0, name: '', business_name: '', email: '', phone: '', tax_id: '',
    created_at: new Date(), updated_at: new Date(), created_by: 0, updated_by: 0,
    banks: [], banks_baby_allocations: [], babies: [],
    customer_code: '', order_seq_number: 0, is_demo_customer: false,
    knives: []
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
    wing: {
      id: 0, name: '', knife: 0, allow_shortening_babies_in_pairs: false,
      crown_width: 0, split_l1: 1, angled_crown: false, babies: [], customers: []
    },
    wall_allocation_id: 0,
    crown_allocation_id: 0,
    tails_material_id_r: null,
    tails_material_id_l: null,
    tails_allocation_id_r: null,
    tails_allocation_id_l: null,
    mayler_width: 0.17,
    hl_width: 3.5,
    hr_width: 3.5,
    white_hair: false,
    white_hair_notes: '',
    order_date: null,
    isurgent: false,
    order_notes: '',
    original_wing_name: '',
    crown_visible: 0,
    crown_length: 0,
    tails_overdraft_r: 0,
    tails_overdraft_l: 0,
    single_hat_orders: [],
    save_wing_for_customer: false,
    save_wing_name_for_customer: ''
  };
  //the wing without customizations (shorten top or crown)
  wing_unchanged: Wing = {
    id: 0, name: '', knife: 0, allow_shortening_babies_in_pairs: false,
    crown_width: 0, split_l1: 1, angled_crown: false, babies: [], customers: []
  };
  //the original wing loaded (uncustomized at all, in order to revert all changes)
  wing_original: Wing = {
    id: 0, name: '', knife: 0, allow_shortening_babies_in_pairs: false,
    crown_width: 0, split_l1: 1, angled_crown: false, babies: [], customers: []
  }; //to track changes in the wing
  crown_width_original : number | null = null;
  
  @ViewChild("wing_selector") wing_selector!: NgSelectComponent;
  @ViewChild("length_editor") length_editor!: BabyLengthModalComponent;
  @ViewChild("confirm_action") confirm_action!: ConfirmationDialogComponent;
  //@ViewChild("reset_confirmation") reset_confirmation!: ConfirmationDialogComponent;
  //@ViewChild("order_confirmation") order_confirmation!: ConfirmationDialogComponent;
  @ViewChild("allocation_picker") allocation_picker!: HatAllocationEditorPickerComponent;
  @ViewChild("order_wing_adjustment") order_wing_adjustment!: ModalDialogComponent;
  @ViewChild("advisor") advisor!: OrderAdvisorComponent;
  @ViewChild("crown_editor_dialog") crown_editor_dialog! :ModalDialogComponent;
  @ViewChild("knife_selector") knife_selector! :NgSelectComponent;
  @ViewChild("advanced_wing_editor_dialog") advanced_wing_editor_dialog! :ModalDialogComponent;
  @ViewChild("advanced_wing_editor") advanced_wing_editor! :WingsEditorComponent;
  is_wing_customized: boolean = false;
  faArrowsRotate: IconDefinition = faArrowsRotate;
  faArrowLeft: IconDefinition = faArrowLeft;
  faBasketShopping:IconDefinition = faBasketShopping;
  faScissors:IconDefinition = faScissors;
  faRecordVinyl:IconDefinition = faRecordVinyl;
  faRuler:IconDefinition = faRuler;
  faTriangleExclamation:IconDefinition = faTriangleExclamation;
  faCopy: IconDefinition = faCopy;
  faArrowDown: IconDefinition = faArrowDown;
  faSave: IconDefinition = faSave;
  faLightbulb: IconDefinition = faLightbulb;

  summary_table_instructions: string = "";
  hat_babies: aggregated_babies[] = []; //containing aggregated babies with length, quantity and num of hats
  crown_babies: aggregated_babies[] = []; //crown_babies are used only if the allocations are split between hat and crown

  order_amount: number = -1;
  total_babies_per_hat: number = 0;
  
  selected_wing_name:string = "";

  inch_to_cm: number = 2.54;
  cm_to_inch: number = 0.393701;

  min_knife:number = 4;
  max_knife:number = 12.5;
  knife_steps: number = 0.5;

  arr_knives: {cm: number, inches: number}[] = [];
  /*
  arr_knives: number[] = Array(
    (this.max_knife - this.min_knife)*2+1)
    .fill(this.min_knife)
    .map((_,i) => _ + i * this.knife_steps);
  */

  wing_knife: number = 0;
  
  min_wing_total_height:number = 15;
  max_wing_total_height:number = 30;
  wing_height_steps: number = 0.5;
  arr_wing_total_height = Array((this.max_wing_total_height - this.min_wing_total_height) * ( 1/this.wing_height_steps) + 1)
    .fill(this.min_wing_total_height).map((_,i) => { 
      return { 
        cm: ((_ + i * this.wing_height_steps) ),
        inches: ((_ + i * this.wing_height_steps) * this.cm_to_inch),
        disabled: false
      }
    }
  );
  wing_total_height: number = 0;

  min_height_for_wing:number = 0;
  max_height_for_wing:number = 0;

  min_kippa:number = 51;
  max_kippa:number = 61;
  kippa_steps: number = 0.5;
  /*
  arr_kippa: number[] = Array(
    (this.max_kippa - this.min_kippa)*2+1)
    .fill(this.min_kippa)
    .map((_,i) => _ + i * this.kippa_steps);
  */
  arr_kippa = Array((this.max_kippa - this.min_kippa) * ( 1/this.kippa_steps) + 1)
    .fill(this.min_kippa).map((_,i) => { 
      return { 
        cm: ((_ + i * this.kippa_steps) ),
        inches: ((_ + i * this.kippa_steps) * this.cm_to_inch),
        disabled: false
      }
    }
  );

  min_diameter:number = 11.5;
  max_diameter:number = 16.5;
  diameter_steps: number= 0.25;
  min_box:number = 4;
  box_steps:number = 0.5;

  arr_diameter = Array((this.max_diameter - this.min_diameter) * ( 1/this.diameter_steps) + 1)
    .fill(this.min_diameter).map((_,i) => { 
      return { 
        inches: (_ + i * this.diameter_steps), 
        cm: ((_ + i * this.diameter_steps) * this.inch_to_cm), 
        box: this.min_box + i * this.box_steps
      }
    }
  );

  kippa_size: number = 56;//this.min_kippa;
  diameter_inches: number = this.min_diameter;
  
  arr_mayler: number[] = [0.15, 0.17, 0.2];
  //hat_mayler = 0.17;

  arr_hr_hl: number[] = [3.5, 4, 4.5];
  hat_hr: number = 3.5;
  hat_hl: number = 3.5;

  //hat_crown_visible: number = 0;
  //hat_white_hair: boolean = false;
  //hat_white_hair_notes: string = '';

  //order_date: Date | null = null;
  //order_urgent: boolean = false;
  //order_notes: string = '';
  minDate = formatDate(Date.now(),'yyyy-MM-dd','en-US');

  wings_per_hat_in_order_previous_values: number[] = [];
  //wings_per_hat_in_order: number[] = [];
  max_number_of_wings_in_all_allocations: number = 0;
  allWingsInOrder: number = 0;
  calculated_hats_info: hats_calculated = {
    total_num_of_possible_hats: 0,
    hat_babies: [],
    tails_used_l: 0,
    tails_remaining_l: 0,
    tails_overdraft_l: 0,
    tails_used_r: 0,
    tails_remaining_r: 0,
    tails_overdraft_r: 0,
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
  tails_allocation_l: Customer_Bank_Baby_Allocation | null = null;
  tails_allocation_r: Customer_Bank_Baby_Allocation | null = null;
  wall_allocation_units : string = "";
  crown_allocation_units : string = "";
  tails_allocation_units : string = "";
  use_the_same_allocation_for_wall_and_crown: Boolean = true;
  use_the_same_allocation_for_l_and_r_h_material: Boolean = true;
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

  is_wall_materiail_tentative: boolean = false;
  is_crown_materiail_tentative: boolean = false;
  is_hat_tentative: boolean = false;

  is_hr_tentative: boolean = false;
  is_hl_tentative: boolean = false;

  loading: boolean = true;

  constructor(
    private customersService: CustomersService,
    private wingsService:WingsService, 
    private lightbox: Lightbox,
    private globalsService: GlobalsService,
    private rawMaterialsService: RawMaterialsService,
    private hatsCalculatorService: HatsCalculatorService,
    activatedRoute: ActivatedRoute,
    private ordersService: OrdersService,
    router: Router, 
    stateService: StateService,
    toastService: ToastService     
  ) {
    super(toastService, stateService, router, activatedRoute);

    this.globalsService.themeChanged.subscribe((theme: string) => {
      this.no_hat_img = `/assets/images/no-hat-picture-${theme}.png`;
      this.previeImgTitle = this.no_hat_message;
    });
    this.baby_margins_list = Array.from({ length: (((this.baby_margin_max - this.baby_margin_min)*(1/this.baby_margin_step))+1) }, (v, k) => (this.baby_margin_min + this.baby_margin_step + ((k-1)*this.baby_margin_step)));
  }

  ngOnInit(): void {
 
  }

  ngAfterViewInit(): void {
    const customer_id = Number(this.activatedRoute.snapshot.queryParamMap.get('id'));

    this.length_editor.crown_babies_quantity_changed.subscribe((new_length: number) => this.crown_babies_quantity_changed(new_length));
    this.wingsService.getWings_for_customer(customer_id).subscribe(wingsListInfo => {
      this.wings = wingsListInfo.data.sort((w1:WingsListItem, w2:WingsListItem) => {
        //this.console.log(w1.name);
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
      this.getCustomer(customer_id);
    });

    this.no_hat_img = `/assets/images/no-hat-picture-${this.globalsService.currentTheme()}.png`;
    this.previeImgTitle = this.no_hat_message;

    this.allocation_picker.allocation_selected.subscribe({
      next: (selectedAllocation: Customer_Bank_Baby_Allocation) => {
        this.allocation_selected(selectedAllocation.id);
      }
    });

    this.order_wing_adjustment.confirm.subscribe({
      next: () => {
        /*
        this.customerHat.adjusted_wings_per_hat = this.wings_per_hat_in_order.join(",");

        //see if all hats have the same number of wings
        //(check the first hat, then see if any hat has a different number of wings).
        //if all hats have the same number of wings, set the order to reflect it.
        if(this.wings_per_hat_in_order.length > 0){
          let first_hat_wings = this.wings_per_hat_in_order[0];
          let hats_contain_vadied_num_of_wings = this.wings_per_hat_in_order.find(w => w != first_hat_wings);
          if(!hats_contain_vadied_num_of_wings){
            this.customerHat.wing_quantity = first_hat_wings;
          }
        }
          */
        this.placeOrderConfirmed();
      }
    });
    this.update_table_instructions();
  }

  getCustomer(id: number){
    //this.console.log("Getting customer with id " + id);
    if(id == 0)
      return;
    
    this.customersService.getCustomer(id).subscribe(
    {
      next: (customer: Customer) => {

        this.arr_knives = (customer.is_demo_customer) ?
          Array((this.max_knife - this.min_knife) * ( 1/this.knife_steps) + 1)
            .fill(this.min_knife).map((_,i) => { 
              return { 
                cm: ((_ + i * this.knife_steps) ),
                inches: ((_ + i * this.knife_steps) * this.cm_to_inch), 
              }
            }
          ) : 
        customer.knives.map(knife => { 
            return { 
              cm: knife,
              inches: (knife * this.cm_to_inch), 
            }
          }
        );

        //failed to fetch material with ID, returned an empty object
        if(Object.keys(customer).length == 0) {
          this.gotoCustomersList("Could not find customer with ID " + id, true);
          return;
        }

        this.customer = customer;
        this.customerHat.customer_id = this.customer.id;

        this.rawMaterialsService.getRawMaterialBasicDetails(id).subscribe({
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
            this.raw_material_names_tails = names.filter(n=> n.is_usable_for_h_material);
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
          if(crown_allocation && crown_allocation > 0) {
            this.pending_allocation_area_selection = "crown";
            this.allocation_selected(crown_allocation);

            if(hat_allocation > 0){
              this.use_the_same_allocation_for_wall_and_crown = (crown_allocation == hat_allocation);
            }
          }

          let tails_material = this.activatedRoute.snapshot.queryParamMap.get('t_mat');
          if(tails_material && Number(tails_material) != 0) {
            this.customerHat.tails_material_id_l = Number(tails_material);
            this.customerHat.tails_material_id_r = Number(tails_material);
            let material_rec_l = this.raw_material_names.find(m => m.id == this.customerHat.tails_material_id_l);
            let material_rec_r = this.raw_material_names.find(m => m.id == this.customerHat.tails_material_id_r);
            if(material_rec_l && material_rec_r) {
              this.tails_material_changed(material_rec_l, material_rec_r);
            }
          }
          let tails_allocation = Number(this.activatedRoute.snapshot.queryParamMap.get('t_aloc'));
          if(tails_allocation  && Number(tails_allocation) != 0) {
            this.pending_allocation_area_selection = "tails_l";
            this.use_the_same_allocation_for_l_and_r_h_material = true;
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
          this.loading = false;
      }})},
      error: (error) => {
        console.log(error);
        this.loading = false;
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
    if(this.customerHat && this.customerHat.wing && this.customerHat.wing.babies && this.customerHat.wing.babies.length > 0) {
      //const C1 = this.customerHat.wing.babies.find(b => b.position.toUpperCase() == "C1");
      const longest_crown_baby = this.customerHat.wing.babies
        .filter(c => c.position.toUpperCase().startsWith("C"))
        .reduce((a, b) => (b.length > a.length ? b : a));
      this.customerHat.crown_visible = (longest_crown_baby) ? longest_crown_baby.length : 0;
      this.customerHat.crown_length = (longest_crown_baby)? longest_crown_baby.length : 0;
    }
    if(this.customerHat.tails_material_id_r && this.customerHat.crown_visible > 0){
      this.customerHat.crown_visible -= this.customerHat.hr_width; //assuming hr (H material on the right) is on the side of the crown (R)
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

    //console.log("-- before calculations, order amount ", this.order_amount);
    this.calculated_hats_info = this.hatsCalculatorService.aggregateHatBabiesAndMatchingAllocations(
      this.customerHat.wing,
      this.wall_alocation,
      this.crown_allocation,
      this.tails_allocation_l,
      this.tails_allocation_r,
      babies_in_wall_allocation,
      babies_in_crown_allocation,
      this.customerHat.wing_quantity,
      this.order_amount,
      this.is_hat_tentative,
      (this.customerHat.hat_material_id != this.customerHat.crown_material_id)
    );
    //console.log("-- after calculations, order amount ", this.order_amount);
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
    if(!this.tails_allocation_l) {      
      this.calculated_hats_info.tails_used_l = 0;
      this.calculated_hats_info.tails_remaining_l = 0;
      this.calculated_hats_info.tails_overdraft_l = this.customerHat.wing_quantity * this.order_amount;
    }
    if(!this.tails_allocation_r) {
      this.calculated_hats_info.tails_used_r = 0;
      this.calculated_hats_info.tails_remaining_r = 0;
      this.calculated_hats_info.tails_overdraft_r = this.customerHat.wing_quantity * this.order_amount;
    }
    this.customerHat.tails_overdraft_l = this.calculated_hats_info.tails_overdraft_l;
    this.customerHat.tails_overdraft_r = this.calculated_hats_info.tails_overdraft_r;

    //console.log("-- after calculations, order amount ", this.order_amount);
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
        if(this.customerHat.crown_material_id == this.customerHat.hat_material_id || this.use_the_same_allocation_for_wall_and_crown/* && !this.crown_allocation*/){
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
      else if(this.pending_allocation_area_selection == "tails_l") {
        this.tails_allocation_l = alloc;
        this.crown_allocation_units = bank? bank.raw_material_quantity_units : "";
        this.customerHat.tails_allocation_id_l = alloc_id;
        if(this.use_the_same_allocation_for_l_and_r_h_material){
          this.tails_allocation_r = alloc;
          this.crown_allocation_units = bank? bank.raw_material_quantity_units : "";
          this.customerHat.tails_allocation_id_r = alloc_id;
        }
      }
      else if(this.pending_allocation_area_selection == "tails_r") {
        this.tails_allocation_r = alloc;
        this.crown_allocation_units = bank? bank.raw_material_quantity_units : "";
        this.customerHat.tails_allocation_id_r = alloc_id;
      } 
    }
    this.aggregateHatBabiesAndMatchingAllocations();
    this.update_table_instructions();
    this.order_amount = Math.min(this.total_num_of_possible_hats, 10);
    //this.recauculate_overdraft_tails();
    this.calculateVisibleCrown();
  }

  chkHMaterial_L_is_R_changed(){
    if(this.use_the_same_allocation_for_l_and_r_h_material){      
        this.crown_allocation = this.wall_alocation;
        this.crown_allocation_units = this.wall_allocation_units;
        this.customerHat.crown_allocation_id = this.customerHat.crown_allocation_id;
    }
  }

  chkCrown_allocation_is_wall_allocation_changed(){
    if(this.use_the_same_allocation_for_wall_and_crown){
      this.customerHat.crown_material_id = this.customerHat.hat_material_id;
      this.customerHat.crown_allocation_id = this.customerHat.wall_allocation_id;      
      this.crown_allocation = this.wall_alocation;
    }
    this.update_customer(this.customer);
    this.margins_changed();
    this.update_table_instructions();
    this.calculateVisibleCrown();      
  }

  use_the_same_allocation_for_l_and_r_h_material_changed(){
    if(this.use_the_same_allocation_for_l_and_r_h_material){
      this.customerHat.tails_material_id_r = this.customerHat.tails_material_id_l;
      this.customerHat.tails_allocation_id_r = this.customerHat.tails_allocation_id_l;
      this.tails_allocation_r = this.tails_allocation_l;
    }
    this.update_table_instructions();
    this.calculateVisibleCrown();  
  }

  num_of_wings_changed(){
    this.aggregateHatBabiesAndMatchingAllocations();
    //this.recauculate_overdraft_tails();
    this.order_amount = Math.min(this.total_num_of_possible_hats, 10);
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
        this.advisor!.wing = w;
        //once the customer selects a wing, it gets copied into a new wing which can be customized
        //also given a new name, and will be saved under the hat of the customer.
        //the order won't be affected if the parent wing itself changes.
        this.selected_wing_name = w.name;
        this.customerHat.wing = w;
        this.customerHat.wing.id = w.id;
        this.customerHat.wing.name = this.generate_unique_hat_name();
        this.wing_original = (JSON.parse(JSON.stringify(w)));
        this.wing_unchanged = (JSON.parse(JSON.stringify(w)));
        this.crown_width_original = w.crown_width;
        this.is_wing_customized = false;
        this.customerHat.original_wing_name = this.selected_wing_name;

        this.diagram.setColors(this.globalsService.currentTheme());

        /*
        this.customerHat.hat_material_id = null;
        this.customerHat.crown_material_id = null;
        this.customerHat.tails_material_id_l = null;
        this.customerHat.tails_material_id_r = null;

        this.wall_alocation = null;
        this.crown_allocation = null;
        this.tails_allocation_l = null;
        this.tails_allocation_r = null;
        this.customerHat.wall_allocation_id = 0;
        this.customerHat.crown_allocation_id = 0;
        this.customerHat.tails_allocation_id_l = 0;
        this.customerHat.tails_allocation_id_r = 0;
        */
        /*
        this.num_of_allocations_with_wall_material = 0;
        this.num_of_allocations_with_crown_material = 0;
        this.num_of_allocations_with_tails_material = 0;
        /**/

        this.aggregateHatBabiesAndMatchingAllocations();
        this.update_table_instructions();
        this.order_amount = Math.min(this.total_num_of_possible_hats, 10);
        this.recalculate_hat_size();
        this.calculateVisibleCrown();
        this.calculate_wings_per_hat();
        //this.recauculate_overdraft_tails();
      });
    }
  }

  wing_cleared(){
    this.customerHat.wing = {
      id: 0, name: '', knife: 0, allow_shortening_babies_in_pairs: false,
      crown_width: 0, split_l1: 1, angled_crown: false, babies: [], customers: []
    };
    this.update_table_instructions();
  }

  wall_material_changed(material: RawMaterialBasicDetails){
    if(!material)
      return;
    this.customerHat.hat_material_id = material.id;
    this.wall_alocation = null;
    this.customerHat.wall_allocation_id = 0;
    this.allow_shortening_material_babies_in_pairs = material.allow_shortening_babies_in_pairs;
    this.customerHat.shorten_top_by = 0;
    if(this.use_the_same_allocation_for_wall_and_crown){
      this.customerHat.crown_material_id = material.id;
      this.crown_allocation = null;
      this.customerHat.crown_allocation_id = 0;
      this.customerHat.shorten_crown_by = 0;
    }
    this.is_wall_materiail_tentative = !material.has_banks_for_current_customer
    this.is_hat_tentative = (this.is_wall_materiail_tentative || this.is_crown_materiail_tentative);
    this.margins_changed();
    this.update_table_instructions();
    this.calculateVisibleCrown();  
  }

  wall_material_cleared(){
    this.customerHat.hat_material_id = null;
    this.wall_alocation = null;
    this.customerHat.wall_allocation_id = 0;
    this.customerHat.shorten_top_by = 0;
    if(this.use_the_same_allocation_for_wall_and_crown){
      this.customerHat.crown_material_id = null;
      this.crown_allocation = null;
      this.customerHat.crown_allocation_id = 0;
      this.customerHat.shorten_crown_by = 0;
    }
    this.is_hat_tentative = (this.is_wall_materiail_tentative || this.is_crown_materiail_tentative);
    this.margins_changed();
    this.update_table_instructions();
    this.calculateVisibleCrown();  
  }

  crown_material_changed(material: RawMaterialBasicDetails){
    if(!material)
      return;
    this.customerHat.crown_material_id = material.id;
    this.customerHat.crown_allocation_id = 0;
    this.crown_allocation = null;
    this.customerHat.shorten_top_by = 0;
    this.customerHat.shorten_crown_by = 0;
    this.is_crown_materiail_tentative = !material.has_banks_for_current_customer;
    this.is_hat_tentative = (this.is_wall_materiail_tentative || this.is_crown_materiail_tentative);
    this.margins_changed();
    this.update_table_instructions();
    this.calculateVisibleCrown();
  }

  tails_material_changed(material_l: RawMaterialBasicDetails | null, material_r: RawMaterialBasicDetails | null){
    if(!material_l && !material_r)
      return;
    if(material_l){
      this.customerHat.tails_material_id_l = material_l.id;
      this.customerHat.tails_allocation_id_l = 0;
      this.tails_allocation_l = null;

      this.calculated_hats_info.tails_used_l = 0;
      this.calculated_hats_info.tails_remaining_l = 0;
      this.calculated_hats_info.tails_overdraft_l = this.customerHat.wing_quantity * this.order_amount;

      if(this.use_the_same_allocation_for_l_and_r_h_material){
        this.customerHat.tails_material_id_r = material_l.id;
        this.customerHat.tails_allocation_id_r = 0;
        this.tails_allocation_r = null;

        this.calculated_hats_info.tails_used_r = 0;
        this.calculated_hats_info.tails_remaining_r = 0;
        this.calculated_hats_info.tails_overdraft_r = this.customerHat.wing_quantity * this.order_amount;
        this.is_hr_tentative = !material_l.has_banks_for_current_customer;
      }
      this.is_hl_tentative = !material_l.has_banks_for_current_customer;
    }
    
    if(material_r && !this.use_the_same_allocation_for_l_and_r_h_material){
      this.customerHat.tails_material_id_r = material_r.id;
      this.customerHat.tails_allocation_id_r = 0;
      this.tails_allocation_r = null;

      this.calculated_hats_info.tails_used_r = 0;
      this.calculated_hats_info.tails_remaining_r = 0;
      this.calculated_hats_info.tails_overdraft_r = this.customerHat.wing_quantity * this.order_amount;
      this.is_hr_tentative = !material_r.has_banks_for_current_customer;
    }

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
    this.is_hat_tentative = (this.is_wall_materiail_tentative || this.is_crown_materiail_tentative);
    this.margins_changed();
    this.update_table_instructions();
    this.calculateVisibleCrown();
  }

  tails_material_cleared(l_or_r: string) {
    if(l_or_r === 'l') {
      this.customerHat.tails_material_id_l = null;
      this.customerHat.tails_allocation_id_l = 0;
      this.tails_allocation_l = null;
      this.is_hl_tentative = false;
    } 
    if(l_or_r === 'r' || this.use_the_same_allocation_for_l_and_r_h_material) {
      this.customerHat.tails_material_id_r = null;
      this.customerHat.tails_allocation_id_r = 0;
      this.tails_allocation_r = null;
      this.is_hr_tentative = false;
    }
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
      this.allocation_picker.banks_baby_allocation_type_filter = (area=="tails_l" || area=="tails_r")? Bank_Allocation_Type.tails : Bank_Allocation_Type.babies;
      this.allocation_picker.babies = this.customer.babies;
      this.allocation_picker.customer = this.customer;
      this.allocation_picker.wing_id = (this.selected_wing_id)?? 0;
      this.pending_allocation_area_selection = area;
      this.allocation_picker.dialogWrapper.open();
    }
  }

  onCrownBabiesChanged(newBabies: WingBaby[]) {
    if(this.customerHat && this.customerHat.wing){
      // Update the parent's array with the new value from the child
      let no_crown = this.customerHat.wing.babies.filter(b => !b.position.startsWith("C"));
      this.customerHat.wing.babies = [...no_crown, ...newBabies];
      this.check_for_wing_changes();
      this.aggregateHatBabiesAndMatchingAllocations();
      this.update_table_instructions();
    }
  }

  onCrownWidthChanged(new_width: number) {
    if(this.customerHat && this.customerHat.wing){
      this.customerHat.wing.crown_width = new_width;
      this.check_for_wing_changes();
      this.calculate_wings_per_hat();
      this.aggregateHatBabiesAndMatchingAllocations();
    }
  }

  diagram_baby_clicked(baby_position:string){
    let baby = this.customerHat.wing?.babies.find(b => b.position.toUpperCase() == baby_position.toUpperCase());
    if(baby){
      if(!baby_position.startsWith("C")){
        if(this.customerHat.wing && baby){
          let crown_units = this.customerHat.wing.babies.filter((b) => b.position.startsWith("C")).length;
          this.length_editor.editedObject = baby;
          this.length_editor.dialogWrapper!.modalTitle = "Edit " + ((baby.position.toUpperCase().startsWith("C"))? "Crown" : baby.position);
          this.length_editor.crown_units = crown_units;
          //this.length_editor.crown_babies_options = [];
          this.length_editor.dialogWrapper!.open();
        }
      }
      else {
        this.crown_editor_dialog.open();
      }      
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

  knife_changed(){
    //console.dir();
    if(this.customerHat.wing && this.knife_selector.selectedValues.length > 0){
     this.customerHat.wing.knife = this.knife_selector.selectedValues[0];
     this.recalculate_hat_size();
    }
  }

  recalculate_hat_size(){
    this.wing_total_height = (this.customerHat.wing)?this.customerHat.wing.knife : 0;
    if(this.customerHat && this.customerHat.wing){
      if(this.customerHat.wing.babies){
        const L1 = this.customerHat.wing.babies.find(b => b.position.toUpperCase() == "L1");
        const longest_crown_baby = this.customerHat.wing.babies
          .filter(c => c.position.toUpperCase().startsWith("C"))
          .reduce((a, b) => (b.length > a.length ? b : a));
        const L1_len = (L1) ? L1.length : 0;
        const longest_crown_baby_length = (longest_crown_baby) ? longest_crown_baby.length : 0;
        this.wing_total_height += (L1_len + longest_crown_baby_length);
        this.min_height_for_wing = (this.min_knife + L1_len + longest_crown_baby_length);
        this.max_height_for_wing = (this.max_knife + L1_len + longest_crown_baby_length);

        //this.console.log("min: " + this.min_height_for_wing + "cm");
        //this.console.log("max: " + this.max_height_for_wing + "cm");
        this.arr_wing_total_height.forEach(h => {
          h.disabled = (h.cm < this.min_height_for_wing || h.cm > this.max_height_for_wing);
        });
        this.arr_wing_total_height =
          this.arr_wing_total_height.map(item => ({
            ...item
          }));
      }
    }
  }  

  height_changed(new_height: string){
    if(this.customerHat && this.customerHat.wing){
      //this.customerHat.wing.knife = Number(new_height);
      this.wing_knife = Number(new_height);

      if(this.customerHat.wing.babies){
        const L1 = this.customerHat.wing.babies.find(b => b.position.toUpperCase() == "L1");
        const longest_crown_baby = this.customerHat.wing.babies
          .filter(c => c.position.toUpperCase().startsWith("C"))
          .reduce((a, b) => (b.length > a.length ? b : a));
        const L1_len = (L1) ? L1.length : 0;
        const longest_crown_baby_length = (longest_crown_baby) ? longest_crown_baby.length : 0;
        this.wing_knife -= (L1_len + longest_crown_baby_length);
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
        else if (!updated_baby){
          changed = true;
        }
      });
      this.customerHat.wing.babies.forEach(current_baby => {
        let updated_baby = this.wing_original?.babies.find(b => b.position.toUpperCase() == current_baby.position.toUpperCase());
        if(updated_baby && updated_baby.length != current_baby.length){
          changed = true;
        }
        else if (!updated_baby){
          changed = true;
        }
      });      
      if(!changed){
        changed = ((this.crown_width_original != null) && (this.crown_width_original != this.customerHat.wing.crown_width));
      }
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
    this.order_amount = Math.min(this.total_num_of_possible_hats, 10);
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
    this.console.log("***here " , this.total_babies_per_hat);
    this.order_amount = Math.min(this.total_num_of_possible_hats, 10);
    this.recalculate_hat_size();
    this.calculateVisibleCrown();
  }

  async confirm_reset(){
    const confirmed = await this.confirm_action.open_with_message({
      modalTitle: "Reset customizations",
      modalText: "Are you sure you want to reset the changes made to this wing?",
      btnYesIcon: faArrowsRotate,
      btnYesText: "Reset",
      btnYesClass: "btn-danger"
    });
    if(confirmed){
      this.customerHat.wing = (JSON.parse(JSON.stringify(this.wing_original)));
      this.wing_unchanged = (JSON.parse(JSON.stringify(this.wing_original)));
      this.customerHat.shorten_top_by = 0;
      this.customerHat.shorten_crown_by = 0;
      if(this.crown_width_original != null && this.customerHat.wing){
        this.customerHat.wing.crown_width = this.crown_width_original;
      }
      this.margins_changed();
      this.check_for_wing_changes();
      this.calculateVisibleCrown();
    }
  }

  update_table_instructions(){
    this.summary_table_instructions = "";
    if(this.customerHat.wing == null || this.customerHat.wing.id <= 0) {
      this.summary_table_instructions = "Please select a wing";
    }
    else {
      if(this.customerHat.wing.id > 0 && this.customerHat.wing.babies.length == 0) {
        this.summary_table_instructions = "This wing design has no babies";
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
            if(!this.is_hat_tentative){
              if(!this.wall_alocation) {
                this.summary_table_instructions = "Please select the wall allocation";
              }
              else {
                if(!this.crown_allocation) {
                  this.summary_table_instructions = "Please select the crown allocation";
                }
            }
/*
              else {
                if(!this.tails_allocation) {
                  this.summary_table_instructions = "Please select the H allocation";
                }
              }*/
            }
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

  duplicate_customer_name(){
    if (this.customerHat.single_hat_orders.length > 1){
      for(let i=0; i < this.customerHat.single_hat_orders.length; i++){
        this.customerHat.single_hat_orders[i].ordering_customer_name = this.customerHat.single_hat_orders[0].ordering_customer_name;
      }
    }
  }

  calculate_wings_per_hat(){
    if(this.customerHat && this.customerHat.wing){
      let circomference_cm = (this.diameter_inches * this.inch_to_cm * Math.PI) - 1;
      this.customerHat.wing_quantity = Math.floor(circomference_cm / this.customerHat.wing.crown_width);
    }
  }

  diameter_changed(){
    this.calculate_wings_per_hat();
    this.aggregateHatBabiesAndMatchingAllocations();
  }

  async placeOrder(){
    if(this.order_amount > 10){
      const confirmed = await this.confirm_action.open_with_message({
        modalTitle: "Large order",
        modalText: `Are you sure you want want to order ${this. order_amount} hats?`,
        dialogIcon: faTriangleExclamation,
        btnYesIcon: faBasketShopping,
        btnYesText: "I'm sure",
        btnYesClass: "btn-success",
        btnNoText: "Cancel"
      });
      if(!confirmed){
        return;
      }
    }

    let babies_in_wall_allocation = (this.wall_alocation)? (this.customer.babies.filter(b => b.allocation_id == this.wall_alocation?.id)) : [];
    let babies_in_crown_allocation = (this.crown_allocation)? (this.customer.babies.filter(b => b.allocation_id == this.crown_allocation?.id)) : [];

    this.customerHat.single_hat_orders = Array(this.order_amount).fill(0)
      .map((_, index) => ({
        id: index, // or generate a unique ID
        customer_order_seq_number: 0,
        wing_quantity: this.customerHat.wing_quantity,
        kippa_size: this.kippa_size,
        diameter_inches: this.diameter_inches,
        ordering_customer_name: "",
        num_of_hats: 1,
        is_tentative: this.is_hat_tentative,
        status: {
          id: 0,
          date: new Date(),
          order_status: (this.is_hat_tentative)? Status.tentative : Status.new
        }
      }));
    /*
    this.wings_per_hat_in_order = Array(this.order_amount).fill(this.customerHat.wing_quantity);
    this.wings_per_hat_in_order_previous_values = Array(this.order_amount).fill(this.customerHat.wing_quantity);
    this.allWingsInOrder = this.wings_per_hat_in_order.reduce((partialSum, a) => partialSum + a, 0);
    */
   this.allWingsInOrder = this.customerHat.single_hat_orders.reduce((partialSum, a) => partialSum + a.wing_quantity, 0);
    
    this.max_number_of_wings_in_all_allocations = this.hatsCalculatorService.getMaxNumberOfWingsInAllocations(this.customerHat.wing,
      babies_in_wall_allocation,
      babies_in_crown_allocation,
      null,//this.tails_allocation, //ommit the tails, because they don't affect the wings per order (go to overdraft if needed)
      (this.wall_alocation?.id != this.crown_allocation?.id));
    //this.console.log("You can produce " + this.max_number_of_wings_in_all_allocations + " wings with your allocations, and you are producing " + this.allWingsInOrder);
    this.order_wing_adjustment.open();
    //this.order_confirmation.open();
  }

  //prevent the focus from jumping between boxes
  trackByIndex(index: number, item: number): number {
    return index;
  }

  trackByOrder(index: number, order: any): number {
    return index;
  }

  dont_exceed_max_wings(event:any, index: number): void {
    let max_gap = this.max_number_of_wings_in_all_allocations - this.allWingsInOrder;
    let increased_value = this.customerHat.single_hat_orders[index].wing_quantity - this.wings_per_hat_in_order_previous_values[index];
    if(increased_value > max_gap) {
      let limited_new_value = this.wings_per_hat_in_order_previous_values[index] + max_gap;
      this.customerHat.single_hat_orders[index].wing_quantity = limited_new_value;
      event.target.value = limited_new_value;
      this.wings_per_hat_in_order_previous_values[index] = limited_new_value;
    }
    else {
      this.wings_per_hat_in_order_previous_values[index] = this.customerHat.single_hat_orders[index].wing_quantity;
      event.target.value = this.customerHat.single_hat_orders[index].wing_quantity;
    }
    //this.allWingsInOrder = this.wings_per_hat_in_order.reduce((partialSum, a) => partialSum + a, 0);
    this.allWingsInOrder = this.customerHat.single_hat_orders.reduce((partialSum, a) => partialSum + a.wing_quantity, 0);
  }

  placeOrderConfirmed() {
    this.placing_order = true;
    
    this.ordersService.createOrder(this.customerHat).subscribe(
      {
        next:(data) => { 
          //this.console.dir(data);
          this.toastService.showSuccess(data["message"]);
          //refresh the wings, if they were changed by the order
          this.wingsService.getWings_for_customer(this.customer.id).subscribe(wingsListInfo => {
            this.wings = wingsListInfo.data.sort((w1:WingsListItem, w2:WingsListItem) => {
              //this.console.log(w1.name);
              const w1_len = w1.name.match(/[^\d]*(\d*)[^\d]*/);
              const w2_len = w2.name.match(/[^\d]*(\d*)[^\d]*/);
              if(w1_len && w2_len && w1_len.length > 1 && w2_len.length > 1){
                return Number(w2_len[1]) - Number(w1_len[1]);
              }
              else {
                return 0;
              }
            });
            if(this.customerHat.save_wing_for_customer && this.customerHat.save_wing_name_for_customer){
              const new_wing_created = this.wings.find(w => w.name == this.customerHat.save_wing_name_for_customer);
              if(new_wing_created){
                this.selected_wing_id = new_wing_created.id;
              }
              this.customerHat.save_wing_for_customer = false;
              this.customerHat.save_wing_name_for_customer = "";
            }
          });

          // if not tentative
          if(!this.is_hat_tentative){
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
            //let arr_adjusted_wings_per_hat = this.customerHat.adjusted_wings_per_hat.split(",");
            const total_num_of_wings = this.customerHat.single_hat_orders
              .reduce((accumulator, currentItem) => { 
                //let curVal_num = parseInt(currentItem.wing_quantity);
                //if(isNaN(curVal_num)){
                //  curVal_num = 0;
                //}
                return accumulator + currentItem.wing_quantity;
              }, 0);

            if (this.tails_allocation_l){
              if(this.tails_allocation_l.tails_quantity >= total_num_of_wings) {
                this.tails_allocation_l.tails_quantity -= total_num_of_wings;
                this.tails_allocation_l.tails_in_orders += total_num_of_wings;
              }
              else {
                const missing_tails_in_allocation = total_num_of_wings - this.tails_allocation_l.tails_quantity;
                //move all the tails in the allocation to the orders, and the remainder to overdraft
                this.tails_allocation_l.tails_in_orders += this.tails_allocation_l.tails_quantity;
                this.tails_allocation_l.tails_quantity = 0;
                this.customerHat.tails_overdraft_l = missing_tails_in_allocation;
              }            
            }
            else {
              this.customerHat.tails_overdraft_l = total_num_of_wings;
            }

            if (this.tails_allocation_r){
              if(this.tails_allocation_r.tails_quantity >= total_num_of_wings) {
                this.tails_allocation_r.tails_quantity -= total_num_of_wings;
                this.tails_allocation_r.tails_in_orders += total_num_of_wings;
              }
              else {
                const missing_tails_in_allocation = total_num_of_wings - this.tails_allocation_r.tails_quantity;
                //move all the tails in the allocation to the orders, and the remainder to overdraft
                this.tails_allocation_r.tails_in_orders += this.tails_allocation_r.tails_quantity;
                this.tails_allocation_r.tails_quantity = 0;
                this.customerHat.tails_overdraft_r = missing_tails_in_allocation;
              }            
            }
            else {
              this.customerHat.tails_overdraft_r = total_num_of_wings;
            }
        }


        this.aggregateHatBabiesAndMatchingAllocations();
        this.order_amount = Math.min(this.total_num_of_possible_hats, 10);
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

  @HostListener('window:resize', ['$event'])
    onResize(event: Event) {
        //this.console.log(`w: ${(event.target as Window).innerWidth.toFixed(0)}, h: ${(event.target as Window).innerHeight.toFixed(0)}`);
        const w = (event.target as Window).innerWidth;
        if((w < 1300) && (w <= 1998)){
          this.diagram.scale = 0.9;
          this.diagram.Rebuild();
        }
        if(w < 1198){
          this.diagram.scale = 0.7;
          this.diagram.Rebuild();
        }        
        else {
          this.diagram.scale = 1;
          this.diagram.Rebuild();
        }
    }

    open_wing_editor(){
      this.advanced_wing_editor.wing = this.customerHat!.wing;
      this.advanced_wing_editor_dialog.open();
    }

    revert_advanced_edit(){
      //alert("reverting")
      //this.console.dir(this.advanced_wing_editor.unedited_wing);
      if(this.advanced_wing_editor.unedited_wing) {
        this.customerHat.wing = {...this.advanced_wing_editor.unedited_wing, babies: [...this.advanced_wing_editor.unedited_wing.babies ] };
        this.aggregateHatBabiesAndMatchingAllocations();
        this.update_table_instructions();
        this.order_amount = Math.min(this.total_num_of_possible_hats, 10);
        this.recalculate_hat_size();
        this.calculateVisibleCrown();
        this.calculate_wings_per_hat();       
      }
    }
    advanced_edit_confirmed() {
      if(this.advanced_wing_editor.wing) {
        this.customerHat.wing = {...this.advanced_wing_editor.wing, babies: [...this.advanced_wing_editor.wing.babies ] };
        this.aggregateHatBabiesAndMatchingAllocations();
        this.update_table_instructions();
        this.order_amount = Math.min(this.total_num_of_possible_hats, 10);
        this.recalculate_hat_size();
        this.calculateVisibleCrown();
        this.calculate_wings_per_hat();     
      }
    }
}