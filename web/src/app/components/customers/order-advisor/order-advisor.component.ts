import { AfterViewInit, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { WingsService } from '../../../services/wings.service';
import { aggregated_babies, HatsCalculatorService } from '../../../services/hats-calculator.service';
import { Allocation_Baby, Customer_Bank_Baby_Allocation, Wing, WingBaby, ShortWingsInfo, OrderAdvisorWingOverall, OrderAdvisorHatsSuggestionAlternative, Customer_Bank, OrderAdvisorHatsSuggestion } from '../../../../types';
import { Router, withEnabledBlockingInitialNavigation } from '@angular/router';
import { DecimalPipe, NgFor, NgIf } from '@angular/common';
import { faArrowsRotate, faLightbulb, faSave, faTriangleExclamation, IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { ModalDialogComponent } from "../../common/modal-dialog/modal-dialog.component";
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-order-advisor',
  standalone: true,
  imports: [NgIf, NgFor, FaIconComponent, ModalDialogComponent, NgSelectModule, FormsModule, DecimalPipe ],
  templateUrl: './order-advisor.component.html',
  styleUrl: './order-advisor.component.scss'
})
export class OrderAdvisorComponent implements OnInit, AfterViewInit, OnChanges {
  
  @Input() wall_bank: Customer_Bank | null = null;
  @Input() crown_bank: Customer_Bank | null = null;
  @Input() tails_bank: Customer_Bank | null = null;
  @Input() wing_id: number = 0;
  @Input() wall_allocation: Customer_Bank_Baby_Allocation | null = null;
  @Input() crown_allocation: Customer_Bank_Baby_Allocation | null = null;
  @Input() tails_allocation: Customer_Bank_Baby_Allocation | null = null;
  @Input() customer_wall_babies: Allocation_Baby[] = [];
  @Input() customer_crown_babies: Allocation_Baby[] = [];
  @Input() show_options_button: boolean = true;
  @Input() try_to_exceed: number = -1;
  @Input() numOfWingsPerHat: number = 44;
  @Input() show_help_me_adjust_button: boolean = true;

  @Input() wait_for_saved_changes: boolean = false;
  @Input() pending_saved_changes: boolean = true;
  @Output() triggerSaveChanges = new EventEmitter<any>();

  @ViewChild("advisor_dialog") advisor_dialog!: ModalDialogComponent;
  @ViewChild("hat_creation_assistant") hat_creation_assistant!: ModalDialogComponent;

  allocation_wall_babies: Allocation_Baby[] = [];
  allocation_crown_babies: Allocation_Baby[] = [];

  calculating: boolean = false;
  not_enough_data: boolean = false;
  systemWings: Wing[] = [];
  suggestions: OrderAdvisorWingOverall = {
    wing_suggestions: [],
    max_num_of_hats: 0,
    max_hat_wing_name: '',
    max_hat_wing_id: 0,
    crown_allocation_id: 0,
    wall_allocation_id: 0
  };
  faLightbulb: IconDefinition = faLightbulb;
  faTriangleExclamation: IconDefinition = faTriangleExclamation;
  faArrowsRotate: IconDefinition = faArrowsRotate;
  faSave: IconDefinition = faSave;

  //Exceed calculator (to improve the wing selection)
  exceed_number_of_hats_message: string = "";
  already_at_max_num_of_hats: boolean = false;
  exceed_number_shorten_top: number = -1;
  exceed_number_shorten_crown: number = -1;
  @Output() fetchExceedInstructions = new EventEmitter<any>();

  //wing construction assistant
  assistant_selected_wing_id: number  | null= null;
  assistant_wing_quantity: number = 44;
  assistant_num_of_hats: number = 0;
  assistant_aggregated_hat_babies: aggregated_babies[] = []; //containing aggregated babies with length, quantity and num of hats
  assistant_aggregated_crown_babies: aggregated_babies[] = []; //crown_babies are used only if the allocations are split between hat and crown  
  @Output() assistantAutoAddBabies = new EventEmitter<any>();

