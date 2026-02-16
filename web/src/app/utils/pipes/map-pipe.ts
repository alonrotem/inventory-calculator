import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'map', standalone: true, pure: false})
export class MapPipe implements PipeTransform {
  transform(items: any[], property: string = ""): any {
    if(items.length == 0){
        return [];
    }
    else {
      if(property != ""){
        return items.map(i => i[property]);
      }
      else {
        return items;
      }
    }
  }
}