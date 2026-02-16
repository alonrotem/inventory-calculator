import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginsTableComponent } from './logins-table.component';

describe('LoginsTableComponent', () => {
  let component: LoginsTableComponent;
  let fixture: ComponentFixture<LoginsTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginsTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoginsTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
