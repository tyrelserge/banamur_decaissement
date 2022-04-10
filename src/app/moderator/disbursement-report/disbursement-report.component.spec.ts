import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisbursementReportComponent } from './disbursement-report.component';

describe('DisbursementReportComponent', () => {
  let component: DisbursementReportComponent;
  let fixture: ComponentFixture<DisbursementReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DisbursementReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DisbursementReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
