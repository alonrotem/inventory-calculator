import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'first', standalone: true, pure: false})
export class FirstPipe implements PipeTransform {
  transform(items: any[], property: string = ""): any {
    if(items.length == 0){
        return "";
    }
    else {
      let item = items[0];
      if(property != "") {
        return item[property];
      }
      else {
        return item;
      }
    }
  }
}