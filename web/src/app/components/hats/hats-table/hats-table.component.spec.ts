import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HatsTableComponent } from './hats-table.component';

describe('HatsTableComponent', () => {
  let component: HatsTableComponent;
  let fixture: ComponentFixture<HatsTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HatsTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HatsTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
