import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RawMaterialHistoryDialogComponent } from './raw-material-history-dialog.component';

describe('RawMaterialHistoryDialogComponent', () => {
  let component: RawMaterialHistoryDialogComponent;
  let fixture: ComponentFixture<RawMaterialHistoryDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RawMaterialHistoryDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RawMaterialHistoryDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
