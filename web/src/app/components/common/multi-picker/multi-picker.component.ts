import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgSelectComponent, NgSelectModule } from '@ng-select/ng-select';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { IconDefinition } from '@fortawesome/fontawesome-common-types';
import { faX } from '@fortawesome/free-solid-svg-icons';
import { nameIdPair } from '../../../../types';

/**
 * A generic picker for several items out of a list: the picked items are shown as removable tags,
 * and an "add" button opens a dropdown with the items that are not picked yet.
 * Wrap it to bind it to a specific item type (see CustomerPickerComponent).
 */
@Component({
  selector: 'app-multi-picker',
  standalone: true,
  imports: [FormsModule, NgSelectModule, FaIconComponent],
  templateUrl: './multi-picker.component.html',
  styleUrl: './multi-picker.component.scss'
})
export class MultiPickerComponent<T extends nameIdPair = nameIdPair> implements OnChanges {
  // all the items that can be picked
  @Input() items: T[] = [];
  @Input() pickedItems: nameIdPair[] = [];
  @Input() disabled: boolean = true;
  // when false, the add button is hidden once an item is picked
  @Input() multi: boolean = true;
  @Input() addButtonText: string = '+ Add';
  @Input() placeholder: string = 'Pick an item';
  // the text shown for an item, in the dropdown and in the picked tags. Defaults to the item's name
  @Input() itemLabel: (item: T) => string = item => item.name;
  @Output() pickedItemsChange = new EventEmitter<nameIdPair[]>();
  @Output() Change = new EventEmitter();

  @ViewChild("item_select") item_select!: NgSelectComponent;

  // the items offered in the ng-select: all items except the picked ones.
  // Kept as a field (not a getter) so ng-select doesn't get a new array on every change detection.
  availableItems: T[] = [];

  faX: IconDefinition = faX;

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
        this.user_message = `${picked.name} is already picked`;
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
