import { ApplicationRef, ComponentRef, EnvironmentInjector, Injectable, createComponent } from '@angular/core';
import { TooltipComponent } from './tooltip.component';

// Owns the single, shared tooltip box. It's created lazily and attached to <body>,
// so components never need to place <app-tooltip> in their own templates.
@Injectable({ providedIn: 'root' })
export class TooltipService {
  private tooltip?: ComponentRef<TooltipComponent>;

  constructor(private appRef: ApplicationRef, private injector: EnvironmentInjector) {}

  show(content: string) {
    this.getTooltip().instance.show(content);
  }

  hide() {
    this.tooltip?.instance.hide();
  }

  private getTooltip(): ComponentRef<TooltipComponent> {
    if (!this.tooltip) {
      this.tooltip = createComponent(TooltipComponent, { environmentInjector: this.injector });
      this.appRef.attachView(this.tooltip.hostView);
      document.body.appendChild(this.tooltip.location.nativeElement);
    }
    return this.tooltip;
  }
}
