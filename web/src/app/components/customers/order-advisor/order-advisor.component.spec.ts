import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderAdvisorComponent } from './order-advisor.component';

describe('OrderAdvisorComponent', () => {
  let component: OrderAdvisorComponent;
  let fixture: ComponentFixture<OrderAdvisorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrderAdvisorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrderAdvisorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
