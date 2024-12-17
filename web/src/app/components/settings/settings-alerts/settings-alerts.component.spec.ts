import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingsAlertsComponent } from './settings-alerts.component';

describe('SettingsAlertsComponent', () => {
  let component: SettingsAlertsComponent;
  let fixture: ComponentFixture<SettingsAlertsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SettingsAlertsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SettingsAlertsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
