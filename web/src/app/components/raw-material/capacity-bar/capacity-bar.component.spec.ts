import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CapacityBarComponent } from './capacity-bar.component';

describe('CapacityBarComponent', () => {
  let component: CapacityBarComponent;
  let fixture: ComponentFixture<CapacityBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CapacityBarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CapacityBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
