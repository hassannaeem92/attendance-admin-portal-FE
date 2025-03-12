import { NgClass, NgIf, NgStyle } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { RouterLink } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';
import { OrganizationModalComponent } from '../../modals/organization-modal/organization-modal.component';
import { CompanyModalComponent } from '../../modals/company-modal/company-modal.component';
import { UserServiceService } from '../../../views/_services/user-service.service';
import { Utils } from '../../../utils';


@Component({
  selector: 'app-times-settings',
  standalone: true,
  imports: [FormsModule, NgStyle, NgIf, RouterLink, NgClass, NgSelectModule, MatDatepickerModule, MatNativeDateModule, MatFormFieldModule, MatInputModule, OrganizationModalComponent, CompanyModalComponent],
  templateUrl: './times-settings.component.html',
  styleUrl: './times-settings.component.scss'
})
export class TimesSettingsComponent implements OnInit{

  readonly utils = inject(Utils)
  readonly userService = inject(UserServiceService)

  currentUserId: any
  model: any = {};
  passwordVisible: boolean;
  confirmPasswordVisible: boolean;

  ngOnInit(): void {
    const userData = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user') as string) : null;
    this.currentUserId = userData.Id
  }

  onSubmit(f: NgForm) {
    

    if (this.model.newPassword !== this.model.confirmPassword) {
      this.utils.notification("Password does not match", 'error')
      return
    }

    const body = {
      id: this.currentUserId,
      password: this.model.newPassword
    }

    this.userService.changePassword(body).subscribe({
      next: (res) => {
        if(res){
          this.utils.notification(res.CommonMessage, 'success')
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
