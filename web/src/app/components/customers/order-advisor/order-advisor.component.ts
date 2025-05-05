import { Component, Input, OnInit } from '@angular/core';
import { WingsService } from '../../../services/wings.service';
import { HatsCalculatorService } from '../../../services/hats-calculator.service';
import { Customer_Baby, Customer_Bank_Baby_Allocation, Wing, WingBaby, WingCalculationItem } from '../../../../types';
import { withEnabledBlockingInitialNavigation } from '@angular/router';

@Component({
  selector: 'app-order-advisor',
  standalone: true,
  imports: [],
  templateUrl: './order-advisor.component.html',
  styleUrl: './order-advisor.component.scss'
})
export class OrderAdvisorComponent implements OnInit {
  
  @Input() banks_baby_allocations: Customer_Bank_Baby_Allocation[] = [];
  @Input() babies: Customer_Baby[] = [];
  calculating: boolean = false;
  systemWings: Wing[] = [];

  constructor(
    private wingsSerice: WingsService, 
    private hatsCalculatorService: HatsCalculatorService) 
  {  }

  ngOnInit(): void {
    //this.hatsCalculatorService.aggregateHatBabiesAndMatchingAllocations
    this.calculate().then((data: string) => {
      
    });
  }

  formatWingCalculationItemsAsWings(wingcalcs: WingCalculationItem[]){
    this.systemWings = [];

    let wing_ids = [...new Set( wingcalcs.map(w => w.w_id))];
    wing_ids.forEach((w_id) => {
      let wing = wingcalcs.find(w => w.w_id == w_id);
      if(wing){
        let babies = wingcalcs.filter(b => b.w_id == w_id).map((b):WingBaby => { return {
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

  calculate() : Promise<string> {
    return new Promise((resolve, reject) => {
      // Perform asynchronous operation
      // If operation is successful, call resolve()
      // If operation fails, call reject()
      this.wingsSerice.getAllNonCustomerWingsAndBabies().subscribe({
        next: (wingcalcs: WingCalculationItem[]) => {
          this.formatWingCalculationItemsAsWings(wingcalcs);
          //console.dir(this.systemWings);
          this.banks_baby_allocations.forEach((allocation: Customer_Bank_Baby_Allocation) => {
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

                  //the wing as it is
                  let hats_info = this.hatsCalculatorService.aggregateHatBabiesAndMatchingAllocations(
                    systemWing,
                    allocation, allocation,               //same allocation for crown and wall
                    allocation_babies, allocation_babies, //same babies for crown and wall
                    44, -1);

                  if(hats_info.total_num_of_possible_hats > 0)
                    console.log("For wing " + systemWing.name + "(alloc #" + allocation.id + "):" +  hats_info.total_num_of_possible_hats + " hats");
                  
                  //reduce crown by 0.5
                  let wing_top_00_crown_05 = this.hatsCalculatorService.adjustWingToShortenedTCrownOrTop(systemWing, 0, 0.5);
                  let hats_info1 = this.hatsCalculatorService.aggregateHatBabiesAndMatchingAllocations(
                    wing_top_00_crown_05,
                    allocation, allocation,               //same allocation for crown and wall
                    allocation_babies, allocation_babies, //same babies for crown and wall
                    44, -1);

                  if(hats_info1.total_num_of_possible_hats > 0)
                    console.log("For wing " + systemWing.name + "(alloc #" + allocation.id + ", crown: -0.5):" +  hats_info1.total_num_of_possible_hats + " hats");

                  //reduce crown by 1
                  let wing_top_00_crown_1 = this.hatsCalculatorService.adjustWingToShortenedTCrownOrTop(systemWing, 0, 1);
                  let hats_info2 = this.hatsCalculatorService.aggregateHatBabiesAndMatchingAllocations(
                    wing_top_00_crown_1,
                    allocation, allocation,               //same allocation for crown and wall
                    allocation_babies, allocation_babies, //same babies for crown and wall
                    44, -1);

                  if(hats_info2.total_num_of_possible_hats > 0)
                    console.log("For wing " + systemWing.name + "(alloc #" + allocation.id + ", crown: -1.0):" +  hats_info2.total_num_of_possible_hats + " hats");


                  //reduce top by 0.5
                  let wing_top_05_crown_00 = this.hatsCalculatorService.adjustWingToShortenedTCrownOrTop(systemWing, 0.5, 0);
                  let hats_info3 = this.hatsCalculatorService.aggregateHatBabiesAndMatchingAllocations(
                    wing_top_05_crown_00,
                    allocation, allocation,               //same allocation for crown and wall
                    allocation_babies, allocation_babies, //same babies for crown and wall
                    44, -1);

                  if(hats_info3.total_num_of_possible_hats > 0)
                    console.log("For wing " + systemWing.name + "(alloc #" + allocation.id + ", top: -0.5):" +  hats_info3.total_num_of_possible_hats + " hats");

                  //reduce top by 0.5, crown by 0.5
                  let wing_top_05_crown_05 = this.hatsCalculatorService.adjustWingToShortenedTCrownOrTop(systemWing, 0.5, 0.5);
                  let hats_info4 = this.hatsCalculatorService.aggregateHatBabiesAndMatchingAllocations(
                    wing_top_05_crown_05,
                    allocation, allocation,               //same allocation for crown and wall
                    allocation_babies, allocation_babies, //same babies for crown and wall
                    44, -1);

                  if(hats_info4.total_num_of_possible_hats > 0)
                    console.log("For wing " + systemWing.name + "(alloc #" + allocation.id + ", top: -0.5, crown: -0.5):" +  hats_info4.total_num_of_possible_hats + " hats");

                  //reduce top by 0.5, crown by 1
                  let wing_top_05_crown_1 = this.hatsCalculatorService.adjustWingToShortenedTCrownOrTop(systemWing, 0.5, 1);
                  let hats_info5 = this.hatsCalculatorService.aggregateHatBabiesAndMatchingAllocations(
                    wing_top_05_crown_1,
                    allocation, allocation,               //same allocation for crown and wall
                    allocation_babies, allocation_babies, //same babies for crown and wall
                    44, -1);

                  if(hats_info5.total_num_of_possible_hats > 0)
                    console.log("For wing " + systemWing.name + "(alloc #" + allocation.id + ", top: -0.5, crown: -1.0):" +  hats_info5.total_num_of_possible_hats + " hats");


                  //reduce top by 1, crown by 0
                  let wing_top_1_crown_0 = this.hatsCalculatorService.adjustWingToShortenedTCrownOrTop(systemWing, 1, 0);
                  let hats_info6 = this.hatsCalculatorService.aggregateHatBabiesAndMatchingAllocations(
                    wing_top_1_crown_0,
                    allocation, allocation,               //same allocation for crown and wall
                    allocation_babies, allocation_babies, //same babies for crown and wall
                    44, -1);

                  if(hats_info6.total_num_of_possible_hats > 0)
                    console.log("For wing " + systemWing.name + "(alloc #" + allocation.id + ", top: -1.0):" +  hats_info6.total_num_of_possible_hats + " hats");
                  
                  //reduce top by 1, crown by 0.5
                  let wing_top_1_crown_05 = this.hatsCalculatorService.adjustWingToShortenedTCrownOrTop(systemWing, 1, 0.5);
                  let hats_info7 = this.hatsCalculatorService.aggregateHatBabiesAndMatchingAllocations(
                    wing_top_1_crown_05,
                    allocation, allocation,               //same allocation for crown and wall
                    allocation_babies, allocation_babies, //same babies for crown and wall
                    44, -1);

                  if(hats_info7.total_num_of_possible_hats > 0)
                    console.log("For wing " + systemWing.name + "(alloc #" + allocation.id + ", top: -1.0, crown: -0.5):" +  hats_info7.total_num_of_possible_hats + " hats");


                  //reduce top by 1, crown by 0.5
                  let wing_top_1_crown_1 = this.hatsCalculatorService.adjustWingToShortenedTCrownOrTop(systemWing, 1, 1);
                  let hats_info8 = this.hatsCalculatorService.aggregateHatBabiesAndMatchingAllocations(
                    wing_top_1_crown_1,
                    allocation, allocation,               //same allocation for crown and wall
                    allocation_babies, allocation_babies, //same babies for crown and wall
                    44, -1);

                  if(hats_info8.total_num_of_possible_hats > 0)
                    console.log("For wing " + systemWing.name + "(alloc #" + allocation.id + ", top: 1.0, crown: -1.0):" +  hats_info8.total_num_of_possible_hats + " hats");

                  });
                });


                resolve(JSON.stringify(wingcalcs));
              }
            })
          })
        }
              //this.hatsCalculatorService.aggregateHatBabiesAndMatchingAllocations()
              /*
                wing: Wing | null, 
                wall_alocation: Customer_Bank_Baby_Allocation | null, 
                crown_allocation: Customer_Bank_Baby_Allocation | null,
                wall_alocation_babies: Customer_Baby[],
                crown_allocation_babies: Customer_Baby[],
                wing_quantity_in_hat: number,
                num_of_hats_to_order: number = -1
              */

                

            //

}
