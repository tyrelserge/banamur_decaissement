import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestpendingComponent } from './requestpending.component';

describe('RequestpendingComponent', () => {
  let component: RequestpendingComponent;
  let fixture: ComponentFixture<RequestpendingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RequestpendingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RequestpendingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
