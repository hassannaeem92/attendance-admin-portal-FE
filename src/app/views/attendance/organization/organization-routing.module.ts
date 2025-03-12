import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AllOrganizationComponent } from './all-organization/all-organization.component';
import { AddEditOrganizationComponent } from './add-edit-organization/add-edit-organization.component';

const routes: Routes = [

  {
    path: 'all-organization',
    component: AllOrganizationComponent
  },

  {
    path: 'add-organization',
    component: AddEditOrganizationComponent
  },

  {
    path: 'edit/:id',
    component: AddEditOrganizationComponent
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrganizationRoutingModule { }
