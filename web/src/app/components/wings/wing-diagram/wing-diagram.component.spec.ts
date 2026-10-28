import { ComponentFixture, TestBed } from '@angular/core/testing';

import { of } from 'rxjs';
import { WingDiagramComponent } from './wing-diagram.component';
import { KnivesService } from '../../../services/knives.service';

describe('WingDiagramComponent', () => {
  let component: WingDiagramComponent;
  let fixture: ComponentFixture<WingDiagramComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WingDiagramComponent],
      providers: [{ provide: KnivesService, useValue: { getKnife: () => of(null) } }]
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
