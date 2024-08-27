import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BabiesLengthPickerComponent } from './babies-length-picker.component';

describe('BabiesLengthPickerComponent', () => {
  let component: BabiesLengthPickerComponent;
  let fixture: ComponentFixture<BabiesLengthPickerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BabiesLengthPickerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BabiesLengthPickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
