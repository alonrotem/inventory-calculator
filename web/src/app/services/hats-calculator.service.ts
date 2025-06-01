import { Injectable } from '@angular/core';
import { Allocation_Baby, Customer_Bank_Baby_Allocation, Wing, WingBaby } from '../../types';

export interface aggregated_babies { 
  length: number; 
  quantity: number; 
  position: string, 
  quantity_in_allocation: number,
  possible_num_of_hats: number,
  remaining: number
};

export interface hats_calculated {
  total_num_of_possible_hats: number,
  hat_babies: aggregated_babies[],
  crown_babies: aggregated_babies[]
}

@Injectable({
  providedIn: 'root'
})
export class HatsCalculatorService {

  constructor() { }

  //this function analyzes the hat and its wings, aggregates the wing's positions babies by length, 
  //and sees how many matched babies the customer has in the allocation, and how many hats can be made.
  aggregateHatBabiesAndMatchingAllocations(
    wing: Wing | null, 
    wall_alocation: Customer_Bank_Baby_Allocation | null, 
    crown_allocation: Customer_Bank_Baby_Allocation | null,
    wall_alocation_babies: Allocation_Baby[],
    crown_allocation_babies: Allocation_Baby[],
    wing_quantity_in_hat: number,
    num_of_hats_to_order: number = -1) {

    let hats: hats_calculated = {
      total_num_of_possible_hats: Infinity,
      hat_babies: [],
      crown_babies: []
    };

    hats.total_num_of_possible_hats = Infinity;
    hats.hat_babies = [];
    hats.crown_babies = [];

    if(wing){
      wing.babies.forEach((wingBaby: WingBaby) => {
        let appended = false;
        if(wingBaby && wingBaby.position) {
          if(wingBaby.position.startsWith("C")){
            //keep crown babies separate
            if(crown_allocation?.id != wall_alocation?.id) {
              hats.total_num_of_possible_hats = this.append_to_babies_collection(hats.crown_babies, wingBaby, crown_allocation_babies, wing_quantity_in_hat, hats.total_num_of_possible_hats);
              appended = true;
            }
            else {
              hats.total_num_of_possible_hats = this.append_to_babies_collection(hats.hat_babies, wingBaby, wall_alocation_babies, wing_quantity_in_hat, hats.total_num_of_possible_hats);
              appended = true;
            }
          }
        }
        if(!appended) {
          hats.total_num_of_possible_hats = this.append_to_babies_collection(hats.hat_babies, wingBaby, wall_alocation_babies, wing_quantity_in_hat, hats.total_num_of_possible_hats);
        }
      });
    }
    //after scanning and appending all, we have the max number of hats possible.
    //now it's possible to calculate for each baby length how many will be left for this number of hats.
    //The remaining is calculated by the order, which should not exceed the number of possible hats.
    if(num_of_hats_to_order <= 0 || num_of_hats_to_order > hats.total_num_of_possible_hats) {
      num_of_hats_to_order = hats.total_num_of_possible_hats;
    }

    hats.hat_babies.forEach(b => {
      b.remaining = b.quantity_in_allocation - (num_of_hats_to_order * b.quantity);
    });
    hats.crown_babies.forEach(b => {
      b.remaining = b.quantity_in_allocation - (num_of_hats_to_order * b.quantity);
    });      
    hats.hat_babies.sort((a,b) => {return b.length - a.length});
    hats.crown_babies.sort((a,b) => {return b.length - a.length});

    return hats;
  }

  // 9 options
  // reduce crown by  | reduce top by
  //      0.0         |       0.0
  //      0.5         |       0.0
  //      1.0         |       0.0
  //      0.0         |       0.5
  //      0.5         |       0.5
  //      1.0         |       0.5
  //      0.0         |       1.0
  //      0.5         |       1.0
  //      1.0         |       1.0
  adjustWingToShortenedTCrownOrTop(wing: Wing | null, reduce_top_by: number, reduce_crown_by: number): Wing | null {
    if(wing){
      let modified_wing = (JSON.parse(JSON.stringify(wing)));
      //shorten top
      if(reduce_top_by > 0){
        let top: WingBaby = modified_wing.babies.find((b: WingBaby) => b && b.position && b.position.toUpperCase() == "TOP");
        if(top){
          top.length = top.length - reduce_top_by;
        }
        //adjust other babies as needed, to keep the top higher by at least 0.5 cm
        let sorted_L = this.get_sorted_wing_babies_by_position(modified_wing, "L");
        let sorted_R = this.get_sorted_wing_babies_by_position(modified_wing, "R");

        this.shorten_babies_according_to_top(modified_wing, sorted_L, top);
        this.shorten_babies_according_to_top(modified_wing, sorted_R, top);
      }

      //shorten crown
      if(reduce_crown_by > 0){
        let crowns = modified_wing.babies.filter((b: WingBaby) => b && b.position && b.position.toUpperCase().startsWith("C"));
        if(crowns){
          crowns.forEach((crown_baby: WingBaby) => {
            crown_baby.length = crowns[0].length - reduce_crown_by;
          });
        }
      }

      return modified_wing;
    }
    else {
      return null;
    } 
  }

