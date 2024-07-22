import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BabyEditorDialogComponent } from './baby-editor-dialog.component';

describe('BabyEditorDialogComponent', () => {
  let component: BabyEditorDialogComponent;
  let fixture: ComponentFixture<BabyEditorDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BabyEditorDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BabyEditorDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
