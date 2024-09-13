import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HatsEditorComponent } from './hats-editor.component';

describe('HatsEditorComponent', () => {
  let component: HatsEditorComponent;
  let fixture: ComponentFixture<HatsEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HatsEditorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HatsEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
