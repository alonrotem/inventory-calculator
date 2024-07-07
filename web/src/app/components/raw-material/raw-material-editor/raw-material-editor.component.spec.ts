import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RawMaterialEditorComponent } from './raw-material-editor.component';

describe('RawMaterialEditorComponent', () => {
  let component: RawMaterialEditorComponent;
  let fixture: ComponentFixture<RawMaterialEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RawMaterialEditorComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RawMaterialEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
