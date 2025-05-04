import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HatAllocationEditorPickerComponent } from './hat-allocation-editor-picker.component';

describe('HatAllocationEditorPickerComponent', () => {
  let component: HatAllocationEditorPickerComponent;
  let fixture: ComponentFixture<HatAllocationEditorPickerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HatAllocationEditorPickerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HatAllocationEditorPickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
