import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RawMaterialQuantityDialogComponent } from './raw-material-quantity-dialog.component';

describe('RawMaterialQuantityDialogComponent', () => {
  let component: RawMaterialQuantityDialogComponent;
  let fixture: ComponentFixture<RawMaterialQuantityDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RawMaterialQuantityDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RawMaterialQuantityDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
