import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinalizeAccountComponent } from './finalize-account.component';

describe('FinalizeAccountComponent', () => {
  let component: FinalizeAccountComponent;
  let fixture: ComponentFixture<FinalizeAccountComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinalizeAccountComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FinalizeAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
