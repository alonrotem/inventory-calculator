import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BankHistoryDialogComponent } from './bank-history-dialog.component';

describe('BankHistoryDialogComponent', () => {
  let component: BankHistoryDialogComponent;
  let fixture: ComponentFixture<BankHistoryDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BankHistoryDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BankHistoryDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
