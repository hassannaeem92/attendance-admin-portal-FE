import { CanActivateFn, Router } from '@angular/router';
import { AuthenticationService } from '../authentication/authentication-service/authentication.service';
import { inject } from '@angular/core';
export const loginGuard: CanActivateFn = (route, state) => {
    const authService = inject(AuthenticationService);
    const router = inject(Router);

    // Check if the user is already logged in
    if (authService.isAuthenticated()) {
      router.navigate(['/dashboard']); // Redirect to dashboard if logged in
      return false; // Block access to the login route
    }
    return true; // Allow access to login page if not logged in
};