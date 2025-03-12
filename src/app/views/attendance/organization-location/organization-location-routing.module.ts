import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AllOrganizationLocationComponent } from './all-organization-location/all-organization-location.component';
import { AddEditOrganizationLocationComponent } from './add-edit-organization-location/add-edit-organization-location.component';

const routes: Routes = [

    {
        path: '',
        component: AllOrganizationLocationComponent
      },
    
      {
        path: 'add',
        component: AddEditOrganizationLocationComponent
      },
    
      {
        path: 'edit/:id',
        component: AddEditOrganizationLocationComponent
      }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrganizationLocationRoutingModule { }
