import { Component, inject, Renderer2 } from '@angular/core';
import { NgClass, NgStyle } from '@angular/common';
import { IconDirective } from '@coreui/icons-angular';
import { ContainerComponent, RowComponent, ColComponent, CardGroupComponent, TextColorDirective, CardComponent, CardBodyComponent, FormDirective, InputGroupComponent, InputGroupTextDirective, FormControlDirective, ButtonDirective } from '@coreui/angular';
import { FormsModule, NgForm } from '@angular/forms';
import { AuthenticationService } from '../authentication-service/authentication.service';
import { Utils } from '../../../utils';
import { Router, RouterLink } from '@angular/router';
import { ThemeService } from '../../_services/theme.service';
import * as cryptoJS from 'crypto-js';
import { ForgotPasswordModalComponent } from "../../modals/forgot-password-modal/forgot-password-modal.component";
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';

declare const $: any

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [NgClass, FormsModule, RouterLink, ForgotPasswordModalComponent, NgxSpinnerModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  readonly router = inject(Router);
  readonly authService = inject(AuthenticationService);
  readonly utils = inject(Utils);
  readonly renderer = inject(Renderer2);
  readonly themService = inject(ThemeService);

  private crypto: Crypto;
  passwordVisible = false;
  password: any;
  email: any;

  constructor(private spinner: NgxSpinnerService) {
    // Use the native Web Crypto API in the browser
    if (typeof window !== 'undefined' && window.crypto) {
      this.crypto = window.crypto; // Use the native crypto object
    } else {
      console.error('Web Crypto API is not supported in this environment.');
    }
  }
  ngOnInit(): void {
    // this.utils.showLoader();

  }



  onSubmit(f: NgForm) {
    this.utils.showLoader();

    this.authService.login({ Email: this.email, Password: this.password }).subscribe({
      next: async (res: any) => {
        if (res) {
          const expiresIn = res.ExpiresIn;
          const token = res.Token.Result;
          const encryptedToken = cryptoJS.AES.encrypt(token, 'simpleLogix').toString();

          // Store encrypted token and user data in localStorage
          localStorage.setItem('authToken', encryptedToken);
          localStorage.setItem('user', JSON.stringify(res.User)); // Store as JSON


          const expirationTime = new Date().getTime() + expiresIn * 1000; // Convert to milliseconds
          localStorage.setItem('tokenExpiration', expirationTime.toString());

          this.startTokenExpirationTimer(expiresIn);
          this.utils.notification('Login Successful', 'success');


          this.router.navigate(['/dashboard']);
          this.renderer.addClass(document.body, 'lightTheme');
          this.renderer.removeClass(document.body, 'darkTheme');
          this.themService.setTheme('light');
          this.utils.hideLoader();
        }else {
          this.utils.hideLoader();

          
        }
      },
      error: (err) => {
        console.error(err);
        this.utils.notification('Login Failed', 'error');
        this.utils.hideLoader();


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
    this.router.navigate(['/auth/login']);
  }
  onForgotPassword() {
    $('#forgotPasswordModal').modal('show');
  }


  togglePasswordVisibility() {
    this.passwordVisible = !this.passwordVisible;
  }
}
