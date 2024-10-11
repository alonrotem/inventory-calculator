import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'filter', standalone: true, pure: false})
export class FilterPipe implements PipeTransform {
  transform(items: any[], property: string, value: any): any[] {
    if(property == ""){
        return items;
    }

    let filtered = items.filter((i) => {
        return i[property] == value;
    });
    return filtered;
  }
}