import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingsBackupComponent } from './settings-backup.component';

describe('SettingsBackupComponent', () => {
  let component: SettingsBackupComponent;
  let fixture: ComponentFixture<SettingsBackupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SettingsBackupComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SettingsBackupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
