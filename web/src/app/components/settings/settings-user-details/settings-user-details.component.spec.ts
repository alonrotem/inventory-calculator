import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingsUserDetailsComponent } from './settings-user-details.component';

describe('SettingsUserDetailsComponent', () => {
  let component: SettingsUserDetailsComponent;
  let fixture: ComponentFixture<SettingsUserDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SettingsUserDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SettingsUserDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
