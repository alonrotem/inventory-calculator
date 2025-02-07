import { Injectable } from '@angular/core';
import { Customer_Baby, Customer_Bank, Customer_Bank_Baby_Allocation, Hat, Wing, WingBaby } from '../../types';

@Injectable({
  providedIn: 'root'
})
export class HatsCalculatorService {

  constructor() { }

  AlonsHatCalculator (
    hat: Hat,   //hat has HatWing, which points to a specific wing by name
    wing: Wing, //this is the actual wing with its babies (WingBaby),

    customerBanks: Customer_Bank[], //with raw material name
    workAllocations: Customer_Bank_Baby_Allocation[], //work allocation to match the bank
    customerBabies: Customer_Baby[] // the babies in the allocation
  ) : number{
    
    if(!hat || !wing || !customerBanks || !workAllocations || !customerBabies) {
      return 0;
     }

    let maxHats = Infinity;

    //This hat has no wings (basically should be 1)
    if(hat.wings.length == 0) {
      return 0;
    }
    
    //-------- Aggregate the hat babies ----------
    let numOfWingsInHat = hat.wings[0].wing_quantity;

    // Map<length, quantity>
    let hatWallBabies = wing.babies.filter(baby => !baby.position.startsWith("C"));
    let hatCrownBabies = wing.babies.filter(baby => baby.position.startsWith("C"));

    let hatWallBabiesByLength = this.aggregateAllBabiesInHat(hatWallBabies, numOfWingsInHat, false);
    let hatCrownBabiesByLength = this.aggregateAllBabiesInHat(hatCrownBabies, numOfWingsInHat, true);

    //-------- Find the banks with matched materials ----------
    let customerBanksWithWallMaterial = customerBanks.filter(bank => bank.raw_material_name == hat.hat_material).map(bank => bank.id);
    let customerBanksWithCrownMaterial = customerBanks.filter(bank => bank.raw_material_name == hat.crown_material).map(bank => bank.id);

    let allocationsWithWallMaterial = workAllocations.filter(alloc => customerBanksWithWallMaterial.indexOf(alloc.customer_bank_id) >= 0).map(alloc => alloc.id);
    let allocationsWithCrownMaterial = workAllocations.filter(alloc => customerBanksWithCrownMaterial.indexOf(alloc.customer_bank_id) >= 0).map(alloc => alloc.id);

    //count how many walls and how many crowns can be made with those allocations
    //walls
    customerBabies.forEach(allocation_baby => {
      //is this baby part of an allocation with the wall material?
      if(allocationsWithWallMaterial.indexOf(allocation_baby.customer_banks_babies_id) >= 0) {
        //
        if(hatWallBabiesByLength.has(allocation_baby.length)) {
          //how many babies we need with this length?
          let required_babies_with_length = hatWallBabiesByLength.get(allocation_baby.length)?? 0;
          //how many babies do we have with this length?
          let number_of_babies_with_length = allocation_baby.quantity;
          //how many are needed?
          if(number_of_babies_with_length >= required_babies_with_length){
            let numOfTimes = Math.floor(number_of_babies_with_length/required_babies_with_length);
            //this limits the number of hats
            maxHats = Math.min(numOfTimes, maxHats);
          }
          else {
            maxHats = 0;
          }
        }
      }

      //is this baby part of an allocation with the crown material?
      if(allocationsWithCrownMaterial.indexOf(allocation_baby.customer_banks_babies_id) >= 0) {
        //
        if(hatCrownBabiesByLength.has(allocation_baby.length)) {
          //how many babies we need with this length?
          let required_babies_with_length = hatCrownBabiesByLength.get(allocation_baby.length)?? 0;
          //how many babies do we have with this length?
          let number_of_babies_with_length = allocation_baby.quantity;
          //how many are needed?
          if(number_of_babies_with_length >= required_babies_with_length){
            let numOfTimes = Math.floor(number_of_babies_with_length/required_babies_with_length);
            //this limits the number of hats
            maxHats = Math.min(numOfTimes, maxHats);
          }
          else {
            maxHats = 0;
          }
        }
      }
    });

    /*
    Prerequisite:
    - Which hat we are checking
      -> material for wall
      -> material for crown
      -> which wing
      -> number of wings
    -> Wing spec (of the hat)
      -> Babies: R, L, T, C

    -> Customer bank(s)
      -> Material
      -> Bank Allocation
      ->  Babies: x length & quantity
    
    -> Deviations:
        How much can the top be shorter
        How much can the crown be shorter

    Algorithm:
      Calculate/aggregate the babies of the hat: a map of all babies with their lengths x number of wings per hat
      Match the bank material for crown or wall
      Iterate the bank allocation matching the materials
        Iterate the aggregated hat babies
          Count how many times each baby in the customer's allocaion can duplicate for each hat baby
          Keep the max possible according to the lowest match
      
      Calculate hats with deviations
        Repeat the calculation
    */

    return maxHats == Infinity ? 0 : maxHats;
  }

  aggregateAllBabiesInHat(babies:WingBaby[], numOfWingsInHat: number, isCrown:boolean): Map<number, number>{
    let babiesCollction = new Map<number, number>();
    babies.filter(b => (isCrown)? b.position.startsWith("C") : !b.position.startsWith("C")).forEach(baby => {
      if(babiesCollction.has(baby.length)) {
        let curCount = babiesCollction.get(baby.length);
        curCount = (curCount)? curCount : 0;
        babiesCollction.set(baby.length, curCount + numOfWingsInHat);
      }
      else {
        babiesCollction.set(baby.length, numOfWingsInHat);
      }
    });
    return babiesCollction;
  }

//=============== END OF ALONS IMPLEMENTATION

