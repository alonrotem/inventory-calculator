import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'prefix', standalone: true, pure: false})
export class PrefixPipe implements PipeTransform {
  transform(items: any[], prefix: string, lenghtsOnly: boolean = false): any[] {
    let filtered = items.filter((i) => {
        return i.position.startsWith(prefix);
    });
    if(lenghtsOnly){
        filtered = filtered.map((i) => i.length);
    }
    return filtered;
  }
}