  constructor(
    private wingsSerice: WingsService, 
    private hatsCalculatorService: HatsCalculatorService,
    private router: Router) 
  {  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.runCalculations();
  }

  ngOnChanges(changes: SimpleChanges): void {
    //console.log("ngOnChanges:");
    //console.dir(changes);
    this.allocation_wall_babies = this.customer_wall_babies.filter(b => b.allocation_id == ((this.wall_allocation) ? this.wall_allocation.id : 0));
    this.allocation_crown_babies = this.customer_crown_babies.filter(b => b.allocation_id == ((this.crown_allocation) ? this.crown_allocation.id : 0));

    this.runCalculations();
  }

  updateBabies(new_wall_babies: Allocation_Baby[], new_crown_babies: Allocation_Baby[] ) {
    this.customer_wall_babies = new_wall_babies;
    this.customer_crown_babies = new_crown_babies;
    this.allocation_wall_babies = this.customer_wall_babies.filter(b => b.allocation_id == ((this.wall_allocation) ? this.wall_allocation.id : 0));
    this.allocation_crown_babies = this.customer_crown_babies.filter(b => b.allocation_id == ((this.crown_allocation) ? this.crown_allocation.id : 0));
    //console.log("advisor updated " + this.wall_allocation!.id);
    //console.dir(this.allocation_wall_babies);
    this.runCalculations();
  }

  runCalculations() {
    //console.log("runCalculations: ");
    //console.dir(this.wall_allocation)
    if(!this.wait_for_saved_changes || !this.pending_saved_changes) {
      this.calculating = true;
      console.log("recalculating with " + this.numOfWingsPerHat + " wings per hat");
      this.calculate(this.numOfWingsPerHat).then((data: OrderAdvisorWingOverall) => {
        this.calculating = false;
        //console.dir(this.suggestions);
      });
    }
  }


  //aggregate the wings with their babies
  formatWingCalculationItemsAsWings(wingShortInfo: ShortWingsInfo[]){
    this.systemWings = [];

    let wing_ids = [...new Set( wingShortInfo.map(w => w.w_id))];
    wing_ids.forEach((w_id) => {
      let wing = wingShortInfo.find(w => w.w_id == w_id);
      if(wing){
        let babies = wingShortInfo.filter(b => b.w_id == w_id).map((b):WingBaby => { return {
          id: b.b_id,
          wing_id: w_id,
          length: b.l,
          position: b.p
        }});
        this.systemWings.push({
          id: w_id,
          name: wing.w_n,
          knife: 0,
          babies: babies,
          allow_shortening_babies_in_pairs: false
        });
        }
      });
  }

