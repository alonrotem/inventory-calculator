import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'sum', standalone: true, pure: false})
export class SumPipe implements PipeTransform {
  transform(items: any[], property: string): number {
    if(property == ""){
        return 0;
    }

    let sum = items.map(item => item[property]).reduce((prev, curr) => prev + curr, 0);
    return sum;
  }
}