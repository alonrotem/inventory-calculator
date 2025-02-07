import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SingleHatCalculatorComponent } from './single-hat-calculator.component';

describe('SingleHatCalculatorComponent', () => {
  let component: SingleHatCalculatorComponent;
  let fixture: ComponentFixture<SingleHatCalculatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SingleHatCalculatorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SingleHatCalculatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