  calculate(numOfWingsPerHat:number=44) : Promise<OrderAdvisorWingOverall> {
    if(!this.wall_allocation || !this.crown_allocation) {
      this.not_enough_data = true;
      return new Promise((resolve, reject ) => { resolve({
            wing_suggestions: [],
            max_num_of_hats: 0,
            max_hat_wing_name: '',
            max_hat_wing_id: 0,
            wall_allocation_id: 0,
            crown_allocation_id: 0
        })
      });
    }
    this.not_enough_data = false;
    this.exceed_number_of_hats_message = "";
    this.already_at_max_num_of_hats = false;
    return new Promise((resolve, reject) => {
      // Perform asynchronous operation
      // If operation is successful, call resolve()
      // If operation fails, call reject()
      this.wingsSerice.getAllNonCustomerWingsAndBabies(this.wing_id).subscribe({
        next: (allNonCustomerWingsInfo: ShortWingsInfo[]) => {
          this.suggestions = {
            wing_suggestions: [],
            max_num_of_hats: 0,
            max_hat_wing_id: 0,
            max_hat_wing_name: '',
            wall_allocation_id: 0,
            crown_allocation_id: 0
          };
          this.formatWingCalculationItemsAsWings(allNonCustomerWingsInfo);
          
          // option 1: specific crown and wall allocation, one of each
          //   save the wall allocation in an array of one
          //   if they are the same, equalize them
          //   send both to the calculator
          //
          //option 2: running through all allocations
          //  the array is of all allocations

          //Go over the customer's allocations and babies, and see which wings can be made from them
          //this.wall_allocation.forEach((allocation: Customer_Bank_Baby_Allocation) => {
          this.suggestions.wall_allocation_id = (this.wall_allocation) ? this.wall_allocation.id : 0;
          this.suggestions.crown_allocation_id = (this.crown_allocation) ? this.crown_allocation.id : 0;
            this.systemWings.forEach((systemWing:Wing) => {

            /**
             * loop over the banks
             *  loop over the wings
             *      check 9 wing options:
             *        + regular
             *        + regular & crown 0.5
             *        + regular & crown 1
             *        + reduced top 0.5
             *        + reduced top 0.5 & crown 0.5
             *        + reduced top 0.5 & crown 1
             *        + reduced top 1
             *        + reduced top 1 & crown 0.5
             *        reduced top 1 & crown 1
             */

            //the wing as it is
            this.calculateHatInfoForWing(
              systemWing,
              0, //reduce top
              0, //reduce crown
              this.wall_allocation!,        //wall
              this.allocation_wall_babies,  //wall
              this.crown_allocation!,       //crown
              this.allocation_crown_babies, //crown
              numOfWingsPerHat
            );

            //reduce crown by 0.5
            this.calculateHatInfoForWing(
              systemWing,
              0, //reduce top
              0.5, //reduce crown
              this.wall_allocation!,        //wall
              this.allocation_wall_babies,  //wall
              this.crown_allocation!,       //crown
              this.allocation_crown_babies, //crown
              numOfWingsPerHat
            );

            //reduce crown by 1
            this.calculateHatInfoForWing(
              systemWing,
              0, //reduce top
              1, //reduce crown
              this.wall_allocation!,        //wall
              this.allocation_wall_babies,  //wall
              this.crown_allocation!,       //crown
              this.allocation_crown_babies, //crown
              numOfWingsPerHat
            );

            //reduce top by 0.5
            this.calculateHatInfoForWing(
              systemWing,
              0.5, //reduce top
              0, //reduce crown
              this.wall_allocation!,        //wall
              this.allocation_wall_babies,  //wall
              this.crown_allocation!,       //crown
              this.allocation_crown_babies, //crown
              numOfWingsPerHat
            );

            //reduce top by 0.5, crown by 0.5
            this.calculateHatInfoForWing(
              systemWing,
              0.5, //reduce top
              0.5, //reduce crown
              this.wall_allocation!,        //wall
              this.allocation_wall_babies,  //wall
              this.crown_allocation!,       //crown
              this.allocation_crown_babies, //crown
              numOfWingsPerHat
            );

            //reduce top by 0.5, crown by 1
            this.calculateHatInfoForWing(
              systemWing,
              0.5, //reduce top
              1, //reduce crown
              this.wall_allocation!,        //wall
              this.allocation_wall_babies,  //wall
              this.crown_allocation!,       //crown
              this.allocation_crown_babies, //crown
              numOfWingsPerHat
            );

            //reduce top by 1, crown by 0
            this.calculateHatInfoForWing(
              systemWing,
              1, //reduce top
              0, //reduce crown
              this.wall_allocation!,        //wall
              this.allocation_wall_babies,  //wall
              this.crown_allocation!,       //crown
              this.allocation_crown_babies, //crown
              numOfWingsPerHat
            );

            //reduce top by 1, crown by 0.5
            this.calculateHatInfoForWing(
              systemWing,
              1, //reduce top
              0.5, //reduce crown
              this.wall_allocation!,        //wall
              this.allocation_wall_babies,  //wall
              this.crown_allocation!,       //crown
              this.allocation_crown_babies, //crown
              numOfWingsPerHat
            );

            //reduce top by 1, crown by 1
            this.calculateHatInfoForWing(
              systemWing,
              1, //reduce top
              1, //reduce crown
              this.wall_allocation!,        //wall
              this.allocation_wall_babies,  //wall
              this.crown_allocation!,       //crown
              this.allocation_crown_babies, //crown
              numOfWingsPerHat
            );

            //console.log("calculating wing " + systemWing.name);
            //console.log("Max hats: " + this.suggestions.max_num_of_hats);
          });
          //});

          //this.suggestions.wing_suggestions.sort((wing_a, wing_b) => wing_b.max_num_of_hats - wing_a.max_num_of_hats);
          this.suggestions.wing_suggestions.sort((w1:OrderAdvisorHatsSuggestion, w2:OrderAdvisorHatsSuggestion) => {
            const w1_len = w1.wing_name.match(/[^\d]*(\d*)[^\d]*/);
            const w2_len = w2.wing_name.match(/[^\d]*(\d*)[^\d]*/);
            if(w1_len && w2_len && w1_len.length > 1 && w2_len.length > 1){
              return Number(w2_len[1]) - Number(w1_len[1]);
            }
            else {
              return 0;
            }
          });

          this.suggestions.wing_suggestions.forEach(wing_suggestion => {
            wing_suggestion.alternatives.sort((alt_a, alt_b) => alt_b.max_num_of_hats - alt_a.max_num_of_hats);
          });
          resolve(this.suggestions);
        }
      })
    })
  }

