import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KnifeEditorComponent } from './knife-editor.component';

describe('KnifeEditorComponent', () => {
  let component: KnifeEditorComponent;
  let fixture: ComponentFixture<KnifeEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KnifeEditorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KnifeEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
