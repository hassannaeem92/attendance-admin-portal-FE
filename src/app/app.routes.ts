import { Routes } from '@angular/router';
import { DefaultLayoutComponent } from './layout';
import { authGuard } from './_sharedresources/guards/auth.guard';
import { loginGuard } from './_sharedresources/guards/login.guard';
import { ResetForgetPasswordComponent } from './_sharedresources/authentication/reset-forget-password/reset-forget-password.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'auth/login',
    pathMatch: 'full'
  },
  {
    path: '',
    component: DefaultLayoutComponent,
    data: {
      title: 'Home'
    },
    children: [
    
      {
          path: '',
          redirectTo: 'dashboard',
          pathMatch: 'full', // Ensures exact match for redirection
      },
      
      {
        path: 'dashboard',
        loadChildren: () => import('./views/dashboard/routes').then((m) => m.routes),
        canActivate: [authGuard]

      },

      {
        path: 'main',
        loadChildren: () => import('./views/view_routes').then((m) => m.view_routes),
        canActivate: [authGuard]

      },

    
    ]
  },
 

  {
    path: 'auth',
    loadChildren: () => import('./_sharedresources/authentication/authentication.module').then(m => m.AuthenticationModule),
    canActivate: [loginGuard]
  },

  {
    path: 'ResetPassword',
    component: ResetForgetPasswordComponent
  }

];
