import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerBanksTableComponent } from './customer-banks-table.component';

describe('CustomerBanksTableComponent', () => {
  let component: CustomerBanksTableComponent;
  let fixture: ComponentFixture<CustomerBanksTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomerBanksTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomerBanksTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
