import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KnivesTableComponent } from './knives-table.component';

describe('KnivesTableComponent', () => {
  let component: KnivesTableComponent;
  let fixture: ComponentFixture<KnivesTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KnivesTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KnivesTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
