import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RawMaterialDialogComponent } from './raw-material-dialog.component';

describe('RawMaterialDialogComponent', () => {
  let component: RawMaterialDialogComponent;
  let fixture: ComponentFixture<RawMaterialDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RawMaterialDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RawMaterialDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
