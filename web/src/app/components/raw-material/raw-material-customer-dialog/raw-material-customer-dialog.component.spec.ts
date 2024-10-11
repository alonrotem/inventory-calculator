import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RawMaterialCustomerDialogComponent } from './raw-material-customer-dialog.component';

describe('RawMaterialCustomerDialogComponent', () => {
  let component: RawMaterialCustomerDialogComponent;
  let fixture: ComponentFixture<RawMaterialCustomerDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RawMaterialCustomerDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RawMaterialCustomerDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
