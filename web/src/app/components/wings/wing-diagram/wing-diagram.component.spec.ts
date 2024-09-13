import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WingDiagramComponent } from './wing-diagram.component';

describe('WingDiagramComponent', () => {
  let component: WingDiagramComponent;
  let fixture: ComponentFixture<WingDiagramComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WingDiagramComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WingDiagramComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
