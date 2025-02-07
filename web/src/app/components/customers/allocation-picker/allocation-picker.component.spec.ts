import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllocationPickerComponent } from './allocation-picker.component';

describe('AllocationPickerComponent', () => {
  let component: AllocationPickerComponent;
  let fixture: ComponentFixture<AllocationPickerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AllocationPickerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllocationPickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
