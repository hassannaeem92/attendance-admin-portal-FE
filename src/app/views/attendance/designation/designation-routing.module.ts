import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AllDesignationComponent } from './all-designation/all-designation.component';
import { AddEditDesignationComponent } from './add-edit-designation/add-edit-designation.component';

const routes: Routes = [
  {
    path: '',
    component: AllDesignationComponent
  },

  {
    path: 'add-designation',
    component: AddEditDesignationComponent
  },

  {
    path: 'edit/:id',
    component: AddEditDesignationComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DesignationRoutingModule { }
