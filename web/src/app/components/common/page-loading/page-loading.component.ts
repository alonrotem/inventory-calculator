import { Component, Input } from '@angular/core';
import { AnimationProp, FaIconComponent, SizeProp } from '@fortawesome/angular-fontawesome';
import { IconDefinition } from '@fortawesome/fontawesome-common-types';
import { faArrowsRotate } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-page-loading',
  standalone: true,
  imports: [ FaIconComponent ],
  templateUrl: './page-loading.component.html',
  styleUrl: './page-loading.component.scss'
})
export class PageLoadingComponent {
  @Input() loading_icon: IconDefinition = faArrowsRotate;
  @Input() loading_message = "Loading";
  @Input() animation : AnimationProp | undefined = 'spin';
  @Input() stretch_height: boolean = false;
  @Input() icon_size: SizeProp = '3x';
}
