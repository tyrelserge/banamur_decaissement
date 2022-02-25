import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcessrequestComponent } from './processrequest.component';

describe('ProcessrequestComponent', () => {
  let component: ProcessrequestComponent;
  let fixture: ComponentFixture<ProcessrequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProcessrequestComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProcessrequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
