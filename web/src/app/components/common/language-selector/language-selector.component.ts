import { Component } from '@angular/core';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faGlobe, IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { TranslationService } from '../../../i18n/translation.service';
import { TranslatePipe } from '../../../i18n/translate.pipe';

/** The language menu of the navbar (hidden while there is just one language). */
@Component({
  selector: 'app-language-selector',
  standalone: true,
  imports: [FaIconComponent, TranslatePipe],
  templateUrl: './language-selector.component.html',
  styleUrl: './language-selector.component.scss'
})
export class LanguageSelectorComponent {
  faGlobe: IconDefinition = faGlobe;

  constructor(protected translation: TranslationService) { }

  choose(code: string, event: Event) {
    event.preventDefault();
    this.translation.setLanguage(code);
  }
}
