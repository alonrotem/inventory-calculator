import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BabyLengthModalComponent } from './baby-length-modal.component';

describe('BabyLengthModalComponent', () => {
  let component: BabyLengthModalComponent;
  let fixture: ComponentFixture<BabyLengthModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BabyLengthModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BabyLengthModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
