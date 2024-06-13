import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgClass, NgFor } from '@angular/common';

@Component({
  selector: 'app-paginator',
  standalone: true,
  imports: [ NgClass, NgFor ],
  templateUrl: './paginator.component.html',
  styleUrl: './paginator.component.scss'
})
export class PaginatorComponent {
  @Input() pages: number = 0;
  @Input() current_page: number = 0;
  @Output() public onPageChange: EventEmitter<any> = new EventEmitter();

  pageClicked(page: number) {
    // do something
    this.onPageChange.emit(page)
  }
}
