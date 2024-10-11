import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RawMaterialCustomerTableComponent } from './raw-material-customer-table.component';

describe('RawMaterialCustomerTableComponent', () => {
  let component: RawMaterialCustomerTableComponent;
  let fixture: ComponentFixture<RawMaterialCustomerTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RawMaterialCustomerTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RawMaterialCustomerTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
