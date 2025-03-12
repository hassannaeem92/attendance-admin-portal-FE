import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AllEmployeesComponent } from './attendance/all-employees/all-employees.component';
import { TimesSettingsComponent } from '../_sharedresources/authentication/times-settings/times-settings.component';
import { AttendanceViewComponent } from './users/attendance-view/attendance-view.component';
import { UserProfileComponent } from './users/user-profile/user-profile.component';
// import { TimesSettingsComponent } from './times-settings/times-settings.component';

export const view_routes: Routes = [


  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full'
  },

  {
    path: 'attendance',
    loadChildren: () => import('./attendance/attendance-routing.module').then((m) => m.AttendanceRoutingModule),
    // data: {
    //   title: $localize`Attendance`
    // }
  },

  {
    path: 'user',
    loadChildren: () => import('../views/users/users-routing.module').then((m) => m.UsersRoutingModule),
    data: {
      title: $localize`User`
    }
  },

  {
    path: 'setting',
    component: TimesSettingsComponent,
    data: {
      title: $localize`Settings`
    }
  },

   {
      path: 'attendance-view',
      component: AttendanceViewComponent,
      data: {
        title: $localize`Attendance View`
      }
    },

    {
      path: 'profile',
      component: UserProfileComponent
    },


];

