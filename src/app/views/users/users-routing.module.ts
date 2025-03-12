import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { AllUsersComponent } from './all-users/all-users.component';
import { AddEditUsersComponent } from './add-edit-users/add-edit-users.component';
import { AttendanceViewComponent } from './attendance-view/attendance-view.component';

const routes: Routes = [
 
  {
    path: '',
    component: AllUsersComponent
  },

  {
    path: 'add-users',
    component: AddEditUsersComponent
  },

  {
    path: 'edit/:id',
    component: AddEditUsersComponent
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsersRoutingModule { }
