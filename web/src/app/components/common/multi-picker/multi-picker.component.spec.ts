import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MultiPickerComponent } from './multi-picker.component';

describe('MultiPickerComponent', () => {
  let component: MultiPickerComponent;
  let fixture: ComponentFixture<MultiPickerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MultiPickerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MultiPickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should offer only the items that are not picked', () => {
    component.items = [{ id: 1, name: 'a' }, { id: 2, name: 'b' }];
    component.pickedItems = [{ id: 1, name: 'a' }];
    component.ngOnChanges({ items: {} as any });
    expect(component.availableItems.map(i => i.id)).toEqual([2]);

    component.removeItem(1);
    expect(component.availableItems.map(i => i.id)).toEqual([1, 2]);
  });
});
