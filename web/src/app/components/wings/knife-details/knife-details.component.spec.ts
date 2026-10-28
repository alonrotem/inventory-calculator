import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KnifeDetailsComponent } from './knife-details.component';

describe('KnifeDetailsComponent', () => {
  let component: KnifeDetailsComponent;
  let fixture: ComponentFixture<KnifeDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KnifeDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KnifeDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
