import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AllHolidayComponent } from './all-holiday/all-holiday.component';
import { AddEditHolidayComponent } from './add-edit-holiday/add-edit-holiday.component';

const routes: Routes = [

    {
      path: '',
      component: AllHolidayComponent
    },
  
    {
      path: 'add',
      component: AddEditHolidayComponent
    },
  
    {
      path: 'edit/:id',
      component: AddEditHolidayComponent
    }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HolidaySetupRoutingModule { }
