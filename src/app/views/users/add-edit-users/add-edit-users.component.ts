import { NgClass, NgIf, NgStyle } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Utils } from '../../../utils';
import { UserServiceService } from '../../_services/user-service.service';
import { NgSelectModule } from '@ng-select/ng-select';
import { OrganizationService } from '../../_services/organization/organization.service';
import { CompanyService } from '../../_services/companies/company.service';
import { OrganizationModalComponent } from "../../../_sharedresources/modals/organization-modal/organization-modal.component";
import { CompanyModalComponent } from "../../../_sharedresources/modals/company-modal/company-modal.component";
import { DesignationService } from '../../_services/designation/designation.service';
import { DepartmentsService } from '../../_services/departments/departments.service';
import { LocationService } from '../../_services/location/location.service';
import { LocationModalComponent } from "../../../_sharedresources/modals/location-modal/location-modal.component";
import { environment } from '../../../../environments/environment.development';
import { DateService } from '../../../_sharedresources/date-service/date.service';
import { CompanyLocationModalComponent } from "../../../_sharedresources/modals/company-location-modal/company-location-modal.component";
import { OrganizationLocationModalComponent } from "../../../_sharedresources/modals/organization-location-modal/organization-location-modal.component";


declare var $: any

@Component({
  selector: 'app-add-edit-users',
  standalone: true,
  imports: [NgStyle, FormsModule, NgIf, RouterLink, NgClass, MatDatepickerModule, MatNativeDateModule, MatFormFieldModule, NgSelectModule, MatInputModule, OrganizationModalComponent, CompanyModalComponent, LocationModalComponent, CompanyLocationModalComponent, OrganizationLocationModalComponent],

  templateUrl: './add-edit-users.component.html',
  styleUrl: './add-edit-users.component.scss'
})
export class AddEditUsersComponent {
  intervalId: any
  readonly utils = inject(Utils);
  readonly userService = inject(UserServiceService);
  readonly organizationService = inject(OrganizationService);
  readonly companyService = inject(CompanyService);
  readonly designationService = inject(DesignationService);
  readonly departmentService = inject(DepartmentsService);
  readonly locationService = inject(LocationService);
  readonly router = inject(Router);
  readonly route = inject(ActivatedRoute);
  readonly dateService = inject(DateService)

    dateOfBirth: any;
    dob: any;
    organizationData: any;
    selectedOrganization: any
    organizationArray: any = [];

    logoPreview: any;
    imageName: any;
    imageUrl: any;
    imageDisplay: any;

    genderData: any;
    selectedGender: any
    genderArray: any = [
      { id: 1, name: 'Male' },
      { id: 2, name: 'Female' },
      { id: 3, name: 'Other' },
    ];

    companyData: any;
    selectedCompany: any
    companyArray: any = [];

    locationData: any;
    selectedLocation: any
    selectedCompanyLocation: any
    selectedClientCompanyLocation: any
    locationArray: any = [];
    companylocationArray: any = [];
    clietnCompanyLocationArray: any = [];


    designationData: any;
    selectedDesignation: any
    designationArray: any = [];

    departmentData: any;
    selectedDepartment: any
    departmentArray: any = [];

    requiredText: string = 'This field is required'

    paramsId: any
    mode = 'create';
    startingDate = new Date();
    rolesArray: any = [
    { id: 1, name: 'Admin' },
    { id: 2, name: 'ClockManager' },
    { id: 3, name: 'Employee' },
    { id: 4, name: 'SuperAdmin' },
  ]
  selectedRole: any = null;
  currentUserId: any;
  currentUserRole: any;
  orgIdFromLocalHost: any;

