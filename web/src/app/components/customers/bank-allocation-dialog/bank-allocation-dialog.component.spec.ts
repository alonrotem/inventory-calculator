import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BankAllocationDialogComponent } from './bank-allocation-dialog.component';

describe('BankAllocationDialogComponent', () => {
  let component: BankAllocationDialogComponent;
  let fixture: ComponentFixture<BankAllocationDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BankAllocationDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BankAllocationDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