    calculateHatInfoForWing(
      wing: Wing,
      reduceTop: number,
      reduceCrown: number,
      wallAllocation: Customer_Bank_Baby_Allocation,
      wallAllocationBabies: Allocation_Baby[],
      crownAllocation: Customer_Bank_Baby_Allocation,
      crownAllocationBabies: Allocation_Baby[],
      wingsPerHat: number
    ){
      let adjustedWing: Wing | null = wing;
      if(reduceTop > 0 || reduceCrown > 0){
        const allow_shortening_babies_in_pairs = (wing.allow_shortening_babies_in_pairs && this.wall_bank != null && this.wall_bank.allow_shortening_babies_in_pairs);
        adjustedWing = this.hatsCalculatorService.adjustWingToShortenedTCrownOrTop(wing, reduceTop, reduceCrown, allow_shortening_babies_in_pairs);
      }
      let hats_info = this.hatsCalculatorService.aggregateHatBabiesAndMatchingAllocations(
        adjustedWing,
        wallAllocation, crownAllocation,               //same allocation for crown and wall
        this.tails_allocation,                                          //not counting tails here
        wallAllocationBabies, crownAllocationBabies,  //same babies for crown and wall
        wingsPerHat, -1);

      if(this.tails_allocation && hats_info.max_num_of_hats_with_tails <= 0 && this.suggestions.wing_suggestions.length == 0){
        this.try_to_exceed = -1;
        this.suggestions.max_num_of_hats = -1;
        return;
      }

      if(hats_info.total_num_of_possible_hats > 0) {
        //console.log("For wing " + wing.name + "(alloc(w) #" + wallAllocation.id + ", alloc(c) #" + crownAllocation.id + ", top: -"+ reduceTop + ", crown: -" + reduceCrown + "):" +  hats_info.total_num_of_possible_hats + " hats");
        
        //if there no is a suggestion for this wing, create one
        let wing_suggestion = this.suggestions.wing_suggestions.find(w => w.wing_id == wing.id);
        if(!wing_suggestion){
          wing_suggestion = {
            wing_id: wing.id,
            wing_name: wing.name,
            num_of_wings_per_hat: wingsPerHat,
            max_num_of_hats: hats_info.total_num_of_possible_hats,///*Math.max(hats_info.total_num_of_possible_hats,*/ this.suggestions.max_num_of_hats/*)*/,
            alternatives: []
          };
          this.suggestions.wing_suggestions.push(wing_suggestion);
        }
        wing_suggestion.alternatives.push({
          shorten_top: reduceTop,
          shorten_crown: reduceCrown,
          max_num_of_hats: hats_info.total_num_of_possible_hats,
          descriptive_string: this.generateDescriptiveString(reduceTop, reduceCrown, hats_info.total_num_of_possible_hats)
        });
        if(hats_info.total_num_of_possible_hats > wing_suggestion.max_num_of_hats){
          wing_suggestion.max_num_of_hats = hats_info.total_num_of_possible_hats;
        }

        if(hats_info.total_num_of_possible_hats > this.suggestions.max_num_of_hats){
          this.suggestions.max_num_of_hats = hats_info.total_num_of_possible_hats;
          this.suggestions.max_hat_wing_id = wing.id;
          this.suggestions.max_hat_wing_name = wing.name;
        }
      }
      if(this.try_to_exceed >= 0) {
        if(this.wing_id > 0 && this.suggestions.max_num_of_hats > this.try_to_exceed){
          let current_wing_alternatives = this.suggestions.wing_suggestions.find(s => s.wing_id == this.wing_id);
          if(current_wing_alternatives) {
            let highest_alternative = current_wing_alternatives.alternatives.find(a => a.max_num_of_hats == this.suggestions.max_num_of_hats);
            this.exceed_number_of_hats_message = `Get ${highest_alternative?.max_num_of_hats} ${ (highest_alternative?.max_num_of_hats == 1)? 'hat':'hats' }, if you ` + 
            ((highest_alternative?.shorten_top && highest_alternative?.shorten_top > 0)? `reduce the top by ${ highest_alternative?.shorten_top.toFixed(1) }cm` : `set the top to 0`) + 
            `, and ` + 
            ((highest_alternative?.shorten_crown && highest_alternative?.shorten_crown > 0)? `reduce the crown by ${ highest_alternative?.shorten_crown.toFixed(1) }cm` : `set the crown to 0`);

            this.exceed_number_shorten_top = highest_alternative?.shorten_top ?? -1;
            this.exceed_number_shorten_crown = highest_alternative?.shorten_crown ?? -1;
          }
          this.already_at_max_num_of_hats = false;
        }
        else {
          //if(hats_info.total_num_of_possible_hats > 0) {
            this.exceed_number_of_hats_message = "You are already at the max number of hats for this allocation";
          //}
          //else {
          //  this.exceed_number_of_hats_message = "You don't have sufficient quotas to produce this hat -> " + hats_info.total_num_of_possible_hats;
          //}
          this.already_at_max_num_of_hats = true;
          this.exceed_number_shorten_top = -1;
          this.exceed_number_shorten_crown = -1;
        }
      }         
    }

