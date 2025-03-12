import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimesSettingsComponent } from './times-settings.component';

describe('TimesSettingsComponent', () => {
  let component: TimesSettingsComponent;
  let fixture: ComponentFixture<TimesSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TimesSettingsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TimesSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
