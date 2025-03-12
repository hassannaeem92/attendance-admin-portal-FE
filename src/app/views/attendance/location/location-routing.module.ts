import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AllLocationComponent } from './all-location/all-location.component';
import { AddEditLocationComponent } from './add-edit-location/add-edit-location.component';

const routes: Routes = [

   {
      path: 'all-location',
      component: AllLocationComponent
    },
  
    {
      path: 'add-location',
      component: AddEditLocationComponent
    },
  
    {
      path: 'edit/:id',
      component: AddEditLocationComponent
    }
  

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LocationRoutingModule { }
