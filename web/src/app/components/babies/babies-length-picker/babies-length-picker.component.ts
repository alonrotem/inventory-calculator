import { NgIf } from '@angular/common';
import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-babies-length-picker',
  standalone: true,
  imports: [ NgIf ],
  templateUrl: './babies-length-picker.component.html',
  styleUrl: './babies-length-picker.component.scss'
})
export class BabiesLengthPickerComponent implements OnInit, AfterViewInit {
  ngOnInit(): void {
    this.lengths = 
      (this.show_only_custom_lengths)?
      this.custom_lengths.map(l => l.toFixed(1).toString()) :
      Array.from({ length: (((this.max_length - this.min_length)*(1/this.length_step))+1) }, (v, k) => (this.min_length + this.length_step + ((k-1)*this.length_step)).toFixed(1));
  }

  ngAfterViewInit(): void {
    //this.lengths = Array.from({ length: (((this.max_length - this.min_length)*(1/this.length_step))+1) }, (v, k) => (this.min_length + this.length_step + ((k-1)*this.length_step)).toFixed(1));
  }

  @Input() title: string ="Pick a baby length:"; 
  @Input() min_length: number = 5;
  @Input() max_length: number = 16;
  @Input() length_step: number = 0.5;
  @Input() units: string = "cm";
  //@Input() length: number = -999;
  @Input() selected_lengths: number[] = [];
  @Input() show_invalid_message: boolean = true;
  @Input() multi_select: boolean = false;
  @Output() lengthChange = new EventEmitter<number[]>();
  @Output() confirm = new EventEmitter<number[]>();
  @Output() cancel = new EventEmitter<void>();

  @Input() show_only_custom_lengths: boolean = false;
  @Input() custom_lengths: number[] = []; 

  console = console;
  Number = Number;
  lengths : string[] = [];
  
  setLength(length: string){
    if(this.multi_select){
      if(this.selected_lengths.includes(Number(length)))
        this.selected_lengths = this.selected_lengths.filter(l => l != Number(length));
      else
        this.selected_lengths.push(Number(length));
    }
    else{
      this.selected_lengths = [Number(length)];
    }
    //this.length = Number(length);
    this.lengthChange.emit(this.selected_lengths);
  }

  public reset() {
    this.selected_lengths = [];
  }

  toggleAll() {
    //if some are selected, clear all. if none are selected, select all.
    if(this.selected_lengths.length > 0)
      this.selected_lengths = [];
    else
      this.selected_lengths = this.lengths.map(l => Number(l));
    this.lengthChange.emit(this.selected_lengths);
  }

  public isLengthInvalid()
  {
    if (!this.show_invalid_message)
      return false;
    
    for (let length of this.selected_lengths) {
      if (this.lengths.findIndex((item) => item == length.toFixed(1).toString()) == -1)
        return true;
    };
    return false;
  }

  public get_selected_lengths(): number[]{
    return this.selected_lengths;
  }
}
