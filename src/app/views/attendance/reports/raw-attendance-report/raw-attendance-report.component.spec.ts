import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RawAttendanceReportComponent } from './raw-attendance-report.component';

describe('RawAttendanceReportComponent', () => {
  let component: RawAttendanceReportComponent;
  let fixture: ComponentFixture<RawAttendanceReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RawAttendanceReportComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RawAttendanceReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
