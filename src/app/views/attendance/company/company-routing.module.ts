import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AllCompanyComponent } from './all-company/all-company.component';
import { AddEditCompanyComponent } from './add-edit-company/add-edit-company.component';

const routes: Routes = [

  {
    path: '',
    component: AllCompanyComponent
  },

  {
    path: 'add-company',
    component: AddEditCompanyComponent
  },

  {
    path: 'edit/:id',
    component: AddEditCompanyComponent
  }


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CompanyRoutingModule { }
