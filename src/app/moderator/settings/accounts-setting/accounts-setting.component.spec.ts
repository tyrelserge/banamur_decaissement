import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountsSettingComponent } from './accounts-setting.component';

describe('AccountsSettingComponent', () => {
  let component: AccountsSettingComponent;
  let fixture: ComponentFixture<AccountsSettingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AccountsSettingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountsSettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
