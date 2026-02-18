import { Pipe, PipeTransform } from '@angular/core';
@Pipe({
  name: 'sort', standalone: true, pure: false
})
export class SortPipe implements PipeTransform {

  transform(items: any[], property: string, reversed: boolean = false): any[] {
    if(!items || property == ""){
        return items;
    }
    return items.sort((i1, i2) => 
    {
      return (reversed)? i2[property] - i1[property] : i1[property] - i2[property]; 
    });
  }
}