import { Component, EventEmitter, Input, Output } from '@angular/core';
import { KnivesService } from '../../../services/knives.service';
import { KnifeListItem, KnivesList, nameIdPair } from '../../../../types';
import { MultiPickerComponent, PickerPreview } from '../../common/multi-picker/multi-picker.component';
import { TranslationService } from '../../../i18n/translation.service';
import { TranslatePipe } from '../../../i18n/translate.pipe';
import { knifeSvgOutline } from '../knife-editor/knife-render';

@Component({
  selector: 'app-knife-picker',
  standalone: true,
  imports: [MultiPickerComponent, TranslatePipe],
  templateUrl: './knife-picker.component.html'
})
export class KnifePickerComponent {
  knives: KnifeListItem[] = [];
  private shapes: Record<number, PickerPreview | null> = {};

  @Input() disabled: boolean = true;
  @Input() multi: boolean = true;
  @Input() pickedKnives: nameIdPair[] = [];
  @Output() pickedKnivesChange = new EventEmitter<nameIdPair[]>();
  @Output() Change = new EventEmitter();

  knifeLabel = (knife: KnifeListItem): string =>
    `${knife.name} - ${this.translation.t('common:units.cm_fixed', { value: knife.width_cm })}`;

  // the shape of the knife, as in the list of knives
  knifePreview = (knife: KnifeListItem): PickerPreview | null => this.shapes[knife.id] ?? null;

  constructor(private knivesService: KnivesService, private translation: TranslationService) {
    this.knivesService.getKnives({ page: 0, perPage: 0 }, true).subscribe({
      next: (knives: KnivesList) => {
        this.shapes = Object.fromEntries(knives.data.map(k => [k.id, knifeSvgOutline(k)]));
        this.knives = knives.data;
      },
      error: (error: any) => {}
    });
  }
}
