import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RawAttendanceReportComponent } from './raw-attendance-report/raw-attendance-report.component';
import { AttendanceCalendarComponent } from './attendance-calendar/attendance-calendar.component';

const routes: Routes = [

  {
    path: 'raw-attendance',
    component: RawAttendanceReportComponent,
    data: {
      title: $localize`Raw Attendance`
    }
  },

  {
    path: 'attendance-calendar',
    component: AttendanceCalendarComponent,
    data: {
      title: $localize`Attendance Calendar`
    }
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportsRoutingModule { }
