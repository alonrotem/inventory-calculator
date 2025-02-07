import { Component, inject } from '@angular/core';
import { ToastService } from '../../../services/toast.service';
import { NgTemplateOutlet } from '@angular/common';
import { NgbToastModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [ NgbToastModule, NgTemplateOutlet ],
  templateUrl: './toast.component.html',
  styleUrl: './toast.component.scss',
  host: { class: 'toast-container position-fixed bottom-0 end-0 p-3', style: 'z-index: 1200' }
})
export class ToastComponent {
  toastService = inject(ToastService);
}
