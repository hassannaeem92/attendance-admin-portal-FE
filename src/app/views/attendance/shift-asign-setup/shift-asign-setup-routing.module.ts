import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AllShiftAsignComponent } from './all-shift-asign/all-shift-asign.component';
import { AddEditShiftAsignComponent } from './add-edit-shift-asign/add-edit-shift-asign.component';

const routes: Routes = [

  {
          path: '',
          component: AllShiftAsignComponent
        },
      
        {
          path: 'add',
          component: AddEditShiftAsignComponent
        },
      
        {
          path: 'edit/:id',
          component: AddEditShiftAsignComponent
        }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ShiftAsignSetupRoutingModule { }
