import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavigatedMessageComponent } from './navigated-message.component';

describe('NavigatedMessageComponent', () => {
  let component: NavigatedMessageComponent;
  let fixture: ComponentFixture<NavigatedMessageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavigatedMessageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NavigatedMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
