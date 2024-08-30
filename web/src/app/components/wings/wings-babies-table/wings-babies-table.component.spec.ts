import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WingsBabiesTableComponent } from './wings-babies-table.component';

describe('WingsBabiesTableComponent', () => {
  let component: WingsBabiesTableComponent;
  let fixture: ComponentFixture<WingsBabiesTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WingsBabiesTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WingsBabiesTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
