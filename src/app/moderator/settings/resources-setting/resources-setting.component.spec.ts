import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResourcesSettingComponent } from './resources-setting.component';

describe('ResourcesSettingComponent', () => {
  let component: ResourcesSettingComponent;
  let fixture: ComponentFixture<ResourcesSettingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ResourcesSettingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ResourcesSettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
