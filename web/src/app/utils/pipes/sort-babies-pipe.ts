import { Pipe, PipeTransform } from '@angular/core';
import { WingBaby } from '../../../types';
import { WingsService } from '../../services/wings.service';
@Pipe({
  name: 'sortbabies', standalone: true, pure: false
})
export class SortBabiesPipe implements PipeTransform {

    constructor(private wingsService: WingsService){}

  transform(items: WingBaby[], reversed: boolean = false): WingBaby[] {
    return this.wingsService.sort_babies(items, reversed);
  }
}