import { Directive, HostListener, Input, OnDestroy } from '@angular/core';
import { TooltipService } from './tooltip.service';

/*
Usage (add TooltipDirective to the component's imports):

  <button appTooltip="Some help text">...</button>

  <ng-select [appTooltip]="'<strong>🔒 Locked</strong><br/>Explanation'" [tooltipEnabled]="is_locked"> ... </ng-select>

- appTooltip: the tooltip content (HTML, sanitized by Angular)
- tooltipEnabled: optional, defaults to true. The tooltip is shown only while it's true.
*/
@Directive({
  selector: '[appTooltip]',
  standalone: true
})
export class TooltipDirective implements OnDestroy {
  @Input('appTooltip') content: string = '';
  @Input() tooltipEnabled: boolean = true;

  constructor(private tooltipService: TooltipService) {}

  @HostListener('mousemove')
  onMouseMove() {
    // Evaluated on every move, so the tooltip also reacts to the condition changing while hovering
    if (this.tooltipEnabled && this.content) {
      this.tooltipService.show(this.content);
    }
    else {
      this.tooltipService.hide();
    }
  }

  @HostListener('mouseleave')
  onMouseLeave() {
    this.tooltipService.hide();
  }

  ngOnDestroy() {
    this.tooltipService.hide();
  }
}
