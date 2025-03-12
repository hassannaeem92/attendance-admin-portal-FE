import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AllDepartmentsComponent } from './all-departments/all-departments.component';
import { AddEditDepartmentComponent } from './add-edit-department/add-edit-department.component';

const routes: Routes = [

  {
    path: '',
    component: AllDepartmentsComponent
  },

  {
    path: 'add-department',
    component: AddEditDepartmentComponent
  },

  {
    path: 'edit/:id',
    component: AddEditDepartmentComponent
  }


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DepartmentRoutingModule { }
