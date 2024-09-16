import { NgIf } from '@angular/common';
import { AfterViewInit, Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-babies-length-picker',
  standalone: true,
  imports: [ NgIf ],
  templateUrl: './babies-length-picker.component.html',
  styleUrl: './babies-length-picker.component.scss'
})
export class BabiesLengthPickerComponent implements AfterViewInit {
  ngAfterViewInit(): void {
    this.lengths = Array.from({ length: (((this.max_length - this.min_length)*(1/this.length_step))+1) }, (v, k) => (this.min_length + this.length_step + ((k-1)*this.length_step)).toFixed(1));
  }
  @Input() title: string ="Pick a baby length:"; 
  @Input() min_length: number = 5;
  @Input() max_length: number = 13;
  @Input() length_step: number = 0.5;
  @Input() units: string = "cm";
  @Input() length: number = -999;
  @Input() show_invalid_message: boolean = true;
  @Output() lengthChange = new EventEmitter<number>();
  console = console;
  lengths : string[] = [];
  

  setLength(length: string){
    this.length = Number(length);
    this.lengthChange.emit(Number(length));
  }

  public reset() {
    this.length = -999;
  }

  public isLengthInvalid()
  {
    if (!this.show_invalid_message)
      return false;
    
    return (this.lengths.findIndex((item) => item == this.length.toFixed(1).toString()) == -1);
  }

  public get_length(): number{
    return this.length;
  }
}
