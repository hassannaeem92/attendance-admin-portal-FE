import { Component, inject, Renderer2 } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthenticationService } from '../authentication-service/authentication.service';
import { Utils } from '../../../utils';
import { ThemeService } from 'ng2-charts';
import { FormsModule, NgForm } from '@angular/forms';
import { NgClass } from '@angular/common';
import { ForgotPasswordModalComponent } from '../../modals/forgot-password-modal/forgot-password-modal.component';
import { UserServiceService } from '../../../views/_services/user-service.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [NgClass, FormsModule, RouterLink, ForgotPasswordModalComponent],

  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.scss'
})
export class ForgotPasswordComponent {
  
    readonly router = inject(Router);
    readonly authService = inject(AuthenticationService);
    readonly utils = inject(Utils);
    readonly renderer = inject(Renderer2);
    readonly themService = inject(ThemeService);
    readonly userService = inject(UserServiceService);
  
    private crypto: Crypto;
    passwordVisible = false;
    password: any;
    email: any;
    
    constructor() {
      // Use the native Web Crypto API in the browser
      if (typeof window !== 'undefined' && window.crypto) {
        this.crypto = window.crypto; // Use the native crypto object
      } else {
        console.error('Web Crypto API is not supported in this environment.');
      }
    }
    ngOnInit(): void {
      
    }
  
    onSubmit(f: NgForm) {
      
      this.userService.forgotPasswordSendEmail({email: this.email}).subscribe({
        next: async (res: any) => {
          if (res) {
            this.utils.notification(res.CommonMessage, 'success');
          }else {
            this.utils.notification(res.CommonMessage, 'error');
          }
        },
        error: (err) => {
          console.error(err);
          this.utils.notification('Failed to send email', 'error');
        },
      });
    }

   
  
  
  
  startTokenExpirationTimer(expiresIn: number) {
      const timeout = expiresIn * 1000 - 5000; // 5 seconds before expiration
      setTimeout(() => {
        this.utils.notification('Session expired. Please log in again.', 'error');
        this.logout(); // Clear storage and redirect to login
      }, timeout);
    }
    
    logout() {
      localStorage.removeItem('authToken');
      localStorage.removeItem('tokenExpiration');
      this.router.navigate(['/login']);
    }
    onForgotPassword(){
      // $('#forgotPasswordModal').modal('show');
    }
  
  
    togglePasswordVisibility() {
      this.passwordVisible = !this.passwordVisible;
    }
}
