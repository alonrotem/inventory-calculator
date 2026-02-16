import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountRequestsListComponent } from './account-requests-list.component';

describe('AccountRequestsListComponent', () => {
  let component: AccountRequestsListComponent;
  let fixture: ComponentFixture<AccountRequestsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccountRequestsListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AccountRequestsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
