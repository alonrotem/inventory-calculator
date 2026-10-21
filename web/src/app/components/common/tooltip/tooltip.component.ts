import { Component, HostListener } from '@angular/core';

/*
The floating tooltip box. It follows the mouse while it's visible.
Don't use it directly: use the appTooltip directive (tooltip.directive.ts), which shows
a single shared instance of this component through TooltipService.
*/
@Component({
  selector: 'app-tooltip',
  standalone: true,
  imports: [],
  templateUrl: './tooltip.component.html',
  styleUrl: './tooltip.component.scss'
})
export class TooltipComponent {
  content: string = '';
  visible: boolean = false;
  top: number = 0;
  left: number = 0;

  // Offset from the mouse pointer, so the tooltip doesn't sit under the cursor
  private readonly offsetX = 12;
  private readonly offsetY = 19;

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    this.top = event.clientY + this.offsetY;
    this.left = event.clientX + this.offsetX;
  }

  show(content: string) {
    this.content = content;
    this.visible = true;
  }

  hide() {
    this.visible = false;
  }
}
