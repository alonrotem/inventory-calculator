import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerBankTableComponent } from './customer-bank-table.component';

describe('CustomerBankTableComponent', () => {
  let component: CustomerBankTableComponent;
  let fixture: ComponentFixture<CustomerBankTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomerBankTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomerBankTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
