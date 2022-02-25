import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClaimantrequestComponent } from './claimantrequest.component';

describe('ClaimantrequestComponent', () => {
  let component: ClaimantrequestComponent;
  let fixture: ComponentFixture<ClaimantrequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClaimantrequestComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClaimantrequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
