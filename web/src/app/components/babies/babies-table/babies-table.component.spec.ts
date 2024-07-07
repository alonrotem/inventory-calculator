import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BabiesTableComponent } from './babies-table.component';

describe('BabiesTableComponent', () => {
  let component: BabiesTableComponent;
  let fixture: ComponentFixture<BabiesTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BabiesTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BabiesTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
