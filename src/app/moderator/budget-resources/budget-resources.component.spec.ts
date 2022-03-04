import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BudgetResourcesComponent } from './budget-resources.component';

describe('BudgetResourcesComponent', () => {
  let component: BudgetResourcesComponent;
  let fixture: ComponentFixture<BudgetResourcesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BudgetResourcesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BudgetResourcesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
