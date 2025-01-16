import { Injectable } from '@angular/core';
import { Customer_Baby, Customer_Bank, Customer_Bank_Baby_Allocation, Hat, Wing, WingBaby } from '../../types';

@Injectable({
  providedIn: 'root'
})
export class HatsCalculatorService {

  constructor() { }
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
  
  calculateMaxHatsWithFlexibility(
    hat: Hat,
    wings: Wing[],
    customerBanks: Customer_Bank[],
    customerBabyAllocations: Customer_Bank_Baby_Allocation[],
    customerBabies: Customer_Baby[],
    topFlexibilityPercent: number,
    crownFlexibilityPercent: number,
    topFlexibilityAmount: number = 0.5,
    crownFlexibilityAmount: number = 1
  ): number {
    const babyBank = customerBanks.find((bank) => bank.raw_material_name === hat.hat_material);
    const crownBank = customerBanks.find((bank) => bank.raw_material_name === hat.crown_material);

    if (!babyBank || !crownBank) {
      return 0;
    }

    const babiesByLength = this.groupBabiesByLength(customerBabies, customerBabyAllocations, babyBank.id);
    const crownBabiesByLength = this.groupBabiesByLength(customerBabies, customerBabyAllocations, crownBank.id);

    for (const hatWing of hat.wings) {
      const wing = wings.find((w) => w.name === hatWing.wing_name);

      if (!wing) {
        return 0;
      }

      // Prepare the required babies for the wing
      const { requiredBabies, requiredCrownBabies } = this.prepareWingRequirements(
        wing,
        hatWing.wing_quantity,
        topFlexibilityPercent,
        topFlexibilityAmount,
        crownFlexibilityPercent,
        crownFlexibilityAmount
      );

      // Calculate limiting factors
      const wingMaxHats = this.calculateMaxByLength(babiesByLength, requiredBabies);
      const wingMaxCrownHats = this.calculateMaxByLength(crownBabiesByLength, requiredCrownBabies);

      //maxHats = Math.min(maxHats, wingMaxHats, wingMaxCrownHats);
    }
    return 0;
    //return maxHats;
  }

  private groupBabiesByLength(
    customerBabies: Customer_Baby[],
    customerBabyAllocations: Customer_Bank_Baby_Allocation[],
    bankId: number
  ): { [length: number]: number } {
    const babiesByLength: { [length: number]: number } = {};

    customerBabies.forEach((baby) => {
      const allocation = customerBabyAllocations.find((alloc) => alloc.id === baby.customer_banks_babies_id);
      if (allocation?.customer_bank_id === bankId) {
        babiesByLength[baby.length] = (babiesByLength[baby.length] || 0) + baby.quantity;
      }
    });

    return babiesByLength;
  }

  private prepareWingRequirements(
    wing: Wing,
    quantity: number,
    topFlexibilityPercent: number,
    topFlexibilityAmount: number,
    crownFlexibilityPercent: number,
    crownFlexibilityAmount: number
  ): {
    requiredBabies: { [length: number]: number };
    requiredCrownBabies: { [length: number]: number };
  } {
    const requiredBabies: { [length: number]: number } = {};
    const requiredCrownBabies: { [length: number]: number } = {};
  
    const topBaby = wing.babies.find((baby) => baby.position === 'TOP');
    if (!topBaby) {
      throw new Error(`Wing ${wing.name} has no TOP baby.`);
    }
  
    const flexibleWings = Math.ceil(quantity * (topFlexibilityPercent / 100));
    const flexibleCrownWings = Math.ceil(quantity * (crownFlexibilityPercent / 100));
  
    let topLength = topBaby.length;
  
    for (let i = 0; i < quantity; i++) {
      const isFlexible = i < flexibleWings;
      let adjustedTopLength = topLength;
  
      if (isFlexible) {
        adjustedTopLength = Math.max(5, adjustedTopLength - topFlexibilityAmount);
      }
  
      requiredBabies[adjustedTopLength] = (requiredBabies[adjustedTopLength] || 0) + 1;
  
      // Adjust R and L babies
      const rightBabies = wing.babies.filter((baby) => baby.position.startsWith('R'));
      const leftBabies = wing.babies.filter((baby) => baby.position.startsWith('L'));
  
      // Sort by descending order of proximity to the TOP
      rightBabies.sort((a, b) => this.getPositionOrder(b.position) - this.getPositionOrder(a.position));
      leftBabies.sort((a, b) => this.getPositionOrder(b.position) - this.getPositionOrder(a.position));
  
      let previousLength = adjustedTopLength;
  
      // Handle right babies
      rightBabies.forEach((baby) => {
        let sideLength = baby.length;
        if (isFlexible && sideLength >= previousLength) {
          sideLength = Math.max(5, previousLength - 0.5);
        }
        requiredBabies[sideLength] = (requiredBabies[sideLength] || 0) + 1;
        previousLength = sideLength;
      });
  
      // Reset previousLength for left babies
      previousLength = adjustedTopLength;
  
      // Handle left babies
      leftBabies.forEach((baby) => {
        let sideLength = baby.length;
        if (isFlexible && sideLength >= previousLength) {
          sideLength = Math.max(5, previousLength - 0.5);
        }
        requiredBabies[sideLength] = (requiredBabies[sideLength] || 0) + 1;
        previousLength = sideLength;
      });
    }
  
    // Handle Crown flexibility
    const crownBabies = wing.babies.filter((baby) => baby.position.startsWith('C'));
    if (crownBabies.length > 0) {
      const crownLength = crownBabies[0].length; // Assuming all crowns in a wing are of the same length
  
      for (let i = 0; i < quantity; i++) {
        const isFlexible = i < flexibleCrownWings;
        const adjustedCrownLength = isFlexible
          ? Math.max(5, crownLength - crownFlexibilityAmount)
          : crownLength;
  
        requiredCrownBabies[adjustedCrownLength] = (requiredCrownBabies[adjustedCrownLength] || 0) + 1;
      }
    }
  
    return { requiredBabies, requiredCrownBabies };
  }
  
  private getPositionOrder(position: string): number {
    if (position === 'TOP') {
      return 0;
    }
    if (position.startsWith('R') || position.startsWith('L')) {
      return parseInt(position.slice(1)) || 0;
    }
    return Infinity; // Crown babies
  }

  private calculateMaxByLength(
    availableBabies: { [length: number]: number },
    requiredBabies: { [length: number]: number }
  ): number {
    let maxHats = Infinity;

    for (const length in requiredBabies) {
      const requiredQuantity = requiredBabies[length];
      const availableQuantity = availableBabies[length] || 0;

      if (requiredQuantity > 0) {
        const possibleHats = Math.floor(availableQuantity / requiredQuantity);
        maxHats = Math.min(maxHats, possibleHats);
      }
    }

    return maxHats;
  }
}
