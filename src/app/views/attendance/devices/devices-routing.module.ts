import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AllDevicesComponent } from './all-devices/all-devices.component';
import { AddEditDevicesComponent } from './add-edit-devices/add-edit-devices.component';
import { DeviceSettingComponent } from './device-setting/device-setting.component';

const routes: Routes = [

  {
    path: '',
    component: AllDevicesComponent
  },

  {
    path: 'add-device',
    component: AddEditDevicesComponent
  },

  {
    path: 'edit/:id',
    component: AddEditDevicesComponent
  },


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DevicesRoutingModule { }
