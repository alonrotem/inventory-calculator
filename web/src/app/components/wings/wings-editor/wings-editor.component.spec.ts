import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WingsEditorComponent } from './wings-editor.component';

describe('WingsEditorComponent', () => {
  let component: WingsEditorComponent;
  let fixture: ComponentFixture<WingsEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WingsEditorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WingsEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
