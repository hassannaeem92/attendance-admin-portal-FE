import { HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import * as cryptoJS from 'crypto-js';
import { Utils } from '../utils';
import { inject } from '@angular/core';

export const httpconfigInterceptor: HttpInterceptorFn = (req, next) => {

  // const token = localStorage.getItem('authToken');
  const tenantId = localStorage.getItem('tenantId');
  const expirationTime = localStorage.getItem('tokenExpiration');
  const currentTime = new Date().getTime();
  const utils = inject(Utils);

  const excludedApis = ['/login', '/ForgotPassword', '/ResetPassword'];

  // Check if the request URL matches any excluded API
  const isExcludedApi = excludedApis.some(api => req.url.includes(api));

  

  if (expirationTime && currentTime > +expirationTime) {
    console.error('Token has expired.');
    handleTokenExpiration(); // Handle expired token
    localStorage.clear();
    
    return throwError(() => new Error('Token expired'));
  }

  if (isExcludedApi) {
    console.log(`Skipping headers for excluded API: ${req.url}`);
    return next(req); // Pass request as-is
  }


  const encryptedToken = localStorage.getItem('authToken');
  if (encryptedToken) {
    const bytes = cryptoJS.AES.decrypt(encryptedToken, 'simpleLogix');
    var token = bytes.toString(cryptoJS.enc.Utf8);
  }else {
    return throwError(() => new Error('Token not found'));
  }


  // let modifiedRequest = req.clone({
  //   setHeaders: {
  //     ...(token ? { Authorization: `Bearer ${token}` } : {}), // Add Authorization header if token exists
  //     ...(tenantId ? { 'X-Tenant-ID': tenantId } : {}), // Add tenant header if tenantId exists
  //     'Content-Type': 'application/json', // Set content type if needed
  //   },
  // });

  const isFormData = req.body instanceof FormData;

  const modifiedRequest = req.clone({
    setHeaders: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}), // Add Authorization header if token exists
      ...(tenantId ? { 'X-Tenant-ID': tenantId } : {}), // Add tenant header if tenantId exists
      ...(isFormData ? {} : { 'Content-Type': 'application/json' }), // Set Content-Type only if not FormData
    },
  });


  // console.log(`Intercepted ${req.method} request to ${req.url}`, modifiedRequest.headers);
  return next(modifiedRequest).pipe(
    catchError((error) => {
      console.error('HTTP error:', error); // Log the error
      // Optional: handle specific error scenarios (e.g., token expiry, unauthorized)
      if (error.status === 401) {
        console.error('Unauthorized request - consider redirecting to login.');
      }
      // Re-throw the error so it can be handled further downstream
      return throwError(() => error);
    })
  );

  // return next(req);
  
};

function handleTokenExpiration() {
  localStorage.removeItem('authToken');
  localStorage.removeItem('tokenExpiration');
  window.location.href = '/#/auth/login';
}
