import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HatsCalculatorComponent } from './hats-calculator-dialog.component';

describe('HatsCalculatorComponent', () => {
  let component: HatsCalculatorComponent;
  let fixture: ComponentFixture<HatsCalculatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HatsCalculatorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HatsCalculatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
