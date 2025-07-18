import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'wingsPerHatShorthand',
  standalone: true
})
export class WingsPerHatShorthandPipe implements PipeTransform {

  transform(value: string): string {
    /*
    let n = "   ";
    console.log(Number.isNaN(Number(n)));
    console.log(Number(n));
    */
    if(value.includes(",")){
        let arr = value.split(",");
        //go through the items
        //if an item is different than the first -> they vary. collect min and max
        //if no different item found, return the first.

        let first = Number(arr[0]);
        let min = 0;
        let max = 0;
        let varied = false;
        if(!Number.isNaN(first)){
            min = first;
            max = first;
            varied = false;
            for(let i=1; i < arr.length; i++){
                let item = Number(arr[i]);
                if(!Number.isNaN(item)){
                    min = Math.min(item, min);
                    max = Math.max(item, max);
                    varied = item != first;
                }
            }
            if(varied) {
                return `~${min} - ${max}`;
            }
            else {
                return first.toString();
            }
        }
        else {
            return "Invalid value";
        }
    }
    else {
        let num = Number(value);
        return Number.isNaN(num)? "Invalid value" : num.toString();
    }
/*
    let d: Date = new Date();
    if(typeof value == "string")
    {
        d = new Date(value);
    }
    else
    {
        d = value;
    }
    return  d.getDate().toString().padStart(2, '0') + 
        "/" + (d.getMonth()+1).toString().padStart(2, '0') + 
        "/" + d.getFullYear() + 
        " " + d.getHours().toString().padStart(2, '0') + 
        ":" + d.getMinutes().toString().padStart(2, '0');
  }
        */
    }
}