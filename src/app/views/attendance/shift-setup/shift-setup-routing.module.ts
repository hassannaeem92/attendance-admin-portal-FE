import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AllShiftComponent } from './all-shift/all-shift.component';
import { AddEditShiftComponent } from './add-edit-shift/add-edit-shift.component';

const routes: Routes = [

  {
            path: '',
            component: AllShiftComponent
          },
        
          {
            path: 'add',
            component: AddEditShiftComponent
          },
        
          {
            path: 'edit/:id',
            component: AddEditShiftComponent
          }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ShiftSetupRoutingModule { }
