import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AllEmployeesComponent } from './all-employees/all-employees.component';
import { AddEditEmployeeComponent } from './add-edit-employee/add-edit-employee.component';
import { QuickStartRegisterComponent } from './quick-start-register/quick-start-register.component';
import { DeviceSettingComponent } from './devices/device-setting/device-setting.component';

const routes: Routes = [
  
  {
    path: 'all-employee',
    component: AllEmployeesComponent
  },
  {
    path: 'add-employee',
    component: AddEditEmployeeComponent
  },
    {
      path: 'department',
      loadChildren: () => import('./department/department.module').then(m => m.DepartmentModule),
      data: {
        title: $localize`Department`
      }
    },


    // {
    //   path: 'organization',
    //   loadChildren: () => import('./organization/organization.module').then(m => m.OrganizationModule),
    // },

    // {
    //   path: 'company',
    //   loadChildren: () => import('./company/company.module').then(m => m.CompanyModule),
    // },

    {
      path: 'device',
      loadChildren: () => import('./devices/devices.module').then(m => m.DevicesModule),
      data: {
        title: $localize`Device`
      }
    },

    {
      path: 'organization',
      loadChildren: () => import('./organization/organization.module').then(m => m.OrganizationModule),
      data: {
        title: $localize`Company`
      }
    },

    {
      path: 'company',
      loadChildren: () => import('./company/company.module').then(m => m.CompanyModule),
      data: {
        title: $localize`Client Company`
      }
    },

    {
      path: 'location',
      loadChildren: () => import('./location/location.module').then(m => m.LocationModule),
      data: {
        title: $localize`Location`
      }
    },

    {
      path: 'timezone',
      loadChildren: () => import('./timezone/timezone.module').then(m => m.TimezoneModule),
      data: {
        title: $localize`Time Zone`
      }
    },

    {
      path: 'designation',
      loadChildren: () => import('./designation/designation.module').then(m => m.DesignationModule),
      data: {
        title: $localize`Designation`
      }
    },

    {
      path: 'company-location',
      loadChildren: () => import('./organization-location/organization-location.module').then(m => m.OrganizationLocationModule),
      data: {
        title: $localize`Company Location`
      }
    },

    {
      path: 'client-company-location',
      loadChildren: () => import('./company-location/company-location.module').then(m => m.CompanyLocationModule),
      data: {
        title: $localize`Client Company Location`
      }
    },

    {
      path: 'shift',
      loadChildren: () => import('./shift-setup/shift-setup.module').then(m => m.ShiftSetupModule),
      data: {
        title: $localize`Shift`
      }
    },

    {
      path: 'shift-assign',
      loadChildren: () => import('./shift-asign-setup/shift-asign-setup.module').then(m => m.ShiftAsignSetupModule),
      data: {
        title: $localize`Shift Assign`
      }
    },

    {
      path: 'holiday',
      loadChildren: () => import('./holiday-setup/holiday-setup.module').then(m => m.HolidaySetupModule),
      data: {
        title: $localize`Holiday`
      }
    },

 

  
    {
      path: 'off-day',
      loadChildren: () => import('./off-day-setup/off-day-setup.module').then(m => m.OffDaySetupModule),
      data: {
        title: $localize`Off Day`
      }
    },

    {
      path: '',
      loadChildren: () => import('./reports/reports.module').then(m => m.ReportsModule),
      // data: {
      //   title: $localize``
      // }
    },


    {
      path: 'quick-register',
      component: QuickStartRegisterComponent
    },


    {
      path: 'device-setting',
      component: DeviceSettingComponent,
      data: {
        title: $localize`Device Setting`
      }
    }


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AttendanceRoutingModule { }
