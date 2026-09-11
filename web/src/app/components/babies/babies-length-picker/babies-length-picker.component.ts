import { DecimalPipe, NgIf } from '@angular/common';
import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-babies-length-picker',
  standalone: true,
  imports: [ NgIf, DecimalPipe ],
  templateUrl: './babies-length-picker.component.html',
  styleUrl: './babies-length-picker.component.scss'
})
export class BabiesLengthPickerComponent implements OnInit, AfterViewInit {

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
  @Input() custom_lengths: { length: number, count: number }[] = []; 
  @Input() show_counts: boolean = false;

  console = console;
  Number = Number;
  //count is optional, if show_counts is true
  lengths: { length: number, count: number }[] = [];
  
  ngOnInit(): void {
    this.lengths = 
      ((this.show_only_custom_lengths)?
        this.custom_lengths.map(l => {return { length: length, count: l.count } }) :
        Array.from({ length: (((this.max_length - this.min_length)*(1/this.length_step))+1) }, (v, k) => (this.min_length + this.length_step + ((k-1)*this.length_step))).map(item => { return { length: item, count: 0 } }))
      .sort((a, b) => { return (a.length < b.length)?-1:1; });
  }

  ngAfterViewInit(): void {
    //this.lengths = Array.from({ length: (((this.max_length - this.min_length)*(1/this.length_step))+1) }, (v, k) => (this.min_length + this.length_step + ((k-1)*this.length_step)).toFixed(1));
  }

  //set a specific length as active, and emit the lengthChange event with the new selected length
  setLength(length: number){
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

  setCountForLength(length: number, count: number){
    this.lengths.find(l => l.length == length)!.count = count;
  }

  getCountForLength(length: number): number{
    return this.lengths.find(l => l.length == length)?.count ?? 0;
  }

  //clear the selected lengths
  public reset() {
    this.selected_lengths = [];
  }

  toggleAll() {
    //if some are selected, clear all. if none are selected, select all.
    if(this.selected_lengths.length > 0)
      this.selected_lengths = [];
    else
      this.selected_lengths = this.lengths.map(l => l.length);
    this.lengthChange.emit(this.selected_lengths);
  }

  public isLengthInvalid()
  {
    if (!this.show_invalid_message)
      return false;
    
    for (let length of this.selected_lengths) {
      if (this.lengths.findIndex((item) => item.length == length) == -1)
        return true;
    };
    return false;
  }

  public get_selected_lengths(): number[]{
    return this.selected_lengths;
  }
}