  //returns the wing babies of a specific position (L, R) sorted by position, descending
  //(e.g. L4, L3, L2, L1)
  private get_sorted_wing_babies_by_position(wing: Wing | null, base_pos: string) {
    if(!wing){
      return null;
    }
    return wing?.babies.filter(b => b && b.position && b.position.toUpperCase().startsWith(base_pos)).sort((x,y) => {
      let rx=/[^0-9]*([0-9]*)/;
      let x_num = parseInt(rx.exec(x.position)![1]);
      let y_num = parseInt(rx.exec(y.position)![1]);
      return y_num - x_num;
    });
  }


  //this function collects babies from the wing, grouping them by location, 
  //and checking how many matching babies' lengths the customer has in their allocation
  private append_to_babies_collection(
    babies_collection: aggregated_babies[], //collection to append the baby to
    wingBaby: WingBaby,                     //the baby to append
    alocation_babies: Allocation_Baby[],      //the allocation of the baby (for quantity)
    wing_quantity: number,
    cur_max_hats: number)
  {
    let append_to_item = babies_collection.find(baby => baby.length == wingBaby.length);
    let baby_in_allocation_with_length = alocation_babies.find(b => b.length == wingBaby.length);
    let allocation_quantity = (baby_in_allocation_with_length)? baby_in_allocation_with_length.quantity : 0;

    if(append_to_item){
      let positions = append_to_item.position.split(", ");
      if(positions.indexOf(wingBaby.position) < 0){
        positions.push(wingBaby.position);
      }
      append_to_item.quantity += wing_quantity;
      append_to_item.position = positions.join(", ");
      append_to_item.possible_num_of_hats = -1;
      append_to_item.remaining = 0;
    }
    else {
      append_to_item = {
        length: wingBaby.length,
        quantity: wing_quantity,
        position: wingBaby.position,
        quantity_in_allocation: allocation_quantity,
        possible_num_of_hats: -1,
        remaining: 0
        //(baby_in_allocation_with_length)? (baby_in_allocation_with_length.quantity - allocation_quantity) : 0
      };
      babies_collection.push(append_to_item);
    }
    let how_many_hats = Math.floor((append_to_item.quantity)? (allocation_quantity/append_to_item.quantity) : 0);
    if(how_many_hats < cur_max_hats) {
      //if the total number of hats has already been found, but we found a lower value of it
      //or if the number of hats has dropped to 0
      //this will be highlighted in the table, showing the lowest hat baby allocation
      if(cur_max_hats < Infinity || how_many_hats == 0) {
        //this.highlight_lowest_number_in_table = true;
      }
      cur_max_hats = how_many_hats;
    }
    append_to_item.possible_num_of_hats = how_many_hats;
    return cur_max_hats;
  }

  // - If there were manual changes made, they will be lost, in case the top has to shorten other babies
  private shorten_babies_according_to_top(wing: Wing | null, sorted_babies_collection: WingBaby[] | null, top: WingBaby | undefined){
    let previous_baby_in_line = top;
    sorted_babies_collection?.forEach(unchanged_baby => {
      let display_baby = wing?.babies.find(b => b.position.toUpperCase() == unchanged_baby.position.toUpperCase());
      if(display_baby) {
        // if the display_baby is longer than the previous_baby_in_line, shorten it (min 5cm)
        // if the display_baby is shorter or equel to the previous_baby_in_line, do nothing

        if((previous_baby_in_line) && (unchanged_baby.length >= previous_baby_in_line?.length)){  
            let corrected_length = previous_baby_in_line.length - 0.5;
            display_baby.length = Math.max(corrected_length, 5);
        }
        else {
          display_baby.length = unchanged_baby.length;
        }
      }
      previous_baby_in_line = display_baby;
    });
  }
}