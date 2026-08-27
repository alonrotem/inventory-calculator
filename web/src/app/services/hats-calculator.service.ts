import { Injectable } from '@angular/core';
import { Allocation_Baby, Customer_Bank_Baby_Allocation, Wing, WingBaby } from '../../types';
import { ta } from 'date-fns/locale';

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
  tails_used_l: number,
  tails_remaining_l: number,
  tails_overdraft_l: number,
  tails_used_r: number,
  tails_remaining_r: number,
  tails_overdraft_r: number,
  max_num_of_hats_with_tails: number,
  crown_babies: aggregated_babies[]
}

export interface summed_babies {
  length: number;
  quantity: number;
}

@Injectable({
  providedIn: 'root'
})
export class HatsCalculatorService {

  constructor() { }

  getMaxNumberOfWingsInAllocations(
    wing: Wing | null,
    wall_alocation_babies: Allocation_Baby[],
    crown_allocation_babies: Allocation_Baby[],
    tails_allocation: Customer_Bank_Baby_Allocation | null,
    allocations_are_different: boolean){
      console.log("get max num of hats...");
    let max_num_of_wings_with_given_allocations = Infinity;
    let wall_babies_to_build_one_wing: summed_babies[] = [];
    let crown_babies_to_build_one_wing: summed_babies[] = [];
    if(wing){
      wing.babies.forEach((wingBaby: WingBaby) => {
        let current_aggregation = ((allocations_are_different) && (wingBaby.position.startsWith("C"))) ? crown_babies_to_build_one_wing : wall_babies_to_build_one_wing;
        
        let baby_with_this_length = current_aggregation.find (b => b.length == wingBaby.length);
        
        if(baby_with_this_length){
          baby_with_this_length.quantity ++;
        }
        else {
          current_aggregation.push({
            length: wingBaby.length,
            quantity: 1
          })
        }
      });
      
      wall_babies_to_build_one_wing.forEach((baby_in_wing: summed_babies) => {
        let babies_of_this_length_needed_for_one_wing = baby_in_wing.quantity;
        let babies_of_this_length_in_allocation = wall_alocation_babies.find(alloc_baby =>  alloc_baby.length == baby_in_wing.length);
        if(babies_of_this_length_in_allocation && babies_of_this_length_in_allocation.quantity){
          let you_can_make_wings_with_this_alloc = Math.floor(babies_of_this_length_in_allocation.quantity / babies_of_this_length_needed_for_one_wing);
          max_num_of_wings_with_given_allocations = Math.min(max_num_of_wings_with_given_allocations, you_can_make_wings_with_this_alloc);
        }
        else {
          max_num_of_wings_with_given_allocations = 0;
        }
      });

      if(allocations_are_different){
        crown_babies_to_build_one_wing.forEach((baby_in_wing: summed_babies) => {
          let babies_of_this_length_needed_for_one_wing = baby_in_wing.quantity;
          let babies_of_this_length_in_allocation = crown_allocation_babies.find(alloc_baby => 
            alloc_baby.length == baby_in_wing.length
          );
          if(babies_of_this_length_in_allocation && babies_of_this_length_in_allocation.quantity){
            let you_can_make_wings_with_this_alloc = Math.floor(babies_of_this_length_in_allocation.quantity / babies_of_this_length_needed_for_one_wing);
            max_num_of_wings_with_given_allocations = Math.min(max_num_of_wings_with_given_allocations, you_can_make_wings_with_this_alloc);
          }
          else {
            max_num_of_wings_with_given_allocations = 0;
          }
        });        
      }
    }
    if(tails_allocation){
      max_num_of_wings_with_given_allocations = Math.min(tails_allocation.tails_quantity, max_num_of_wings_with_given_allocations);
    }

    console.log("returning: ", max_num_of_wings_with_given_allocations);
    return max_num_of_wings_with_given_allocations;
  }


