import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AllOffDayComponent } from './all-off-day/all-off-day.component';
import { AddEditOffDayComponent } from './add-edit-off-day/add-edit-off-day.component';

const routes: Routes = [

     {
        path: '',
        component: AllOffDayComponent
      },
    
      {
        path: 'add',
        component: AddEditOffDayComponent
      },
    
      {
        path: 'edit/:id',
        component: AddEditOffDayComponent
      }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OffDaySetupRoutingModule { }