  ngOnInit(): void {
    this.utils.showLoader();

    const userData = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user') as string) : null;
    this.currentUserId = userData.Id
    this.currentUserRole = userData.Role
    this.orgIdFromLocalHost = userData.OrganizationId
    
    
    setTimeout(() => {
      if(this.currentUserRole === 'Admin' && userData.OrganizationId){
        this.onOrganizationChange(userData.OrganizationId);
      }
    }, 1000)
    
    if (this.currentUserRole === 'Admin') {
      this.rolesArray = this.rolesArray.filter(role => role.id !== 4);
    }


    
    this.getAllOrganization();
    // this.getAllCompany();
    this.getAllDesignation();
    this.getAllDepartment();
    this.getAllLocation();
    
   
      
      this.route.params.subscribe(params => {
        if(params['id']){
          this.mode = 'edit';
          this.paramsId = params['id'];
        }
      });
    

  }

  model: any = {}
  employee: any = {}

  rowsData: any;
  getById(id: any){
    const body = {
      id: this.paramsId
    }
    this.userService.getUserById(body).subscribe(res => {
      if (res && res.StatusCode == 200) {
        
        this.rowsData = res.Result;
        this.model = res.Result;
        // this.model.Email = rowsData.Email ? rowsData.Email : '';
        // this.model.FirstName = rowsData.FirstName ? rowsData.FirstName : '';
        // this.model.LastName = rowsData.LastName ? rowsData.LastName : '';
        // this.model.Password = res.Result.Password ? res.Result.Password : '';
        // this.model.BloodGroup = res.Result.BloodGroup ? res.Result.BloodGroup : '';
        // this.model.Phone = res.Result.Phone ? res.Result.Phone : '';
        // this.model.Mobile = res.Result.Mobile ? res.Result.Mobile : '';
        // this.model.MiddleName = res.Result.MiddleName ? res.Result.MiddleName : '';


        if(this.rowsData.DateOfBirth){
          this.dob = new Date(this.rowsData.DateOfBirth);
          this.dateOfBirth = this.dateService.formatDate(this.dob, 'yyyy-MM-dd');
        }
        this.selectedRole = this.rolesArray.find(x => x.name == this.rowsData.Role);
        this.selectedGender = this.genderArray.find(x => x.name == this.rowsData.Gender);

        if(this.rowsData.ImageName && this.rowsData.Image){
          this.logoPreview = environment.userModuleApiImageBaseUrl + this.rowsData.Image
        }

        if(this.rowsData.OrganizationId){
          this.selectedOrganization = this.organizationArray.find(
            (x) => x.id === this.rowsData.OrganizationId
          );
        }

        this.onOrganizationChange(this.selectedOrganization?.id);
        
      }else {
      this.utils.hideLoader();

      }
    }, (error) => {
      this.utils.hideLoader();

    })
  }

