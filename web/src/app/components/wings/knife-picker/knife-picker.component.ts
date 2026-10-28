import { Component, EventEmitter, Input, Output } from '@angular/core';
import { KnivesService } from '../../../services/knives.service';
import { KnifeListItem, KnivesList, nameIdPair } from '../../../../types';
import { MultiPickerComponent } from '../../common/multi-picker/multi-picker.component';

@Component({
  selector: 'app-knife-picker',
  standalone: true,
  imports: [MultiPickerComponent],
  templateUrl: './knife-picker.component.html'
})
export class KnifePickerComponent {
  knives: KnifeListItem[] = [];

  @Input() disabled: boolean = true;
  @Input() multi: boolean = true;
  @Input() pickedKnives: nameIdPair[] = [];
  @Output() pickedKnivesChange = new EventEmitter<nameIdPair[]>();
  @Output() Change = new EventEmitter();

  knifeLabel = (knife: KnifeListItem): string => `${knife.name} - ${knife.width_cm.toFixed(2)} cm`;

  constructor(private knivesService: KnivesService) {
    this.knivesService.getKnives({ page: 0, perPage: 0 }).subscribe({
      next: (knives: KnivesList) => { this.knives = knives.data; },
      error: (error: any) => {}
    });
  }
}
