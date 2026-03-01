import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingsUserInvitesComponent } from './settings-user-invites.component';

describe('SettingsUserInvitesComponent', () => {
  let component: SettingsUserInvitesComponent;
  let fixture: ComponentFixture<SettingsUserInvitesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SettingsUserInvitesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SettingsUserInvitesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
