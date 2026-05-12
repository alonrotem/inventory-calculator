import { Component, EventEmitter, Input, Output } from '@angular/core';
import { trigger, style, transition, animate } from '@angular/animations';
import { NgIf } from '@angular/common';
import { FaIconComponent, IconDefinition } from '@fortawesome/angular-fontawesome';
import { faSave } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-save-changes-button',
  standalone: true,
  imports: [NgIf, FaIconComponent],
  templateUrl: './save-changes-button.component.html',
  styleUrl: './save-changes-button.component.scss',
  animations: [
    trigger('slideInOut', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(-80px)' }),
        animate('350ms cubic-bezier(0.4,0,0.2,1)', style({ opacity: 1, transform: 'translateY(0)' }))
      ]),
      transition(':leave', [
        animate('350ms cubic-bezier(0.4,0,0.2,1)', style({ opacity: 0, transform: 'translateY(-80px)' }))
      ])
    ])
  ]
})
export class SaveChangesButtonComponent {
  @Input() message: string = "Save changes quickly?";
  @Input() show: boolean = false;
  @Output() save = new EventEmitter<void>();
  faSave: IconDefinition = faSave;
}