    generateDescriptiveString(shorten_top: number, shorten_crown: number, num_of_hats: number){
      if(shorten_crown == 0 && shorten_top == 0){
        return `Original wing form, order up to ${ num_of_hats } ${ (num_of_hats==1)?'hat':'hats' }`;
      }
      if(shorten_crown > 0 && shorten_top == 0){
        return `Shorten the crown by ${ shorten_crown.toFixed(1) }cm, for up to ${ num_of_hats } ${ (num_of_hats==1)?'hat':'hats' }`;
      }
      if(shorten_crown == 0 && shorten_top > 0){
        return `Shorten the top by ${ shorten_top.toFixed(1) }cm, for up to ${ num_of_hats } ${ (num_of_hats==1)?'hat':'hats' }`;
      }
      if(shorten_crown > 0 && shorten_top > 0){
        return `Shorten the crown by ${ shorten_crown.toFixed(1) }cm and the top by ${ shorten_top.toFixed(1) }cm, for up to ${ num_of_hats } ${ (num_of_hats==1)?'hat':'hats' }`;
      }
      return "";
    }

    openAdviseTable() {
      this.advisor_dialog.open();
    }

    goToCalculator(wing_id: number, wall_allocation_id:number, crown_allocation_id: number, shorten_top: number, shorten_crown: number){
      this.advisor_dialog.onCancel();
      let queryParams = { 
        wing_id: wing_id,
        w_mat: this.wall_bank!.raw_material_id,
        c_mat: this.crown_bank!.raw_material_id,
        w_aloc: wall_allocation_id,
        c_aloc: crown_allocation_id,
        s_t: shorten_top,
        s_c: shorten_crown,
        t_aloc: 0,
        t_mat: 0,
      };
      if(this.tails_bank && this.tails_bank.raw_material_id){
        queryParams["t_mat"] = this.tails_bank.raw_material_id;
      }
      if(this.tails_allocation){
        queryParams["t_aloc"] = this.tails_allocation.id;
      }
      this.router.navigate(['/inventory/customer/hat-calculator'], { 
        queryParams: queryParams,
        queryParamsHandling:'merge'
      });
    }

