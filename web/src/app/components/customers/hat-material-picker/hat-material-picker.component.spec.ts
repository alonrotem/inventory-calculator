import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HatMaterialPickerComponent } from './hat-material-picker.component';

describe('HatMaterialPickerComponent', () => {
  let component: HatMaterialPickerComponent;
  let fixture: ComponentFixture<HatMaterialPickerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HatMaterialPickerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HatMaterialPickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
