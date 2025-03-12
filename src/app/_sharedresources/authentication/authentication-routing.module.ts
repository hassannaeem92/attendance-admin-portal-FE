import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { authGuard } from '../guards/auth.guard';
import { SignupComponent } from './signup/signup.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ResetForgetPasswordComponent } from './reset-forget-password/reset-forget-password.component';


const routes: Routes = [

  {
    path: '',
    component: LoginComponent,
    // canActivate: [authGuard]
  },

 
  {
    path: 'login',
    component: LoginComponent,
    // canActivate: [authGuard]
  },

  {
    path: 'register',
    component: SignupComponent,
    // 
  },

  {
    path: 'forgot-password',
    component: ForgotPasswordComponent,
    // 
  },


  
  



];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthenticationRoutingModule { }
