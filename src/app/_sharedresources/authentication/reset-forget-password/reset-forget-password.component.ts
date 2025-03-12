import { Component, inject, Renderer2 } from '@angular/core';
import { ForgotPasswordModalComponent } from '../../modals/forgot-password-modal/forgot-password-modal.component';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';
import { NgClass, NgIf, NgStyle } from '@angular/common';
import { AuthenticationService } from '../authentication-service/authentication.service';
import { Utils } from '../../../utils';
import { ThemeService } from 'ng2-charts';
import { UserServiceService } from '../../../views/_services/user-service.service';
import { NgSelectModule } from '@ng-select/ng-select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatNativeDateModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-reset-forget-password',
  standalone: true,
  imports: [FormsModule, NgStyle, NgIf, RouterLink, NgClass, NgSelectModule, MatDatepickerModule, MatNativeDateModule, MatFormFieldModule, MatInputModule],
  templateUrl: './reset-forget-password.component.html',
  styleUrl: './reset-forget-password.component.scss'
})
export class ResetForgetPasswordComponent {

  readonly utils = inject(Utils)
  readonly route = inject (ActivatedRoute)
  readonly router = inject (Router)
  readonly userService = inject(UserServiceService)

  currentUserId: any
  paramsId: any;
  model: any = {};
  passwordVisible = false;
  confirmPasswordVisible = false


  ngOnInit(): void {
    // const userData = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user') as string) : null;
    // this.currentUserId = userData.Id

    this.route.queryParams.subscribe(queryParams => {
      if (queryParams['id']) {
        this.paramsId = queryParams['id']; // Get 'id' from query params
        console.log('Query Param ID:', this.paramsId);
      }
    });

  }

  onSubmit(f: NgForm) {

    if (this.model.newPassword !== this.model.confirmPassword) {
      this.utils.notification("Password does not match", 'error')
      return
    }

    const body = {
      id: this.paramsId,
      password: this.model.newPassword
    }

    this.userService.changePassword(body).subscribe({
      next: (res) => {
        if(res){
          this.utils.notification(res.CommonMessage, 'success')
          this.router.navigate(['/auth/login'])
        }
      },
      error: (err) => {
        console.error(err);
        this.utils.notification('Failed to change password', 'error');
      }
    })

  }

  togglePasswordVisibility() {
    this.passwordVisible = !this.passwordVisible;

  }

  toggleConfirmPasswordVisibility() {
    this.confirmPasswordVisible = !this.confirmPasswordVisible;

  }

}
