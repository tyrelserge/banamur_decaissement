import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BrowserequestComponent } from './browserequest.component';

describe('BrowserequestComponent', () => {
  let component: BrowserequestComponent;
  let fixture: ComponentFixture<BrowserequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BrowserequestComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BrowserequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
