import { Component, inject } from '@angular/core';
import { Utils } from '../../../../utils';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { LocationService } from '../../../_services/location/location.service';
import { OrganizationService } from '../../../_services/organization/organization.service';
import { FormsModule } from '@angular/forms';
import { NgClass, NgIf, NgStyle } from '@angular/common';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { NgSelectModule } from '@ng-select/ng-select';
import { OrganizationModalComponent } from '../../../../_sharedresources/modals/organization-modal/organization-modal.component';
import { DesignationService } from '../../../_services/designation/designation.service';
import { CompanyModalComponent } from "../../../../_sharedresources/modals/company-modal/company-modal.component";
import { CompanyService } from '../../../_services/companies/company.service';
declare const $: any

@Component({
  selector: 'app-add-edit-designation',
  standalone: true,
  imports: [FormsModule, NgStyle, NgIf, RouterLink, NgClass, NgSelectModule, MatDatepickerModule, MatNativeDateModule, MatFormFieldModule, MatInputModule, OrganizationModalComponent, CompanyModalComponent],

  templateUrl: './add-edit-designation.component.html',
  styleUrl: './add-edit-designation.component.scss'
})
export class AddEditDesignationComponent {
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
    orgIdFromLocalHost: any;
    currentUserRole: any;
  
    ngOnInit(): void {

      this.utils.showLoader();
      const userData = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user') as string) : null;
      this.currentUserId = userData.Id
      this.currentUserRole = userData.Role;

      this.orgIdFromLocalHost = userData.OrganizationId
      
      
      setTimeout(() => {
        if(this.currentUserRole === 'Admin' && userData.OrganizationId){
          this.onOrganizationChange(userData.OrganizationId);
        }
      }, 500)

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

      if(this.selectedOrganization){
        var orgId = this.selectedOrganization.id
      }else if(this.orgIdFromLocalHost){
         orgId = this.orgIdFromLocalHost
      }

      const body  = {
        Id: this.paramsId? this.paramsId : "",
        Name: this.model?.Name ? this.model.Name : null,
        Description: this.model?.description ? this.model.description : null,
        UserId: this.currentUserId ? this.currentUserId : "",
        IsActive: true,
        OrganizationId: orgId ? orgId : null,
        CompanyId: this.selectedCompany?.id ?? null,
        
      }
      
  
      this.designationService.addDesignation(body).subscribe(res => {
        if (res && res.StatusCode == 200) {
          this.utils.notification(res.CommonMessage, 'success');
          this.router.navigate(['/main/attendance/designation']);
          
        }
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
  
          if(this.paramsId){
            this.getById(this.paramsId);
          }


        }
        if(this.mode == 'create'){
          this.utils.hideLoader()
        }
      }, (error) => {
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

          this.utils.hideLoader();

        }else {
          this.utils.hideLoader();
        }
      }, (error) => {
        this.utils.hideLoader();

      })
    }
  
  
    onClear() {
      // Logic for clearing the form
      this.model = {};
      this.selectedOrganization = null;
      this.selectedCompany = null
      
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
        if(this.mode == 'edit'){
          this.selectedCompany = this.companyArray.find((x) => x.id === this.model.CompanyId);
        }
      })
    }

    isOrgAdded(event: any){
      if(true){
        this.selectedOrganization = null
        this.selectedCompany = null;
        this.organizationService.getAllOrganizationDrop().subscribe(res => {
          if (res && res.StatusCode == 200) {
            this.organizationData = res.Result;
            var filteredRows = this.organizationData.filter(row => row.IsActive);
            this.organizationArray = filteredRows.map((item: any) => ({
              id: item.Id,
              name: item.Name
            }));
          }
    
        })
      }
  
    }
  
  
    isComAdded(event: any){
      if(true){
        this.selectedCompany = null;
        this.selectedOrganization = null;
        if(this.selectedOrganization){
          var orgId = this.selectedOrganization.id
        }else if(this.orgIdFromLocalHost){
           orgId = this.orgIdFromLocalHost
        }
  
        this.companyService.getAllCompanysDrop(orgId).subscribe(res => {
          if (res && res.StatusCode == 200) {
            this.companyData = res.Result;
            var filteredRows = this.companyData.filter(row => row.IsActive);
            this.companyArray = filteredRows.map((item: any) => ({
              id: item.Id,
              name: item.Name
            }));
          }
        })
      }
  
    }

    searchTerm: string = '';
    showAddButton: boolean = false;
    showComAddButton: boolean = false;
  
  
    onSearch(searchText: any, itemValue: any, itemNameKey: string = 'name') {
      this.searchTerm = searchText.term; // Store the search term
  
      // If the search term is empty, show the "Add" button again
      if (this.searchTerm) {
        this.showAddButton = !itemValue.some(item => 
          item[itemNameKey].toLowerCase().includes(this.searchTerm.toLowerCase())
        );
      } else {
        // If the search term is cleared, show the "Add" button again
        this.showAddButton = false;
      }
    }
  
    onDropdownClose(){
      this.showAddButton = false
      this.showComAddButton = false
    }
  
    onDropdownOpen(){
      this.showAddButton = false
      
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
