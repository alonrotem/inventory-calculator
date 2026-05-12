import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'filter', standalone: true, pure: false})
export class FilterPipe implements PipeTransform {
  transform(items: any[] | undefined, property: string, value: any, negtive: boolean=false): any[] {
    if (!items) {
      return [];
    }

    if(property == ""){
        return items.filter((i) => {
            return (negtive)?
              i != value : 
              i == value;
          });
    }

    let filtered = items.filter((i) => {
        return (negtive)?
          i[property] != value : 
          i[property] == value;
    });
    return filtered;
  }
}