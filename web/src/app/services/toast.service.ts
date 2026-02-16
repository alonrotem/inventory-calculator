import { Injectable, TemplateRef } from '@angular/core';

export interface Toast {
  text?: string;
	//template: TemplateRef<any>;
	classname?: string;
	delay?: number;
}

@Injectable({ providedIn: 'root' })
export class ToastService {
	toasts: Toast[] = [];

	show(toast: Toast) {
		this.toasts.push(toast);
	}

	remove(toast: Toast) {
		this.toasts = this.toasts.filter((t) => t !== toast);
	}

	clear() {
		this.toasts.splice(0, this.toasts.length);
	}

  showSuccess(text: string) {
		this.show({ text: text, classname: 'bg-success text-light', delay: 4000 });
	}

  showError(text: string) {
		this.show({ text: text, classname: 'bg-danger text-light', delay: 4000 });
	}

	
}