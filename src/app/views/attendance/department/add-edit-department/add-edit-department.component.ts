import { Component, inject } from '@angular/core';
import { Utils } from '../../../../utils';
import { FormsModule } from '@angular/forms';
import { NgClass, NgIf, NgStyle } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { DepartmentsService } from '../../../_services/departments/departments.service';
import { OrganizationService } from '../../../_services/organization/organization.service';
import { CompanyService } from '../../../_services/companies/company.service';
import { NgSelectModule } from '@ng-select/ng-select';
import { OrganizationModalComponent } from '../../../../_sharedresources/modals/organization-modal/organization-modal.component';
import { CompanyModalComponent } from '../../../../_sharedresources/modals/company-modal/company-modal.component';
declare const $: any

@Component({
  selector: 'app-add-edit-department',
  standalone: true,
  imports: [FormsModule, NgStyle, NgIf, RouterLink, NgClass, MatDatepickerModule, MatNativeDateModule, MatFormFieldModule, NgSelectModule, MatInputModule, OrganizationModalComponent, CompanyModalComponent],
  
  templateUrl: './add-edit-department.component.html',
  styleUrl: './add-edit-department.component.scss'
})
export class AddEditDepartmentComponent {
 intervalId: any
  readonly utils = inject(Utils);
  readonly router = inject(Router);
  readonly route = inject(ActivatedRoute);
  readonly departmentService = inject(DepartmentsService);
  readonly organizationService = inject(OrganizationService);
  readonly companyService = inject(CompanyService);
  
  startingDate = new Date();

  mode: string = 'create';
  requiredText: string = 'This field is required'
  model: any = {}
  paramsId: any;
  currentUserId: any;

  organizationData: any;
  selectedOrganization: any
  organizationArray: any = [];

  companyData: any;
  selectedCompany: any
    companyArray: any = [];
    orgIdFromLocalHost: any;
    currentUserRole: any
    
  ngOnInit(): void {
    this.utils.showLoader();
    const userData = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user') as string) : null;
    this.currentUserId = userData.Id
    this.currentUserRole = userData.Role
    this.orgIdFromLocalHost = userData.OrganizationId
    
    
    this.route.params.subscribe(params => {
      if(params['id']){
        this.mode = 'edit';
        this.paramsId = params['id'];
      }
    });

    setTimeout(() => {
      if(this.currentUserRole === 'Admin' && userData.OrganizationId){
        this.onOrganizationChange(userData.OrganizationId);
      }
    }, 500)

    // this.getAllCompany();
    this.getAllOrganization();

   
  }



  getAllOrganization() {
    this.organizationService.getAllOrganizationDrop().subscribe(res => {
      if (res && res.StatusCode == 200) {
        this.organizationData = res.Result;
        var filteredRows = this.organizationData.filter(row => row.IsActive);
        this.organizationArray = filteredRows.map((item: any) => ({
          id: item.Id,
          name: item.Name
        }));

        if(this.paramsId){
          this.getById(this.paramsId);
        }

        if(this.mode == 'create'){
          this.utils.hideLoader();
        }
      }else {
        this.utils.hideLoader();
      }
    }, (error) => {
      this.utils.hideLoader();
    })
  }

  getAllCompany() {
    this.companyService.getAllCompanysDrop().subscribe(res => {
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

  onSubmit(NgForm: any) {
    this.utils.showLoader();

      if(this.selectedOrganization){
        var orgId = this.selectedOrganization.id
      }else if(this.orgIdFromLocalHost){
        orgId = this.orgIdFromLocalHost
      }
      const body = {
        Id: this.paramsId ? this.paramsId : "",
        Name: this.model.departmentName ? this.model.departmentName : "",
        Description: this.model.description ? this.model.description : "",
        IsActive: true,
        UserId: this.currentUserId ? this.currentUserId : null,
        OrganizationId: orgId ? orgId : null,
        CompanyId: this.selectedCompany?.id ?? null,
      }

    


    this.departmentService.addDepartment(body).subscribe(res => {
      if (res && res.StatusCode == 200) {
        this.utils.notification(res.CommonMessage, 'success');
        this.router.navigate(['/main/attendance/department']);
        this.utils.hideLoader();
        
      }else {
        this.utils.hideLoader();
        this.utils.notification(res.CommonMessage, 'error');

      }
    }, (error) =>{
      this.utils.hideLoader();
    })

  }


  getById(id: any){
    const body = {
      id: id
    }
    this.departmentService.getUserById(body).subscribe(res => {
      if (res && res.StatusCode == 200) {
        this.model = res.Result;
        this.model.departmentName = res.Result.Name ? res.Result.Name : '';
        this.model.description = res.Result.Description ? res.Result.Description : '';
        this.selectedOrganization = this.organizationArray.find((x) => x.id === res.Result.OrganizationId);
        this.onOrganizationChange(this.selectedOrganization.id);
        this.utils.hideLoader();
        
      }else{
        this.utils.hideLoader();
      }
    }, (error) =>{
      this.utils.hideLoader();
    })
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

  onClear() {
    // Logic for clearing the form
    this.model = {};
    this.selectedOrganization = null;
    this.selectedCompany = null
    
  }

  createOrganization() {
    $('#organization-modal').modal('show');
  }

  createCompany() {
    $('#company-modal').modal('show');
  }

}