  /*
  calculateMaxHats (
    hat:Hat,                                          //the hat has information about wing name, quantity and materials
    wing: Wing,                                       //the actual wing contains babies
    customerBanks: Customer_Bank[],                      //customer bank has information about material and an id for allocations
    customer_bank_allocation: Customer_Bank_Baby_Allocation[],
    allocation_babies: Customer_Baby[]
  ){
    // which babies are required for this hat?
    //hat has wings:HatWing[] -> HatWing has wing_name, Wing can be found by name, has babies:WingBaby[] with length and position
    
    let banks_with_wall_material = customerBanks.filter(b => b.raw_material_name == hat.hat_material);
    let banks_with_crown_material = customerBanks.filter(b => b.raw_material_name == hat.crown_material);

    let number_of_wings = hat.wings[0].wing_quantity;
    //key: lenfth, value: quantity
    let aggregatedHatBabiesForWall = new Map<number, number>();
    let aggregatedHatBabiesForCrown = new Map<number, number>();
  
    wing.babies.filter(b => !b.position.startsWith("C")).forEach((baby:WingBaby) => {
      if(!aggregatedHatBabiesForWall.has(baby.length)) {
        aggregatedHatBabiesForWall.set(baby.length, number_of_wings);
      } 
      else {
        let babies_at_curr_len = aggregatedHatBabiesForWall.get(baby.length);
        aggregatedHatBabiesForWall.set(baby.length, ((babies_at_curr_len)? babies_at_curr_len: 0) +  number_of_wings);
      }

    });
*/
    /*
    Find banks matching the material
    Find allocations of the banks
    Aggregate babies

    Aggregate babies needed for hat
    Loop over babies in the hat, for each:
      count how many times the customer can duplicate
      keep max count. if the baby is lower than the max, adjust the max

    Caculate hats with shorter crown, and hats with shorter tops and both
    Count hats with shorter crown/top

  }    */
    calculateMaxHats(
      hat: Hat,
      wing: Wing,
      customerBabies: Customer_Baby[],
      maxTopFlexibility: number = 0, // Flexibility for the TOP baby
      maxCrownFlexibility: number = 0 // Flexibility for Crown babies
    ): number {
      const requiredBabies: Map<number, number> = new Map();
    
      // Step 1: Calculate Required Babies for One Hat
      hat.wings.forEach((hatWing) => {
        const wingQuantity = hatWing.wing_quantity;
    
        // Group babies by position
        const topBaby = wing.babies.find((baby) => baby.position === "TOP");
        const crownBabies = wing.babies.filter((baby) => baby.position.startsWith("C"));
        const rightBabies = wing.babies
          .filter((baby) => baby.position.startsWith("R"))
          .sort((a, b) => parseInt(a.position.slice(1)) - parseInt(b.position.slice(1))); // Sort R1, R2, ...
        const leftBabies = wing.babies
          .filter((baby) => baby.position.startsWith("L"))
          .sort((a, b) => parseInt(a.position.slice(1)) - parseInt(b.position.slice(1))); // Sort L1, L2, ...
    
        // TOP Baby Calculation
        if (topBaby) {
          // Add original length
          const topLength = topBaby.length;
          const currentTopCount = requiredBabies.get(topLength) || 0;
          requiredBabies.set(topLength, currentTopCount + wingQuantity);
    
          // Add flexibility for shorter top
          if (maxTopFlexibility > 0) {
            const shorterTopLength = topLength - maxTopFlexibility;
            const currentShorterTopCount = requiredBabies.get(shorterTopLength) || 0;
            requiredBabies.set(shorterTopLength, currentShorterTopCount + wingQuantity);
    
            // Adjust R and L babies based on the shorter top
            this.adjustSideBabies(rightBabies, shorterTopLength, wingQuantity, requiredBabies);
            this.adjustSideBabies(leftBabies, shorterTopLength, wingQuantity, requiredBabies);
          }
        }
    
        // Crown Babies Calculation
        crownBabies.forEach((crownBaby) => {
          // Add original crown length
          const crownLength = crownBaby.length;
          const currentCrownCount = requiredBabies.get(crownLength) || 0;
          requiredBabies.set(crownLength, currentCrownCount + wingQuantity);
    
          // Add flexibility for shorter crown
          if (maxCrownFlexibility > 0) {
            const shorterCrownLength = crownLength - maxCrownFlexibility;
            const currentShorterCrownCount = requiredBabies.get(shorterCrownLength) || 0;
            requiredBabies.set(shorterCrownLength, currentShorterCrownCount + wingQuantity);
          }
        });
      });
    
      // Step 2: Check Available Quantities
      let maxHats = Infinity;
    
      requiredBabies.forEach((requiredQuantity, length) => {
        const customerBaby = customerBabies.find((baby) => baby.length === length);
        if (!customerBaby || customerBaby.quantity < requiredQuantity) {
          maxHats = 0; // Not enough materials
        } else {
          const possibleHats = Math.floor(customerBaby.quantity / requiredQuantity);
          maxHats = Math.min(maxHats, possibleHats);
        }
      });
    
      return maxHats;
    }
    
    // Helper Function to Adjust R/L Babies
    adjustSideBabies(
      sideBabies: WingBaby[],
      shorterTopLength: number,
      wingQuantity: number,
      requiredBabies: Map<number, number>
    ) {
      let prevLength = shorterTopLength;
      sideBabies.forEach((baby) => {
        const babyLength = prevLength - 0.5; // Each subsequent baby is shorter by 0.5
        if (babyLength < 5) return; // Ignore if length falls below the minimum
    
        const currentCount = requiredBabies.get(babyLength) || 0;
        requiredBabies.set(babyLength, currentCount + wingQuantity);
    
        prevLength = babyLength; // Update for next baby
      });
    }
    
  }
