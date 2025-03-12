import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AllCompanyLocationComponent } from './all-company-location/all-company-location.component';
import { AddEditCompanyLocationComponent } from './add-edit-company-location/add-edit-company-location.component';

const routes: Routes = [

     {
          path: '',
          component: AllCompanyLocationComponent
        },
      
        {
          path: 'add',
          component: AddEditCompanyLocationComponent
        },
      
        {
          path: 'edit/:id',
          component: AddEditCompanyLocationComponent
        }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CompanyLocationRoutingModule { }
