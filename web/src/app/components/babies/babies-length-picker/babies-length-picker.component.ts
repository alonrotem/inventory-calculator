import { NgIf } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-babies-length-picker',
  standalone: true,
  imports: [ NgIf ],
  templateUrl: './babies-length-picker.component.html',
  styleUrl: './babies-length-picker.component.scss'
})
export class BabiesLengthPickerComponent {
  @Input() min_length: number = 5;
  @Input() max_length: number = 13;
  @Input() length_step: number = 0.5;
  @Input() units: string = "cm";
  @Input() length: number = -999;
  @Output() length_picked = new EventEmitter<number>();
  console = console;

  lengths = Array.from({ length: (((this.max_length - this.min_length)*(1/this.length_step))+1) }, (v, k) => (this.min_length + this.length_step + ((k-1)*this.length_step)).toFixed(1));

  setLength(length: string){
    this.length_picked.emit(Number(length));
    this.length = Number(length);
  }

  public reset() {
    this.length = -999;
  }

  public isLengthInvalid()
  {
    return (this.lengths.findIndex((item) => item == this.length.toFixed(1).toString()) == -1);
  }

  public get_length(): number{
    return this.length;
  }
}
