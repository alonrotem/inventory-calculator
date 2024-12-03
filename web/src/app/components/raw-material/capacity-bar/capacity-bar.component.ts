import { Component, Input, Output, EventEmitter, ElementRef, OnInit, HostListener } from '@angular/core';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-capacity-bar',
  standalone: true,
  imports: [ DecimalPipe ],
  providers: [DecimalPipe],
  templateUrl: './capacity-bar.component.html',
  styleUrls: ['./capacity-bar.component.scss']
})
export class CapacityBarComponent implements OnInit {
  @Input() totalCapacity: number = 0;
  @Input() materialInUse: number = 0;
  @Input() bankQuantity: number = 0;
  notInUseCapacity: number = 0;

  @Output() bankQuantityChanged = new EventEmitter<number>();

  containerWidth: number = 0;
  isDragging: boolean = false;

  constructor(private elRef: ElementRef, private decimalPipe: DecimalPipe) {}

  ngOnInit() {
    /*
    setTimeout(() => {
      const container = this.elRef.nativeElement.querySelector('.capacity-container');
      this.containerWidth = container.offsetWidth;
    });
    */
  }

  recalculate() {
    this.notInUseCapacity = this.bankQuantity - this.materialInUse;
    console.log("this.notInUseCapacity(" + this.notInUseCapacity +") = this.bankQuantity ("+this.bankQuantity+") - this.materialInUse("+ this.materialInUse +")")
    setTimeout(() => {
      const container = this.elRef.nativeElement.querySelector('.capacity-container');
      this.containerWidth = container.offsetWidth;
    });
  }

  onMouseDown(event: MouseEvent) {
    this.isDragging = true;
    event.preventDefault(); // Prevent default behavior
  }

  onMouseUp() {
    this.isDragging = false;
  }

  onMouseMove(event: MouseEvent) {
    if (!this.isDragging) return;

    const container = this.elRef.nativeElement.querySelector('.capacity-container');
    const rect = container.getBoundingClientRect();
    const mouseX = event.clientX - rect.left; // Mouse position relative to the container
    const fixedWidth = (this.materialInUse / this.totalCapacity) * this.containerWidth;

    // Calculate new width of the dynamic rectangle
    let newDynamicWidth = mouseX - fixedWidth;

    // Ensure dynamic rectangle stays within bounds
    if (newDynamicWidth < 0) {
      newDynamicWidth = 0;
    } else if (newDynamicWidth > this.containerWidth - fixedWidth) {
      newDynamicWidth = this.containerWidth - fixedWidth;
    }

    // Update the dynamic value based on the calculated width
    this.notInUseCapacity = ((newDynamicWidth) / this.containerWidth) * this.totalCapacity;
    this.bankQuantityChanged.emit(Number(this.decimalPipe.transform(this.notInUseCapacity + this.materialInUse, '1.0-0') || '0'));
  }

  @HostListener('document:mouseup', ['$event'])
  onGlobalMouseUp(event: MouseEvent) {
    this.isDragging = false;
  }
}
