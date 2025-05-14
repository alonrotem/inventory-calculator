import { Component, EventEmitter, Input, OnInit, ViewChild } from '@angular/core';
import { WingsService } from '../../../services/wings.service';
import { HatsCalculatorService } from '../../../services/hats-calculator.service';
import { Customer_Baby, Customer_Bank_Baby_Allocation, Wing, WingBaby, ShortWingsInfo, OrderAdvisorWingOverall, OrderAdvisorHatsSuggestionAlternative, Customer_Bank } from '../../../../types';
import { Router, withEnabledBlockingInitialNavigation } from '@angular/router';
import { NgFor, NgIf } from '@angular/common';
import { faArrowsRotate, faLightbulb, faTriangleExclamation, IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { ModalDialogComponent } from "../../common/modal-dialog/modal-dialog.component";
import { ModalContentDirective } from '../../common/directives/modal-content.directive';
import { of } from 'rxjs';

@Component({
  selector: 'app-order-advisor',
  standalone: true,
  imports: [NgIf, NgFor, FaIconComponent, ModalDialogComponent ],
  templateUrl: './order-advisor.component.html',
  styleUrl: './order-advisor.component.scss'
})
export class OrderAdvisorComponent implements OnInit {
  
  @Input() bank: Customer_Bank = {
    raw_material_name: '',
    raw_material_quantity_units: '',
    id: 0,
    customer_id: 0,
    raw_material_id: 0,
    quantity: 0,
    remaining_quantity: 0,
    transaction_history: []
  };
  @Input() banks_baby_allocations: Customer_Bank_Baby_Allocation[] = [];
  @Input() babies: Customer_Baby[] = [];
  @ViewChild("advisor_dialog") advisor_dialog!: ModalDialogComponent;
  calculating: boolean = false;
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

  constructor(
    private wingsSerice: WingsService, 
    private hatsCalculatorService: HatsCalculatorService,
    private router: Router) 
  {  }
  /*
  editedObject: any;
  onOpen(): void {
  }

  beforeClose(): Boolean {
    return true;
  }

  close: EventEmitter<any> = new EventEmitter();
  */
  ngOnInit(): void {
    //this.hatsCalculatorService.aggregateHatBabiesAndMatchingAllocations
    this.calculating = true;
    this.calculate().then((data: OrderAdvisorWingOverall) => {
      this.calculating = false;
      console.dir(this.suggestions);
    });
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
          width: 0,
          babies: babies
         });
        }
      });
  }

  calculate(numOfWingsPerHat:number=44) : Promise<OrderAdvisorWingOverall> {
    return new Promise((resolve, reject) => {
      // Perform asynchronous operation
      // If operation is successful, call resolve()
      // If operation fails, call reject()
      this.wingsSerice.getAllNonCustomerWingsAndBabies().subscribe({
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
          
          //Go over the customer's allocations and babies, and see which wings can be made from them
          this.banks_baby_allocations.forEach((allocation: Customer_Bank_Baby_Allocation) => {
            this.suggestions.wall_allocation_id = allocation.id;
            this.suggestions.crown_allocation_id = allocation.id;
            let allocation_babies = this.babies.filter(b => b.customer_banks_babies_id == allocation.id);
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

                let reduceTop = 0, reduceCrown = 0;

                //the wing as it is
                this.calculateHatInfoForWing(
                  systemWing,
                  0, //reduce top
                  0, //reduce crown
                  allocation,         //wall
                  allocation_babies,  //wall

                  allocation,         //crown
                  allocation_babies,  //crown
                  numOfWingsPerHat
                );

                //reduce crown by 0.5
                this.calculateHatInfoForWing(
                  systemWing,
                  0, //reduce top
                  0.5, //reduce crown
                  allocation,         //wall
                  allocation_babies,  //wall

                  allocation,         //crown
                  allocation_babies,  //crown
                  numOfWingsPerHat
                );

                //reduce crown by 1
                this.calculateHatInfoForWing(
                  systemWing,
                  0, //reduce top
                  1, //reduce crown
                  allocation,         //wall
                  allocation_babies,  //wall

                  allocation,         //crown
                  allocation_babies,  //crown
                  numOfWingsPerHat
                );

                //reduce top by 0.5
                this.calculateHatInfoForWing(
                  systemWing,
                  0.5, //reduce top
                  0, //reduce crown
                  allocation,         //wall
                  allocation_babies,  //wall

                  allocation,         //crown
                  allocation_babies,  //crown
                  numOfWingsPerHat
                );

                //reduce top by 0.5, crown by 0.5
                this.calculateHatInfoForWing(
                  systemWing,
                  0.5, //reduce top
                  0.5, //reduce crown
                  allocation,         //wall
                  allocation_babies,  //wall

                  allocation,         //crown
                  allocation_babies,  //crown
                  numOfWingsPerHat
                );

                //reduce top by 0.5, crown by 1
                this.calculateHatInfoForWing(
                  systemWing,
                  0.5, //reduce top
                  1, //reduce crown
                  allocation,         //wall
                  allocation_babies,  //wall

                  allocation,         //crown
                  allocation_babies,  //crown
                  numOfWingsPerHat
                );

                //reduce top by 1, crown by 0
                this.calculateHatInfoForWing(
                  systemWing,
                  1, //reduce top
                  0, //reduce crown
                  allocation,         //wall
                  allocation_babies,  //wall

                  allocation,         //crown
                  allocation_babies,  //crown
                  numOfWingsPerHat
                );

                //reduce top by 1, crown by 0.5
                this.calculateHatInfoForWing(
                  systemWing,
                  1, //reduce top
                  0.5, //reduce crown
                  allocation,         //wall
                  allocation_babies,  //wall

                  allocation,         //crown
                  allocation_babies,  //crown
                  numOfWingsPerHat
                );

                //reduce top by 1, crown by 1
                this.calculateHatInfoForWing(
                  systemWing,
                  1, //reduce top
                  1, //reduce crown
                  allocation,         //wall
                  allocation_babies,  //wall

                  allocation,         //crown
                  allocation_babies,  //crown
                  numOfWingsPerHat
                );

              });
            });

            this.suggestions.wing_suggestions.sort((wing_a, wing_b) => wing_b.max_num_of_hats - wing_a.max_num_of_hats);
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
      wallAllocationBabies: Customer_Baby[],
      crownAllocation: Customer_Bank_Baby_Allocation,
      crownAllocationBabies: Customer_Baby[],
      wingsPerHat: number
    ){
      let adjustedWing: Wing | null = wing;
      if(reduceTop > 0 || reduceCrown > 0){
        adjustedWing = this.hatsCalculatorService.adjustWingToShortenedTCrownOrTop(wing, reduceTop, reduceCrown);
      }
      let hats_info = this.hatsCalculatorService.aggregateHatBabiesAndMatchingAllocations(
        adjustedWing,
        wallAllocation, crownAllocation,               //same allocation for crown and wall
        wallAllocationBabies, crownAllocationBabies, //same babies for crown and wall
        wingsPerHat, -1);

      if(hats_info.total_num_of_possible_hats > 0) {
        //console.log("For wing " + wing.name + "(alloc(w) #" + wallAllocation.id + ", alloc(c) #" + crownAllocation.id + ", top: -"+ reduceTop + ", crown: -" + reduceCrown + "):" +  hats_info.total_num_of_possible_hats + " hats");
        
        //if there no is a suggestion for this wing, create one
        let wing_suggestion = this.suggestions.wing_suggestions.find(w => w.wing_id == wing.id);
        if(!wing_suggestion){
          wing_suggestion = {
            wing_id: wing.id,
            wing_name: wing.name,
            num_of_wings_per_hat: wingsPerHat,
            max_num_of_hats: Math.max(hats_info.total_num_of_possible_hats, this.suggestions.max_num_of_hats),
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

        if(hats_info.total_num_of_possible_hats > this.suggestions.max_num_of_hats){
          this.suggestions.max_num_of_hats = hats_info.total_num_of_possible_hats;
          this.suggestions.max_hat_wing_id = wing.id;
          this.suggestions.max_hat_wing_name = wing.name;
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
      this.router.navigate(['/inventory/customer/hat-calculator'], { 
        queryParams: { 
          wing_id: wing_id,
          w_mat: this.bank.raw_material_name,
          c_mat: this.bank.raw_material_name,
          w_aloc: wall_allocation_id,
          c_aloc: crown_allocation_id,
          s_t: shorten_top,
          s_c: shorten_crown
        }, 
        queryParamsHandling:'merge'
      });
    }
}
