import { Component, Input, Output, EventEmitter, ElementRef, HostListener } from '@angular/core';
import { DecimalPipe, NgIf } from '@angular/common';

@Component({
  selector: 'app-capacity-bar',
  standalone: true,
  imports: [ DecimalPipe, NgIf ],
  providers: [DecimalPipe],
  templateUrl: './capacity-bar.component.html',
  styleUrls: ['./capacity-bar.component.scss']
})
export class CapacityBarComponent {
  @Input() totalCapacity: number = 0;
  @Input() materialInUse: number = 0;
  @Input() bankQuantity: number = 0;
  @Input() show_in_use:boolean = true;
  notInUseCapacity: number = 0;

  @Output() bankQuantityChanged = new EventEmitter<number>();

  containerWidth: number = 0;
  isDragging: boolean = false;

  constructor(private elRef: ElementRef, private decimalPipe: DecimalPipe) {
  }

  //To be called whenever data is fed to this component, to invoke recalculation
  recalculate() {
    this.notInUseCapacity = this.bankQuantity - this.materialInUse;
    setTimeout(() => {
      const container = this.elRef.nativeElement.querySelector('.capacity-container');
      this.containerWidth = container.offsetWidth;
    });
  }

  onMouseDown(event: MouseEvent) {
    this.isDragging = true;
    event.preventDefault();
  }


  @HostListener('document:mouseup', ['$event'])
  onGlobalMouseUp(event: MouseEvent) {
    this.isDragging = false;
  }

  @HostListener('document:mousemove', ['$event'])
  onGlobalMouseMove(event: MouseEvent) {
    if(!this.isDragging) return;

    const container = this.elRef.nativeElement.querySelector('.capacity-container');
    const rect = container.getBoundingClientRect();
    const mouseX = event.clientX - rect.left; // Mouse position relative to the container
    const fixedWidth = (this.materialInUse / this.totalCapacity) * this.containerWidth;

    let newDynamicWidth = 0;

    // Calculate new width of the dynamic rectangle
    newDynamicWidth = mouseX - fixedWidth;

    // Ensure dynamic rectangle stays within bounds
    if (newDynamicWidth < 0) {
      newDynamicWidth = 0;
    } else if (newDynamicWidth > this.containerWidth - fixedWidth) {
      newDynamicWidth = this.containerWidth - fixedWidth;
    }

    // Update the dynamic value based on the calculated width
    this.notInUseCapacity = ((newDynamicWidth) / this.containerWidth) * this.totalCapacity;
    this.bankQuantityChanged.emit(Number( Math.trunc(this.notInUseCapacity + this.materialInUse) || '0'));
  }
}