  //this function analyzes the hat and its wings, aggregates the wing's positions babies by length, 
  //and sees how many matched babies the customer has in the allocation, and how many hats can be made.
  aggregateHatBabiesAndMatchingAllocations(
    wing: Wing | null, 
    wall_alocation: Customer_Bank_Baby_Allocation | null, 
    crown_allocation: Customer_Bank_Baby_Allocation | null,
    tails_allocation_l: Customer_Bank_Baby_Allocation | null,
    tails_allocation_r: Customer_Bank_Baby_Allocation | null,
    wall_alocation_babies: Allocation_Baby[],
    crown_allocation_babies: Allocation_Baby[],
    wing_quantity_in_hat: number,
    num_of_hats_to_order: number = -1,
    is_tentative_calculation: boolean,
    is_hat_material_different_than_crown: boolean) {

    let hats: hats_calculated = {
      total_num_of_possible_hats: Infinity,
      hat_babies: [],
      crown_babies: [],
      max_num_of_hats_with_tails: 0,
      tails_used_l: 0,
      tails_remaining_l: 0,
      tails_overdraft_l: 0,
      tails_used_r: 0,
      tails_remaining_r: 0,
      tails_overdraft_r: 0
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
            if(crown_allocation?.id != wall_alocation?.id || is_hat_material_different_than_crown) {
              hats.total_num_of_possible_hats = this.append_to_babies_collection(hats.crown_babies, wingBaby, crown_allocation_babies, wing_quantity_in_hat, wing.split_l1, hats.total_num_of_possible_hats, is_tentative_calculation);
              appended = true;
            }
            else {
              hats.total_num_of_possible_hats = this.append_to_babies_collection(hats.hat_babies, wingBaby, wall_alocation_babies, wing_quantity_in_hat, wing.split_l1, hats.total_num_of_possible_hats, is_tentative_calculation);
              appended = true;
            }
          }
        }
        if(!appended) {
          hats.total_num_of_possible_hats = this.append_to_babies_collection(hats.hat_babies, wingBaby, wall_alocation_babies, wing_quantity_in_hat, wing.split_l1, hats.total_num_of_possible_hats, is_tentative_calculation);
        }
      });
    }
    //after scanning and appending all, we have the max number of hats possible.
    //now it's possible to calculate for each baby length how many will be left for this number of hats.
    //The remaining is calculated by the order, which should not exceed the number of possible hats.
    if(num_of_hats_to_order <= 0 || num_of_hats_to_order > hats.total_num_of_possible_hats) {
      console.log("=-=- updating to Math.min(10, ", hats.total_num_of_possible_hats ,") = ", Math.min(10, hats.total_num_of_possible_hats))
      num_of_hats_to_order = Math.min(10, hats.total_num_of_possible_hats);
    }

    hats.hat_babies.forEach(b => {
      b.remaining = b.quantity_in_allocation - (num_of_hats_to_order * b.quantity);
    });
    hats.crown_babies.forEach(b => {
      b.remaining = b.quantity_in_allocation - (num_of_hats_to_order * b.quantity);
    });      
    hats.hat_babies.sort((a,b) => {return b.length - a.length});
    hats.crown_babies.sort((a,b) => {return b.length - a.length});

    //check how many tails (== num of wings in total) we can produce
    const allow_overdraft_of_tails = true; //maybe configurable in the future
    // Now calculating half-tails for each HL/HR.
    /*
    assume 5 wings per hat

    if l and r are the same allocation, count the tails by 1 * wing_quantity
    if they are different, they should be calcualted separately, and the max number of hats is the minimum between them

    30 tails in allocation

    */
    //if l and r are the same allocation, count the tails by 1 * wing_quantity
    if(tails_allocation_l && tails_allocation_r && tails_allocation_l.id == tails_allocation_r.id) {
      if(!allow_overdraft_of_tails){
        hats.max_num_of_hats_with_tails = Math.floor(tails_allocation_l.tails_quantity / wing_quantity_in_hat);
        hats.total_num_of_possible_hats = Math.min(hats.total_num_of_possible_hats, hats.max_num_of_hats_with_tails);
        hats.max_num_of_hats_with_tails = hats.total_num_of_possible_hats;
        hats.tails_used_l = hats.max_num_of_hats_with_tails * wing_quantity_in_hat;
        hats.tails_remaining_l = tails_allocation_l.tails_quantity - hats.tails_used_l;
      }
      else {
        //overdraft is allowed, the number of tails in the allocation does not affect the number of hats,
        //but customer can be overdrafting tails for later.
        let wings_in_all_hats = wing_quantity_in_hat * hats.total_num_of_possible_hats;
        if(tails_allocation_l.tails_quantity >= wings_in_all_hats){
          hats.tails_used_l = wings_in_all_hats;
          hats.tails_remaining_l = tails_allocation_l.tails_quantity - wings_in_all_hats;
          hats.tails_overdraft_l = 0;
        }
        else {
          hats.tails_used_l = tails_allocation_l.tails_quantity;
          hats.tails_remaining_l = 0;
          hats.tails_overdraft_l = wings_in_all_hats - tails_allocation_l.tails_quantity;
        }
      }
    }

    // count tails for each allocation separately, and the max number of hats is the minimum between them
    else {
      if(tails_allocation_l) {
        if(!allow_overdraft_of_tails){
          hats.max_num_of_hats_with_tails = Math.floor(tails_allocation_l.tails_quantity / (wing_quantity_in_hat / 2));
          hats.total_num_of_possible_hats = Math.min(hats.total_num_of_possible_hats, hats.max_num_of_hats_with_tails);
          hats.max_num_of_hats_with_tails = hats.total_num_of_possible_hats;
          hats.tails_used_l = hats.max_num_of_hats_with_tails * (wing_quantity_in_hat /2);
          hats.tails_remaining_l = tails_allocation_l.tails_quantity - hats.tails_used_l;
        }
        else {
          //overdraft is allowed, the number of tails in the allocation does not affect the number of hats,
          //but customer can be overdrafting tails for later.
          let wings_in_all_hats = wing_quantity_in_hat * num_of_hats_to_order;//hats.total_num_of_possible_hats;
          if(tails_allocation_l.tails_quantity >= (wings_in_all_hats /2)){
            hats.tails_used_l = (wings_in_all_hats /2);
            hats.tails_remaining_l = tails_allocation_l.tails_quantity - (wings_in_all_hats /2);
            hats.tails_overdraft_l = 0;
          }
          else {
            hats.tails_used_l = tails_allocation_l.tails_quantity;
            hats.tails_remaining_l = 0;
            hats.tails_overdraft_l = (wings_in_all_hats /2) - tails_allocation_l.tails_quantity;
          }
        }
      }

      if(tails_allocation_r ) {
        if(!allow_overdraft_of_tails){
          hats.max_num_of_hats_with_tails = Math.floor(tails_allocation_r .tails_quantity / (wing_quantity_in_hat / 2));
          hats.total_num_of_possible_hats = Math.min(hats.total_num_of_possible_hats, hats.max_num_of_hats_with_tails);
          hats.max_num_of_hats_with_tails = hats.total_num_of_possible_hats;
          hats.tails_used_r  = hats.max_num_of_hats_with_tails * (wing_quantity_in_hat /2);
          hats.tails_remaining_r  = tails_allocation_r .tails_quantity - hats.tails_used_r ;
        }
        else {
          //overdraft is allowed, the number of tails in the allocation does not affect the number of hats,
          //but customer can be overdrafting tails for later.
          let wings_in_all_hats = wing_quantity_in_hat * num_of_hats_to_order;//hats.total_num_of_possible_hats;
          if(tails_allocation_r .tails_quantity >= (wings_in_all_hats /2)){
            hats.tails_used_r  = (wings_in_all_hats /2);
            hats.tails_remaining_r  = tails_allocation_r .tails_quantity - (wings_in_all_hats /2);
            hats.tails_overdraft_r  = 0;
          }
          else {
            hats.tails_used_r  = tails_allocation_r .tails_quantity;
            hats.tails_remaining_r  = 0;
            hats.tails_overdraft_r  = (wings_in_all_hats /2) - tails_allocation_r .tails_quantity;
          }
        }
      }      
    }

    // console.log("Wing: ", wing?.name,  ", hats calculated:", hats.total_num_of_possible_hats);
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
  adjustWingToShortenedTCrownOrTop(wing: Wing | null, reduce_top_by: number, reduce_crown_by: number, allow_shortening_babies_in_pairs: boolean): Wing | null {
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

        this.shorten_babies_according_to_top(modified_wing, sorted_L, top, reduce_top_by, allow_shortening_babies_in_pairs);
        this.shorten_babies_according_to_top(modified_wing, sorted_R, top, reduce_top_by, allow_shortening_babies_in_pairs);
      }

      //shorten crown
      if(reduce_crown_by > 0){
        let crowns = modified_wing.babies.filter((b: WingBaby) => b && b.position && b.position.toUpperCase().startsWith("C"));
        if(crowns){
          crowns.forEach((crown_baby: WingBaby) => {
            crown_baby.length = crown_baby.length - reduce_crown_by;
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
    split_l1: number,
    cur_max_hats: number,
    is_tentative_calculation: boolean)
  {
    let append_to_item = babies_collection.find(baby => baby.length == wingBaby.length);
    let baby_in_allocation_with_length = alocation_babies.find(b => b.length == wingBaby.length);
    let allocation_quantity = (is_tentative_calculation)? 9999999 : ((baby_in_allocation_with_length)? baby_in_allocation_with_length.quantity : 0);
    let position = wingBaby.position + ((wingBaby.position=="L1" && split_l1 > 1)? ("x" + split_l1) : "");

    if(append_to_item){
      let positions = append_to_item.position.split(", ");
      if(positions.indexOf(position) < 0){
        positions.push(position);
      }
      append_to_item.quantity += (wingBaby.position=="L1") ? (wing_quantity * split_l1) : wing_quantity;
      append_to_item.position = positions.join(", ");
      append_to_item.possible_num_of_hats = -1;
      append_to_item.remaining = 0;
    }
    else {
      append_to_item = {
        length: wingBaby.length,
        quantity: (wingBaby.position=="L1") ? (wing_quantity * split_l1) : wing_quantity,
        position: position,
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
  private shorten_babies_according_to_top(wing: Wing | null, sorted_babies_collection: WingBaby[] | null, top: WingBaby | undefined, reduce_top_by: number, allow_shortening_babies_in_pairs: boolean){
    const mininal_baby_length = 6;
    let previous_baby_in_line = top;
    if(allow_shortening_babies_in_pairs){
    let allow_group_similar_babies = 1;
    let max_items_in_similar_length_group = 2;
    sorted_babies_collection?.forEach(unchanged_baby => {
      let display_baby = wing?.babies.find(b => b.position.toUpperCase() == unchanged_baby.position.toUpperCase());
      if(display_baby && previous_baby_in_line && previous_baby_in_line?.length) {
        // if the display_baby is longer than the previous_baby_in_line, shorten it (min 6cm)
        // if the display_baby is shorter or equel to the previous_baby_in_line, do nothing

        //if previous_baby_in_line == top
        //shorten the baby, as needed. <- counter 1
        if(previous_baby_in_line == top){
          if(unchanged_baby.length  - reduce_top_by == previous_baby_in_line.length){
            display_baby.length -= reduce_top_by;

          }
          else {
            let corrected_length = previous_baby_in_line.length - 0.5;
            display_baby.length = Math.max(corrected_length, mininal_baby_length);
          }
        }

        //check next baby <- counter 1
        //grouped? (counter < 2)
        //allow to be equal
        //counter++
        else {
          if(allow_group_similar_babies < max_items_in_similar_length_group){
            //allow to be equal
            display_baby.length = previous_baby_in_line.length;
            /*
            if(unchanged_baby.length > previous_baby_in_line.length){
              let corrected_length = previous_baby_in_line.length - 0.5;
              display_baby.length = Math.max(corrected_length, 6);
            }
            else if(unchanged_baby.length == previous_baby_in_line.length){
              //allow it
            }
            */
            allow_group_similar_babies++;
          }

          //check next baby <- counter 2
          //grouped? (counter < 2) <- no
          //counter = 1
          //do not allow to be equal
          else {
            if(unchanged_baby.length >= previous_baby_in_line.length){
              let corrected_length = previous_baby_in_line.length - 0.5;
              display_baby.length = Math.max(corrected_length, mininal_baby_length);
            }            
            allow_group_similar_babies = 1;
          }
        }



      }
      previous_baby_in_line = display_baby;
    });
  }
  else {

    let previous_baby_in_line = top;
    sorted_babies_collection?.forEach(unchanged_baby => {
      let display_baby = wing?.babies.find(b => b.position.toUpperCase() == unchanged_baby.position.toUpperCase());
      if(display_baby) {
        // if the display_baby is longer than the previous_baby_in_line, shorten it (min 5cm)
        // if the display_baby is shorter or equel to the previous_baby_in_line, do nothing

        if((previous_baby_in_line) && (unchanged_baby.length >= previous_baby_in_line?.length)){  
            let corrected_length = previous_baby_in_line.length - 0.5;
            display_baby.length = Math.max(corrected_length, mininal_baby_length);
        }
        else {
          display_baby.length = unchanged_baby.length;
        }
      }
      previous_baby_in_line = display_baby;
    });
  }
  }
}