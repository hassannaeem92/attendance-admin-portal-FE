import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AllUsersComponent } from '../../users/all-users/all-users.component';
import { AddEditUsersComponent } from '../../users/add-edit-users/add-edit-users.component';

const routes: Routes = [
  

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsersRoutingModule { }
