import { NgClass } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthenticationService } from '../authentication-service/authentication.service';
import { Utils } from '../../../utils';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [NgClass, FormsModule, RouterLink],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss'
})
export class SignupComponent {
  readonly authService = inject(AuthenticationService)
  readonly utils = inject(Utils)

 model: any = {};
 passwordVisible: boolean = false;
 

 onSubmit(g: NgForm){

    if(this.model.password !== this.model.confirmPassword){
      this.utils.notification('Passwords do not match', 'error');
      return
    }

    const body = {
      id: '',
      fullName: this.model.fullName,
      userName: '',
      email: this.model.email,
      password: this.model.password,
      role: "Organizer",
      isActive: true,
      // emailConfirmed: true,
      // organizationId: '',
      // companyId: '',
      // createdDate: '2024-12-06T16:28:56.983+00:00',
      // modifiedDate: '2024-12-06T16:28:56.983+00:00',
    }

    this.authService.registerUser(body).subscribe({
      next: (res) => {
        
        console.log(res);
        this.utils.notification('Registration Successful', 'success');
        // this.router.navigate(['/login']);

      },
      error: (err) => {
        console.log(err);
      }
    })
  }

  togglePasswordVisibility() {
    this.passwordVisible = !this.passwordVisible;
  }

}
