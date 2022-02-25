import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestoverviewComponent } from './requestoverview.component';

describe('RequestoverviewComponent', () => {
  let component: RequestoverviewComponent;
  let fixture: ComponentFixture<RequestoverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RequestoverviewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RequestoverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
