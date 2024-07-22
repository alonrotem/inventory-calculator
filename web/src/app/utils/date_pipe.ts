import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dateStr',
  standalone: true
})
export class DateStrPipe implements PipeTransform {

  transform(value: any): string {
    let d: Date = new Date();
    if(typeof value == "string")
    {
        d = new Date(value);
    }
    else
    {
        d = value;
    }
    //console.log("transform " + value);
    return  d.getDate().toString().padStart(2, '0') + 
        "/" + (d.getMonth()+1).toString().padStart(2, '0') + 
        "/" + d.getFullYear() + 
        " " + d.getHours().toString().padStart(2, '0') + 
        ":" + d.getMinutes().toString().padStart(2, '0');
  }
}