import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingsUserInviteFormComponent } from './settings-user-invite-form.component';

describe('SettingsUserInviteFormComponent', () => {
  let component: SettingsUserInviteFormComponent;
  let fixture: ComponentFixture<SettingsUserInviteFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SettingsUserInviteFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SettingsUserInviteFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
