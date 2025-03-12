import { Injectable } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthenticationService } from '../authentication/authentication-service/authentication.service';

export const authGuard: CanActivateFn = async (route, state) => {
  const router = inject(Router);
  const authService = inject(AuthenticationService);

  // Validate session asynchronously
  if (!await authService.isAuthenticated()) {
    // Redirect to login if the session is invalid
    await router.navigate(['/login']);
    window.location.reload();
    return false;
  }else{
    // await router.navigate(['/dashboard']);
    
  }

  // Return true to allow navigation
  return true;
};
