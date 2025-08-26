import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrownEditorComponent } from './crown-editor.component';

describe('CrownEditorComponent', () => {
  let component: CrownEditorComponent;
  let fixture: ComponentFixture<CrownEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CrownEditorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CrownEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
