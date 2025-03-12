import { NgClass, NgIf } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { RouterLink } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';
import { UserServiceService } from '../../../views/_services/user-service.service';
import { Utils } from '../../../utils';


@Component({
  selector: 'app-forgot-password-modal',
  standalone: true,
  imports: [FormsModule, NgIf, RouterLink, NgClass, MatDatepickerModule, MatNativeDateModule, NgSelectModule, MatFormFieldModule, MatInputModule],

  templateUrl: './forgot-password-modal.component.html',
  styleUrl: './forgot-password-modal.component.scss'
})
export class ForgotPasswordModalComponent {

  readonly loginService = inject(UserServiceService);
  readonly utils = inject(Utils);

  email: any;

  onSubmit() {
    if (this.email) {
      
      this.loginService.forgotPasswordSendEmail({ Email: this.email }).subscribe({
        next: (res: any) => {
          if (res && res.StatusCode == 200) {
            this.utils.notification(res.CommonMessage, 'success');
          } else {
            this.utils.notification(res.CommonMessage, 'error');
          }
        }
      })
    } else {
      // alert('Please enter a valid email address.');
    }
  }


}