  onSubmit(NgForm: any) {

    this.utils.showLoader();

      if(this.selectedOrganization){
        var orgId = this.selectedOrganization.id
      }else if(this.orgIdFromLocalHost){
         orgId = this.orgIdFromLocalHost
      }

     const body =  {
        Id: this.paramsId ? this.paramsId : null,
        FirstName: this.model?.FirstName ?? '',
        MiddleName: this.model?.MiddleName ?? '',
        LastName: this.model?.LastName ?? '',
        Password: this.model?.password ?? null,
        FullName: (this.model?.FirstName + ' ' + this.model?.LastName),
        Email: this.model?.Email ?? '',
        BloodGroup: this.model?.BloodGroup ?? '',
        Gender: this.selectedGender?.name ?? '',
        DateOfBirth: this.dateOfBirth ? this.dateOfBirth : '',
        Phone: this.model?.Phone ?? '',
        Mobile: this.model?.Mobile ?? '',
        City: this.model?.City ?? '',
        State: this.model?.State ?? '',
        Country: this.model?.Country ?? '',
        ZipCode: this.model?.ZipCode ?? '',
        Address: this.model?.Address ?? '',
        NationalId: this.model?.NationalId ?? '',
        SsnNumber: this.model?.SsnNumber ?? '',
        RfId: this.model?.RfId ?? '',
        Description: this.model?.Description ?? '',
        // Image: this.model?.Image ?? '',
        Role: this.selectedRole?.name ?? null,
        OrganizationId: orgId ? orgId: null,
        CompanyId: this.selectedCompany?.id ?? null,
        LocationId: this.selectedLocation?.id ?? null,
        // companyLocationId: this.selectedClientCompanyLocation?.id ?? null,
        // organizationLocationId: this.selectedCompanyLocation?.id ?? null,

        AssignCompanyLocation: this.selectedClientCompanyLocation && this.selectedClientCompanyLocation.length > 0 ? this.selectedClientCompanyLocation.map((x: any) => ({ id: x.id })) : [],
        AssignOrganizationLocation: this.selectedCompanyLocation && this.selectedCompanyLocation.length > 0 ? this.selectedCompanyLocation.map((x: any) => ({ id: x.id })) : [],

        DepartmentId: this.selectedDepartment?.id ?? null,
        DesignationId: this.selectedDesignation?.id ?? null,
        UserId: this.currentUserId ?? null,
        IsActive: this.model?.IsActive ?? true,

        LeftThumb: this.model?.LeftThumb ?? '',
        RightThumb: this.model?.RightThumb ?? '',
        LeftIndexFinger: this.model?.LeftIndexFinger ?? '',
        RightIndexFinger: this.model?.RightIndexFinger ?? '',
        LeftMiddleFinger: this.model?.LeftMiddleFinger ?? '',
        RightMiddleFinger: this.model?.RightMiddleFinger ?? '',
        LeftRingFinger: this.model?.LeftRingFinger ?? '',
        RightRingFinger: this.model?.RightRingFinger ?? '',
        LeftLittleFinger: this.model?.LeftLittleFinger ?? '',
        RightLittleFinger: this.model?.RightLittleFinger ?? '',

        Image: this.imageUrl ?? '',
        ImageName: this.imageName ?? '',

      }


    this.userService.addEditUser(body).subscribe(res => {
      if (res && res.StatusCode == 200) {
        this.utils.notification(res.CommonMessage, 'success');
        this.router.navigate(['/main/user']);
        this.utils.hideLoader();

        
      }else {
        this.utils.notification(res.CommonMessage, 'error');
        this.utils.hideLoader();

      }
    }, (error) => {
      this.utils.hideLoader();

    })

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
      }

      if(this.paramsId){
        this.getById(this.paramsId);
      }else {
        this.utils.hideLoader();

      }


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

  getAllDesignation() {

    let orgId = '';
  
    if(this.orgIdFromLocalHost){
      orgId = this.orgIdFromLocalHost
    }else if(this.selectedOrganization){
      orgId = this.selectedOrganization.id
    }

    this.designationService.getAllDesignationDrop(orgId, this.selectedCompany?.id).subscribe(res => {
      if (res && res.StatusCode == 200) {
        this.designationData = res.Result;
        var filteredRows = this.designationData.filter(row => row.IsActive);
        this.designationArray = filteredRows.map((item: any) => ({
          id: item.Id,
          name: item.Name
        }));
      }
    }, (error) => {
      this.utils.hideLoader();

    })
  }

  getAllLocation(){

    let orgId = '';
  
    if(this.orgIdFromLocalHost){
      orgId = this.orgIdFromLocalHost
    }else if(this.selectedOrganization){
      orgId = this.selectedDesignation.id
    }

      
    this.locationService.getAllLocationsDrop(orgId, this.selectedCompany?.id).subscribe(res => {
      if(res && res.StatusCode == 200){
        
        this.locationData = res.Result;

        this.locationArray = this.locationData.map((item: any) => ({
          id: item.Id,
          name: item.Name
        }));

      }
      this.utils.hideLoader();
    })
  }

  getAllDepartment() {

    let orgId = '';
    let comId = '';
    if(this.orgIdFromLocalHost){
      orgId = this.orgIdFromLocalHost
    }else if(this.selectedOrganization){
      orgId = this.selectedOrganization.id
    }


    this.departmentService.getAllDepartmentsDrop(orgId, this.selectedCompany?.id).subscribe(res => {
      if (res && res.StatusCode == 200) {
        this.departmentData = res.Result;
        var filteredRows = this.departmentData.filter(row => row.IsActive);
        this.departmentArray = filteredRows.map((item: any) => ({
          id: item.Id,
          name: item.Name
        }));
      }




    })
  }

  resetDropDownsForOrg(){
    this.selectedCompany = null;
    this.selectedLocation = null;
    this.selectedDepartment = null;
    this.selectedDesignation = null;
    this.selectedCompanyLocation = null;
    this.companylocationArray = [];
    this.resetDropDownsForCom();

  }

  resetDropDownsForCom(){
    this.selectedLocation = null;
    this.selectedDepartment = null;
    this.selectedDesignation = null;
    this.selectedClientCompanyLocation = null;
    this.clietnCompanyLocationArray = []
  }
  
  onOrganizationChange(id: any, isFromTemp?){
    
    if(isFromTemp){
      this.resetDropDownsForOrg();
    }

    this.companyService.getAllCompanysDrop(id).subscribe(res => {
      if (res && res.StatusCode == 200) {
        this.companyData = res.Result;
        var filteredRows = this.companyData.filter(row => row.IsActive);
        
        this.companyArray = filteredRows.map((item: any) => ({
          id: item.Id,
          name: item.Name
        }));
      }

      if(this.mode == 'edit' && this.rowsData){
        this.selectedCompany = this.companyArray.find(
          (x) => x.id === this.rowsData.CompanyId
        );
        this.onComnpanyChange(this.selectedOrganization?.id, this.selectedCompany?.id);
      }
      this.utils.hideLoader();


    }, (error) => {
      this.utils.hideLoader();

    })

 
    
    if(this.mode == 'edit' && this.rowsData){
      if(this.rowsData.DesignationId){
        this.selectedDesignation = this.designationArray.find(
          (x) => x.id === this.rowsData.DesignationId
        );
      }

      if(this.rowsData.DepartmentId){
        this.selectedDepartment = this.departmentArray.find(
          (x) => x.id === this.rowsData.DepartmentId
        );
      }
    }

    this.getAllDepartment();
    this.getAllDesignation();

    // this.locationService.getAllLocationsDrop(id, this.selectedCompany?.id).subscribe(res => {
    //   if (res && res.StatusCode == 200) {
    //     this.locationData = res.Result;
    //     var filteredRows = this.locationData.filter(row => row.IsActive);
        
    //     this.locationArray = filteredRows.map((item: any) => ({
    //       id: item.Id,
    //       name: item.Name
    //     }));
    //   }

   
    // })

    if(id && !this.selectedCompany){
      this.getCompanyLocation(id);
    }
    

    if(this.selectedCompany){
      this.getClientCompanyLocation();
    }

   
  }

  getCompanyLocation(id){
    
    var isOrganizationLocation: boolean = true
    if(this.orgIdFromLocalHost){
      var orgId = this.orgIdFromLocalHost
    }else {
      var orgId = id
    }
    

    var isOrg: boolean;
    if(orgId && !this.selectedCompany){
       isOrg = true
    }else if(this.selectedOrganization && this.selectedCompany){
      isOrg = false
    }
    

       this.locationService.getAllLocationsDrop(orgId, this.selectedCompany?.id, isOrganizationLocation, isOrg).subscribe(res => {
      if (res && res.StatusCode == 200) {
        this.locationData = res.Result;
        var filteredRows = this.locationData.filter(row => row.IsActive);
        
        this.companylocationArray = filteredRows.map((item: any) => ({
          id: item.Id,
          name: item.Name
        }));
      }


      if(this.companylocationArray && this.mode == 'edit' && (this.rowsData.OrganizationLocation && this.rowsData.OrganizationLocation.length) ){
        // this.selectedCompanyLocation = this.companylocationArray.find(
        //   (x) => x.id === this.rowsData.OrganizationLocationId
        // )

        this.selectedCompanyLocation = this.companylocationArray.filter(companyLocation => 
          this.rowsData.OrganizationLocation.some(orgLocation => orgLocation.Id === companyLocation.id)
        );
        
        this.updateSelectAllState('org');
      }
   
    })
  }
  getClientCompanyLocation(){
    this.locationService.getAllLocationsDrop('', this.selectedCompany?.id, false).subscribe(res => {
      if (res && res.StatusCode == 200) {
        this.locationData = res.Result;
        var filteredRows = this.locationData.filter(row => row.IsActive);
        
        this.clietnCompanyLocationArray = filteredRows.map((item: any) => ({
          id: item.Id,
          name: item.Name
        }));
      }

      if(this.clietnCompanyLocationArray && this.mode == 'edit' && (this.rowsData.CompanyLocation && this.rowsData.CompanyLocation.length > 0)){
        // this.selectedClientCompanyLocation = this.clietnCompanyLocationArray.find(
        //   (x) => x.id === this.rowsData.CompanyLocationId
        // )

        this.selectedClientCompanyLocation = this.clietnCompanyLocationArray.filter(clientLocation => 
          this.rowsData.CompanyLocation.some(companyLocation => companyLocation.Id === clientLocation.id)
        );
        this.updateSelectAllState('com');
        

      }
   
    })
  }


