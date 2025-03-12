import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment.development';
import { GlobalApiCallService } from '../../_services/global-api-call.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  readonly globalApiService = inject(GlobalApiCallService);
  readonly router = inject(Router);
  
  private validateSessionUrl = environment.userModuleApiBaseUrl + 'login/checkSession';
  private loginApiUrl = environment.userModuleApiBaseUrl + 'Account/login';
  private SignUpApiUrl = environment.userModuleApiBaseUrl + 'Account/AddEditUser';
  private getOrganizationDetailUrl = environment.userModuleApiBaseUrl + 'Organization/GetOrganizationById';
  

  
  userProfile: any;

  constructor(private httpClient: HttpClient) { }



  login(body) {
    return this.globalApiService.postRequest(this.loginApiUrl, body);
  }

  registerUser(body) {
    return this.globalApiService.postRequest(this.SignUpApiUrl, body);
  }


  getOrganizationDetail(body){
    return this.globalApiService.getRequest(this.getOrganizationDetailUrl, body);

  }

  getToken() {
    return localStorage.getItem('authToken');
  }

  getTenantId() {
    const token = this.getToken();
    if (!token) return null;

    const payload = JSON.parse(atob(token.split('.')[1])); // Decode JWT
    return payload.tenant_id;
  }

  getRole() {
    const token = this.getToken();
    if (!token) return null;

    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.role;
  }

  logout() {
    localStorage.removeItem('authToken');
    this.router.navigate(['/login']);
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  async validateSession(): Promise<boolean> {
    let newHeaders = new HttpHeaders();
    const userData = localStorage.getItem('currentUser') 
      ? JSON.parse(localStorage.getItem('currentUser') as string) 
      : { session: '', userId: '' };

    newHeaders = newHeaders
      .append('session', userData.session)
      .append('content-type', 'application/json')
      .append('userid', userData.userId.toString());

    try {
      const response: any = await this.httpClient
        .get(this.validateSessionUrl, { headers: newHeaders })
        .toPromise();

      if (response.code === 200) {
        if (response.result) {
          this.userProfile = response.result;
        }
        return true;
      } else if (response.code === 404) {
        return false;
      } else {
        // Handle unexpected response codes
        return false;
      }
    } catch (error) {
      console.error('Error validating session:', error);
      return false; // Return false in case of an error
    }
  }
}
