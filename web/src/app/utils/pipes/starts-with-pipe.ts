import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'starts_with', standalone: true, pure: false})
export class StartsWithPipe implements PipeTransform {
  transform(items: any[], property: string, value: any, negtive: boolean=false): any[] {
    if(property == ""){
        return items;
    }

    let filtered = items.filter((i) => {
        return (negtive)?
          !i[property].startsWith(value) : 
          i[property].startsWith(value);
    });
    return filtered;
  }
}