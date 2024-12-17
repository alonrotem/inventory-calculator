import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RawMaterialChartComponent } from './raw-material-chart.component';

describe('RawMaterialChartComponent', () => {
  let component: RawMaterialChartComponent;
  let fixture: ComponentFixture<RawMaterialChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RawMaterialChartComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RawMaterialChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
