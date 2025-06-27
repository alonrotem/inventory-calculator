import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingsUiComponent } from './settings-ui.component';

describe('SettingsUiComponent', () => {
  let component: SettingsUiComponent;
  let fixture: ComponentFixture<SettingsUiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SettingsUiComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SettingsUiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
