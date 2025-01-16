import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BackupDownloadComponent } from './backup-download.component';

describe('BackupDownloadComponent', () => {
  let component: BackupDownloadComponent;
  let fixture: ComponentFixture<BackupDownloadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BackupDownloadComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BackupDownloadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
