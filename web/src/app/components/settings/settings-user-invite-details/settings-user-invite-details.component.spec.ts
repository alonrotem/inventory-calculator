import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingsUserInviteDetailsComponent } from './settings-user-invite-details.component';

describe('SettingsUserInviteDetailsComponent', () => {
  let component: SettingsUserInviteDetailsComponent;
  let fixture: ComponentFixture<SettingsUserInviteDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SettingsUserInviteDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SettingsUserInviteDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