    helpCreateHat(){
      if(this.systemWings.length == 1){
        this.assistant_selected_wing_id = this.systemWings[0].id;
      }
      else {
        this.assistant_selected_wing_id = null;
      }
      this.assistant_wing_quantity = 44;
      this.assistant_num_of_hats = 1;
      this.hat_creation_assistant.open();
      this.assistant_recalculate ();
    }

    assistant_recalculate () {
      if(this.assistant_selected_wing_id && this.assistant_selected_wing_id > 0){
        let wing = this.systemWings.find(w => w.id == this.assistant_selected_wing_id);
        if(wing){
          let aggregation = this.hatsCalculatorService.aggregateHatBabiesAndMatchingAllocations(
            wing, 
            this.wall_allocation, 
            this.crown_allocation,
            null, 
            this.allocation_wall_babies, 
            this.allocation_crown_babies, 
            this.assistant_wing_quantity, 
            this.assistant_num_of_hats);
            //console.dir(aggregation);

          this.assistant_aggregated_hat_babies = aggregation.hat_babies;
          this.assistant_aggregated_crown_babies = aggregation.crown_babies;
          this.assistant_aggregated_hat_babies.forEach(wing_baby_info => {
            let total_needed_per_hat = wing_baby_info.quantity //number of babies in this length required per hat
            let total_for_all_hats = total_needed_per_hat * this.assistant_num_of_hats;
            wing_baby_info.remaining = Math.max(total_for_all_hats - wing_baby_info.quantity_in_allocation, 0);
          });
          this.assistant_aggregated_crown_babies.forEach(wing_baby_info => {
            let total_needed_per_hat = wing_baby_info.quantity //number of babies in this length required per hat
            let total_for_all_hats = total_needed_per_hat * this.assistant_num_of_hats;
            wing_baby_info.remaining = Math.max(total_for_all_hats - wing_baby_info.quantity_in_allocation, 0);
          });
        }
      }      
    }

    assistant_add_babies() {
      //console.log("emitting: ");
      //console.dir(this.wall_allocation)
      this.assistantAutoAddBabies.emit({
        hat_alloc_id: ((this.wall_allocation) ? this.wall_allocation.id : 0),
        crown_alloc_id: ((this.crown_allocation) ? this.crown_allocation.id : 0),
        hat: this.assistant_aggregated_hat_babies,
        crown: this.assistant_aggregated_crown_babies
      });
    }

    emit_exceed_operation(){
      this.fetchExceedInstructions.emit({ 
        top: this.exceed_number_shorten_top, 
        crown: this.exceed_number_shorten_crown
      });
    }

    emitSaveChanges(){
      this.triggerSaveChanges.emit();
    }
}