  resetImage(){
    this.logoPreview = '';
    this.imageUrl = '';
    this.imageName = '';
  }

  onComnpanyChange(orgId: any, comId: any, isFromTemp?){
    
    if(isFromTemp){
      this.resetImage();
      this.resetDropDownsForCom();
    }

    if(this.currentUserRole === 'Admin'){
      
      orgId = this.orgIdFromLocalHost;
    }

    this.getAllDepartment();
    this.getAllDesignation();

    if(this.selectedCompany){
      this.getClientCompanyLocation();
    }

    // this.locationService.getAllLocationsDrop(orgId, comId).subscribe(res => {
    //   if (res && res.StatusCode == 200) {
    //     this.locationData = res.Result;
    //     var filteredRows = this.locationData.filter(row => row.IsActive);
    //     this.locationArray = filteredRows.map((item: any) => ({
    //       id: item.Id,
    //       name: item.Name
    //     }));
    //   }

    //   if(this.mode == 'edit'){
    //     this.selectedLocation = this.locationArray.find(
    //       (x) => x.id === this.rowsData.LocationId
    //     );
    //   }

    // })
  }


  onlyDecimalNumberKey(event){
    return this.utils.onlyDecimalNumberKey(event);
  }

  onImageChange(event: any) {
    const file = event.target.files?.[0];
    if (file) {
      const formData = new FormData();
  
      // Append the file to the FormData object with a specific field name
      formData.append('file', file, file.name);
  
      // Call the userService method to upload the file
      this.userService.uploadImage(formData).subscribe({
        next: (response) => {
          if(response){
            this.utils.notification('Image Uploaded Successfully', 'success');
            this.imageUrl = response.FilePath;
            this.imageName = response.OrgionalFileName;
            this.logoPreview = environment.userModuleApiImageBaseUrl + this.imageUrl
          }
        },
        error: (error) => {
          this.utils.notification('Image Failed to Upload', 'error');
        }
      });
    } else {
      this.utils.notification('No file selected', 'warning');
    }
  }

