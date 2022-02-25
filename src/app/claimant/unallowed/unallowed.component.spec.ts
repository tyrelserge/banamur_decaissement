import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnallowedComponent } from './unallowed.component';

describe('UnallowedComponent', () => {
  let component: UnallowedComponent;
  let fixture: ComponentFixture<UnallowedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UnallowedComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UnallowedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
