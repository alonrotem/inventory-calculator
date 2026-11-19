import { NgTemplateOutlet } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewChild, inject, DestroyRef } from '@angular/core';
import { TranslationService } from '../../../i18n/translation.service';
import { FormsModule } from '@angular/forms';
import { NgSelectComponent, NgSelectModule } from '@ng-select/ng-select';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { IconDefinition } from '@fortawesome/fontawesome-common-types';
import { faX } from '@fortawesome/free-solid-svg-icons';
import { nameIdPair } from '../../../../types';

/**
 * A small picture of an item: an SVG outline (a path and the viewBox that fits it, e.g. a knife's shape) or an image.
 * It is shown next to the item in the dropdown and in the picked tag, and larger in the floating preview when the mouse is on an item.
 */
export interface PickerPreview {
  d?: string;
  viewBox?: string;
  imageUrl?: string;
}

// the size of the floating preview (see the styles)
const PREVIEW_WIDTH = 240;
const PREVIEW_HEIGHT = 180;

/**
 * A generic picker for several items out of a list: the picked items are shown as removable tags,
 * and an "add" button opens a dropdown with the items that are not picked yet.
 * Wrap it to bind it to a specific item type (see CustomerPickerComponent).
 */
@Component({
  selector: 'app-multi-picker',
  standalone: true,
  imports: [FormsModule, NgSelectModule, FaIconComponent, NgTemplateOutlet],
  templateUrl: './multi-picker.component.html',
  styleUrl: './multi-picker.component.scss'
})
export class MultiPickerComponent<T extends nameIdPair = nameIdPair> implements OnChanges {
  private translation = inject(TranslationService);

  // all the items that can be picked
  @Input() items: T[] = [];
  @Input() pickedItems: nameIdPair[] = [];
  @Input() disabled: boolean = true;
  // when false, the add button is hidden once an item is picked
  @Input() multi: boolean = true;
  @Input() addButtonText: string = this.translation.t('common:picker.add');
  @Input() placeholder: string = this.translation.t('common:picker.placeholder');
  private followLanguage = this.translation.follow(inject(DestroyRef), [
    ['common:picker.add', () => this.addButtonText, text => this.addButtonText = text],
    ['common:picker.placeholder', () => this.placeholder, text => this.placeholder = text]
  ]);
  // the text shown for an item, in the dropdown and in the picked tags. Defaults to the item's name
  @Input() itemLabel: (item: T) => string = item => item.name;
  // the picture of an item (null: none). Items with one show it in the dropdown, in the picked tag and in a floating preview on hover
  @Input() itemPreview: (item: T) => PickerPreview | null = () => null;
  // the item under the mouse in the dropdown (null when the mouse leaves it or the dropdown closes), for whoever wants to show more
  @Output() itemHover = new EventEmitter<T | null>();
  @Output() pickedItemsChange = new EventEmitter<nameIdPair[]>();
  @Output() Change = new EventEmitter();

  @ViewChild("item_select") item_select!: NgSelectComponent;

  // the items offered in the ng-select: all items except the picked ones.
  // Kept as a field (not a getter) so ng-select doesn't get a new array on every change detection.
  availableItems: T[] = [];

  faX: IconDefinition = faX;

  // the item under the mouse in the dropdown, and where its floating preview goes (screen pixels)
  hoveredItem: T | null = null;
  hoverPosition: { left: number; top: number } = { left: 0, top: 0 };

  picking: boolean = false;
  user_message: string = "";

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['items'] || changes['pickedItems']) {
      this.updateAvailableItems();
    }
  }

  updateAvailableItems() {
    const pickedIds = new Set((this.pickedItems ?? []).map(i => i.id));
    this.availableItems = (this.items ?? []).filter(i => !pickedIds.has(i.id));
  }

  // a picked item holds only its id and name, so the label comes from the full item when it's loaded
  pickedLabel(picked: nameIdPair): string {
    const item = this.items?.find(i => i.id == picked.id);
    return item ? this.itemLabel(item) : picked.name;
  }

  // a picked item holds only its id and name, so its picture comes from the full item as well
  pickedPreview(picked: nameIdPair): PickerPreview | null {
    const item = this.items?.find(i => i.id == picked.id);
    return item ? this.itemPreview(item) : null;
  }

  /** The mouse is on an item of the dropdown, or left it (item null, no event). */
  hoverItem(item: T | null, event?: MouseEvent) {
    this.hoveredItem = item;
    if (item && event) {
      // beside the dropdown, so it doesn't cover the list; on the other side when there is no room
      const option = event.currentTarget as HTMLElement;
      const panel = (option.closest('.ng-dropdown-panel') as HTMLElement | null)?.getBoundingClientRect() ?? option.getBoundingClientRect();
      const row = option.getBoundingClientRect();
      const gap = 8;
      let left = panel.right + gap;
      if (left + PREVIEW_WIDTH > window.innerWidth - 4) {
        left = Math.max(4, panel.left - gap - PREVIEW_WIDTH);
      }
      const top = Math.min(Math.max(4, row.top + row.height / 2 - PREVIEW_HEIGHT / 2), Math.max(4, window.innerHeight - PREVIEW_HEIGHT - 4));
      this.hoverPosition = { left, top };
    }
    this.itemHover.emit(item);
  }

  pick() {
    this.user_message = "";
    this.picking = true;
    // the ng-select is hidden (d-none) until the next change detection, so focus and open it after that
    setTimeout(() => {
      this.item_select.focus();
      this.item_select.open();
    });
  }

  itemPicked(picked: T) {
    if (!this.pickedItems) {
      this.pickedItems = [];
    }
    if (picked) {
      if (!this.pickedItems.find(i => i.id == picked.id)) {
        this.pickedItems.push({ id: picked.id, name: picked.name });
        this.updateAvailableItems();
        this.item_select.handleClearClick();
        this.picking = false;
        this.pickedItemsChange.emit(this.pickedItems);
        this.Change.emit();
      }
      else {
        this.user_message = this.translation.t('common:picker.already_picked', { name: picked.name });
      }
    }
  }

  removeItem(id: number) {
    if (!this.pickedItems) {
      this.pickedItems = [];
    }
    const index: number = this.pickedItems.findIndex(i => i.id == id);
    if (index !== -1) {
      this.pickedItems.splice(index, 1);
      this.updateAvailableItems();
      this.pickedItemsChange.emit(this.pickedItems);
      this.Change.emit();
    }
  }
}