  onDateChange(event){
    this.dateOfBirth = this.dateService.formatDate(event.target.value, 'yyyy-MM-dd');
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

  isComLocAdded(event: any, status?){
    if(true){
      this.selectedClientCompanyLocation = null;
      this.clietnCompanyLocationArray = [];
      this.selectedCompanyLocation = null;
      this.companylocationArray = [];
      this.selectedOrganization = null;
      this.selectedCompany = null;

    }

    if(status == 'org' && this.currentUserRole === 'Admin'){

      var isOrganizationLocation: boolean = true
      if(this.orgIdFromLocalHost){
        var orgId = this.orgIdFromLocalHost
      }
  
         this.locationService.getAllLocationsDrop(orgId, this.selectedCompany?.id, isOrganizationLocation).subscribe(res => {
        if (res && res.StatusCode == 200) {
          this.locationData = res.Result;
          var filteredRows = this.locationData.filter(row => row.IsActive);
          
          this.companylocationArray = filteredRows.map((item: any) => ({
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

  onDropdownClear(val){
    if(val == 'org'){
      this.selectAllCheckedOrg = false
      this.companylocationArray.forEach(item => item.selected = false);
      
    }else if (val == 'com'){
      this.selectAllCheckedCom = false
      this.clietnCompanyLocationArray.forEach(item => item.selected = false);

    }

  }

  onDropdownOpen(dropVal?){
    this.showAddButton = false
    this.updateSelectAllState(dropVal);

  }


  selectAllCheckedOrg: boolean = false;
  selectAllCheckedCom: boolean = false;


  toggleSelectAll(dropVal) {
    if(dropVal == 'org'){
      if (this.selectAllCheckedOrg) {
        this.companylocationArray.forEach(item => item.selected = true);
      } else {
        this.companylocationArray.forEach(item => item.selected = false);
      }
  
      this.selectedCompanyLocation = this.companylocationArray.filter(item => item.selected);

    }else if (dropVal == 'com'){
      if (this.selectAllCheckedCom) {
        this.clietnCompanyLocationArray.forEach(item => item.selected = true);
      } else {
        this.clietnCompanyLocationArray.forEach(item => item.selected = false);
      }
  
      this.selectedClientCompanyLocation = this.clietnCompanyLocationArray.filter(item => item.selected);

    }
  }
  
  // updateSelectAllState() {
  //   this.selectAllChecked = this.companylocationArray.every(item => item.selected);
  // }

  // updateSelectAllState(dropVal) {
  //   // If all items are selected, mark the "Select All" checkbox as checked
  //   debugger
  //   if(dropVal == 'org'){
  //     this.selectAllCheckedOrg = this.companylocationArray.every(item => item.selected);
  //     if (this.companylocationArray.length === 0 || this.selectedCompanyLocation.length === 0) {
  //       this.selectAllCheckedOrg = false;
  //     }else if (this.selectedCompanyLocation.length === this.companylocationArray.length) {
  //       this.selectAllCheckedOrg = true;
  //     }
      
  //   }else if (dropVal == 'com'){
  //     this.selectAllCheckedCom = this.clietnCompanyLocationArray.every(item => item.selected);
  //     if (this.clietnCompanyLocationArray.length === 0 || this.selectedClientCompanyLocation.length === 0) {
  //       this.selectAllCheckedCom = false;
  //     }else if (this.selectedClientCompanyLocation.length === this.clietnCompanyLocationArray.length) {
  //       this.selectAllCheckedCom = true;
  //     }
  //   }
  // }

  updateSelectAllState(dropVal) {
    if (dropVal === 'org') {
        // Check if every item in the list is selected
        this.selectAllCheckedOrg = this.companylocationArray?.length > 0 && 
            this.companylocationArray.every(item => this.selectedCompanyLocation?.some(selected => selected.id === item.id));
    } else if (dropVal === 'com') {
        // Check if every item in the list is selected
        this.selectAllCheckedCom = this.clietnCompanyLocationArray?.length > 0 &&
            this.clietnCompanyLocationArray.every(item => this.selectedClientCompanyLocation?.some(selected => selected.id === item.id));
    }
}


  onItemSelect(dropVal){
    this.updateSelectAllState(dropVal);
  }

  onItemRemove(dropVal){
    this.updateSelectAllState(dropVal);

  }

  // Handle checkbox changes (individual selection)
  // onCheckboxChange() {
  //   this.selectedCompanyLocation = this.companylocationArray.filter(item => item.selected);

  //   this.selectAllChecked = this.companylocationArray.every(item => item.selected);
  // }

  onClear() {
    // Logic for clearing the form
    this.model = {};
    this.selectedOrganization = null;
    this.selectedCompany = null
    this.selectedCompanyLocation = null;
    this.selectedClientCompanyLocation = null;
    this.dob = null;
  }

  createOrganization() {
    $('#organization-modal').modal('show');
  }

  createCompany() {
    $('#company-modal').modal('show');
  }

  createDesignation() {
    $('#designation-modal').modal('show');
  }

  createDepartment() {
    $('#department-modal').modal('show');
  }

  createCompanyLocation(){
    $('#company-location-modal').modal('show');
  }

  createOrgLocation(){
    $('#organization-location-modal').modal('show');

  }

}
