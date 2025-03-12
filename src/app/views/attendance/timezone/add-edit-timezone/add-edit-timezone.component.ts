import { NgClass, NgIf } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';
import { OrganizationModalComponent } from '../../../../_sharedresources/modals/organization-modal/organization-modal.component';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Utils } from '../../../../utils';
import { OrganizationService } from '../../../_services/organization/organization.service';
import { TimezoneService } from '../../../_services/timezone/timezone.service';

@Component({
  selector: 'app-add-edit-timezone',
  standalone: true,
  imports: [FormsModule, NgIf, RouterLink, NgClass, NgSelectModule, MatDatepickerModule, MatNativeDateModule, MatFormFieldModule, MatInputModule, OrganizationModalComponent],

  templateUrl: './add-edit-timezone.component.html',
  styleUrl: './add-edit-timezone.component.scss'
})
export class AddEditTimezoneComponent {
  intervalId: any
  readonly utils = inject(Utils);
  readonly router = inject(Router);
  readonly route = inject(ActivatedRoute);
  readonly timezoneService = inject(TimezoneService);
  // readonly timezoneService = inject(timezoneService);
  readonly organizationService = inject(OrganizationService);


  startingDate = new Date();
  paramsId: any;
  mode: string = 'create';
  currentUserId: any;

  cityData: any;
  stateData: any;
  countryData: any;
  organizationData: any;

  selectedCountry: any
  countryArray: any = [];

  selectedState: any
  stateArray: any = [];

  selectedCity: any
  cityArray: any = [];

  selectedOrganization: any
  organizationArray: any = [];

  ngOnInit(): void {

    // this.utils.showLoader();
    const userData = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user') as string) : null;
    this.currentUserId = userData.Id


    this.route.params.subscribe(params => {
      if(params['id']){
        this.mode = 'edit';
        this.paramsId = params['id'];
        this.getById(this.paramsId);
      }
    });

  }

  model: any = {}

  onSubmit(NgForm: any) {
    const body = {
      Id: this.paramsId ? this.paramsId : "",
      Name: this.model?.Name ? this.model.Name : null,
      Description: this.model?.description ? this.model.description : null,
      UserId: this.currentUserId ? this.currentUserId : "",
      IsActive: true,

    }


    this.timezoneService.addEditTimezone(body).subscribe(res => {
      if (res && res.StatusCode == 200) {
        this.utils.notification(res.CommonMessage, 'success');
        this.router.navigate(['/main/attendance/timezone/all-timezone']);

      }
    })
  }



  getById(id: any) {
    const body = {
      id: id
    }
    this.timezoneService.getTimezoneById(body).subscribe(res => {
      if (res && res.StatusCode == 200) {
        this.model = res.Result;
        
        this.model.departmentName = res.Result.Name ? res.Result.Name : '';
        this.model.description = res.Result.Description ? res.Result.Description : '';

      }
    })
  }




  onClear() {
    // Logic for clearing the form
    this.model = {};

  }



}
