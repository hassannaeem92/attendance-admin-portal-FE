import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgClass, NgIf } from '@angular/common';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { NgSelectModule } from '@ng-select/ng-select';
import { OrganizationModalComponent } from '../../../_sharedresources/modals/organization-modal/organization-modal.component';
import { CompanyModalComponent } from '../../../_sharedresources/modals/company-modal/company-modal.component';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Utils } from '../../../utils';
import { LocationService } from '../../_services/location/location.service';
import { OrganizationService } from '../../_services/organization/organization.service';
import { DesignationService } from '../../_services/designation/designation.service';
import { CompanyService } from '../../_services/companies/company.service';
declare const $: any

@Component({
  selector: 'app-quick-start-register',
  standalone: true,
  imports: [FormsModule, NgIf, RouterLink, NgClass, NgSelectModule, MatDatepickerModule, MatNativeDateModule, MatFormFieldModule, MatInputModule, OrganizationModalComponent, CompanyModalComponent],
  templateUrl: './quick-start-register.component.html',
  styleUrl: './quick-start-register.component.scss'
})
export class QuickStartRegisterComponent {
intervalId: any
    readonly utils = inject(Utils);
    readonly router = inject(Router);
    readonly route = inject(ActivatedRoute);
    readonly locationService = inject(LocationService);
    readonly organizationService = inject(OrganizationService);
    readonly designationService = inject(DesignationService);
    readonly companyService = inject(CompanyService);
  
  
    requiredText: any = 'This field is required'
    startingDate = new Date();
    paramsId: any;
    mode: string = 'create';
    currentUserId: any;

    cityData: any;
    stateData: any;
    countryData: any;

    organizationData: any;
    selectedOrganization: any
    organizationArray: any = [];

    companyData: any;
    selectedCompany: any
    companyArray: any = [];


    selectedCountry: any
    countryArray: any = [];
  
    selectedState: any
    stateArray: any = [];
  
    selectedCity: any
    cityArray: any = [];

  
    ngOnInit(): void {

      // this.utils.showLoader();
      const userData = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user') as string) : null;
      this.currentUserId = userData.Id

      this.route.params.subscribe(params => {
        if(params['id']){
          // this.utils.showLoader();
          this.mode = 'edit';
          this.paramsId = params['id'];
        }
      });

      this.getAllCountry();
      this.getAllOrganization(); 
      
    }
  
    model: any = {}
  
    onSubmit(NgForm: any) {
      this.utils.showLoader();

      const body  = {
        Id: this.paramsId? this.paramsId : "",
        Name: this.model?.Name ? this.model.Name : null,
        Password: this.model?.Password ? this.model.Password : null,
        Email: this.model?.Email ? this.model.Email : null,
        UserId: this.currentUserId ? this.currentUserId : "",
        // IsActive: true,
        // OrganizationId: this.selectedOrganization?.id ?? null,
        // CompanyId: this.selectedCompany?.id ?? null,
        
      }
      
  
      this.designationService.addUserAndCompanyQuickStart(body).subscribe(res => {
        if (res && res.StatusCode == 200) {
          this.utils.notification(res.CommonMessage, 'success');
           this.router.navigate(['/main/attendance/organization/all-organization']);
           this.utils.hideLoader();
          
        }else {
          this.utils.notification(res.CommonMessage, 'error');
           this.utils.hideLoader();

        }
      }, (error) => {
        this.utils.hideLoader();

      })
    }
  
  

    getAllCountry(){
    
      this.locationService.getAllCountry().subscribe(res => {
        if(res && res.StatusCode == 200){
          
          this.countryData = res.Result;
  
          this.countryArray = this.countryData.map((item: any) => ({
            id: item.countryId,
            name: item.name
          }));
  
  
        }
  
        this.utils.hideLoader();
  
      })
    }
  
    
    getAllState(countryId: any){
      
      this.locationService.getAllState(countryId).subscribe(res => {
        if(res && res.StatusCode == 200){
          
          this.stateData = res.Result;
  
          this.stateArray = this.stateData.map((item: any) => ({
            id: item.stateId,
            name: item.name
          }));
  
        }
        this.utils.hideLoader();
      })
    }
  
    getAllCity(){
      
      this.locationService.getAllCity(this.selectedCountry.id, this.selectedState.id).subscribe(res => {
        if(res && res.StatusCode == 200){
          
          this.cityData = res.Result;
  
          this.cityArray = this.cityData.map((item: any) => ({
            id: item.cityId,
            name: item.name
          }));
  
        }
        this.utils.hideLoader();
      })
    }

    getAllOrganization(){
      
      this.organizationService.getAllOrganizationDrop().subscribe(res => {
        if(res && res.StatusCode == 200){
          
          this.organizationData = res.Result;
  
          this.organizationArray = this.organizationData.map((item: any) => ({
            id: item.Id,
            name: item.Name
          }));
  
          this.getById(this.paramsId);


        }
        this.utils.hideLoader();
      })
    }
  
    getById(id: any){
      const body = {
        id: id
      }
      this.designationService.getDesignationById(body).subscribe(res => {
        if (res && res.StatusCode == 200) {
          this.model = res.Result;
          this.model.departmentName = res.Result.Name ? res.Result.Name : '';
          this.model.description = res.Result.Description ? res.Result.Description : '';
          
          this.selectedOrganization = this.organizationArray.find((x) => x.id === res.Result.OrganizationId);
          this.onOrganizationChange(this.selectedOrganization.id);

          
        }
      })
    }
  
  
    onClear() {
      // Logic for clearing the form
      this.model = {};
      
    }
  
    onCountryChange(){
      if(this.selectedCountry){
        this.getAllState(this.selectedCountry.id);
      }
    }
  
    onOrganizationChange(id: any){
      this.selectedCompany = null;
      this.companyService.getAllCompanysDrop(id).subscribe(res => {
        if (res && res.StatusCode == 200) {
          this.companyData = res.Result;
          var filteredRows = this.companyData.filter(row => row.IsActive);
          this.companyArray = filteredRows.map((item: any) => ({
            id: item.Id,
            name: item.Name
          }));
        }
        this.selectedCompany = this.companyArray.find((x) => x.id === res.Result.CompanyId);
      })
    }

    onStateChange(){
      if(this.selectedCountry && this.selectedState){
        this.getAllCity();
      }
    }

    createOrganization() {
      $('#organization-modal').modal('show');
    }
  
    createCompany() {
      $('#company-modal').modal('show');
    }
  
}
