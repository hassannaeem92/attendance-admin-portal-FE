import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AllTimezoneComponent } from './all-timezone/all-timezone.component';
import { AddEditTimezoneComponent } from './add-edit-timezone/add-edit-timezone.component';

const routes: Routes = [

   {
      path: 'all-timezone',
      component: AllTimezoneComponent
    },
  
    {
      path: 'add-timezone',
      component: AddEditTimezoneComponent
    },
  
    {
      path: 'edit/:id',
      component: AddEditTimezoneComponent
    }  

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TimezoneRoutingModule { }
