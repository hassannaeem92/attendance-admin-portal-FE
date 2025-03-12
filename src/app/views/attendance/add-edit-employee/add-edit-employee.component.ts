import { NgClass, NgIf } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ColorModeService } from '@coreui/angular';
import { ThemeService } from '../../../_sharedresources/_services/theme.service';
import { Utils } from '../../../utils';
import { MatFormField, MatFormFieldControl, MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepicker, MatDatepickerModule, MatDatepickerToggle } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-add-edit-employee',
  standalone: true,
  imports: [FormsModule, NgIf, RouterLink, NgClass, MatDatepickerModule, MatNativeDateModule, MatFormFieldModule, MatInputModule],
  templateUrl: './add-edit-employee.component.html',
  styleUrl: './add-edit-employee.component.scss'
})
export class AddEditEmployeeComponent {
  intervalId: any
  readonly utils = inject(Utils);
  startingDate = new Date();

  ngOnInit(): void {

  }

  model: any = {}

  onSubmit(NgForm: any) {

  }

  onClear() {
    // Logic for clearing the form
    this.model = {};
    
  }

  onSave() {
    // Logic for saving
    // console.log("Form saved", th);
  }

}
