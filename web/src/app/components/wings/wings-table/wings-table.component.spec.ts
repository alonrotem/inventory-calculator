import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WingsTableComponent } from './wings-table.component';

describe('WingsTableComponent', () => {
  let component: WingsTableComponent;
  let fixture: ComponentFixture<WingsTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WingsTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WingsTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
