import { NgClass, NgIf, NgStyle } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Utils } from '../../../utils';
import { UserServiceService } from '../../_services/user-service.service';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxSpinnerService } from 'ngx-spinner';
import { OrganizationService } from '../../_services/organization/organization.service';
import { CompanyService } from '../../_services/companies/company.service';
import { DesignationService } from '../../_services/designation/designation.service';
import { DepartmentsService } from '../../_services/departments/departments.service';
import { LocationService } from '../../_services/location/location.service';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { OrganizationModalComponent } from '../../../_sharedresources/modals/organization-modal/organization-modal.component';
import { CompanyModalComponent } from '../../../_sharedresources/modals/company-modal/company-modal.component';
import { LocationModalComponent } from '../../../_sharedresources/modals/location-modal/location-modal.component';
import { environment } from '../../../../environments/environment.development';
import { MatTabsModule } from '@angular/material/tabs';
import { CompanyProfileComponent } from "../company-profile/company-profile.component";
declare var $: any

@Component({
  selector: 'app-user-profile',
  standalone: true,
    imports: [NgStyle, FormsModule, NgIf, MatTabsModule, RouterLink, NgClass, MatDatepickerModule, MatNativeDateModule, MatFormFieldModule, NgSelectModule, MatInputModule, OrganizationModalComponent, CompanyModalComponent, LocationModalComponent, CompanyProfileComponent],
  
  providers: [NgxSpinnerService],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.scss'
})
export class UserProfileComponent implements OnInit {
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



  activeTabIndex: any = 'User Profile'

    imageUrl: any;
    dob: any;
    organizationData: any;
    selectedOrganization: any
    organizationArray: any = [];

    genderData: any;
    selectedGender: any
    genderArray: any = [
      { id: 1, name: 'MaLe' },
      { id: 2, name: 'Female' },
      { id: 3, name: 'Other' },
    ];

    companyData: any;
    selectedCompany: any
    companyArray: any = [];

    locationData: any;
    selectedLocation: any
    locationArray: any = [];

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
    profileImage: any = '';
    profileImageName: any;


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
    this.getAllCompany();
    this.getAllDesignation();
    this.getAllDepartment();
    this.getAllLocation();
    this.getById();


    // this.route.params.subscribe(params => {
    //   if(params['id']){
    //     this.mode = 'edit';
    //     this.paramsId = params['id'];
    //   }
    // });
  }

  model: any = {}
  employee: any = {}
  profileId: any;

  rowsData: any;
  getById(){
    this.utils.showLoader();
    
    const body = {
      id: this.currentUserId
    }
    this.userService.getUserProfile(body).subscribe(res => {
      if (res && res.StatusCode == 200) {
        
        this.rowsData = res.Result;
        this.profileId = res.Result.Id
        this.model = res.Result;

        // this.model.Email = rowsData.Email ? rowsData.Email : '';
        // this.model.FirstName = rowsData.FirstName ? rowsData.FirstName : '';
        // this.model.LastName = rowsData.LastName ? rowsData.LastName : '';
        // this.model.Password = res.Result.Password ? res.Result.Password : '';
        // this.model.BloodGroup = res.Result.BloodGroup ? res.Result.BloodGroup : '';
        // this.model.Phone = res.Result.Phone ? res.Result.Phone : '';
        // this.model.Mobile = res.Result.Mobile ? res.Result.Mobile : '';
        // this.model.MiddleName = res.Result.MiddleName ? res.Result.MiddleName : '';

        if(this.rowsData.ImageName && this.rowsData.Image){
          this.profileImage = environment.userModuleApiImageBaseUrl + this.rowsData.Image
        }

        this.selectedRole = this.rolesArray.find(x => x.name == this.rowsData.Role);
        this.selectedGender = this.genderArray.find(x => x.name == this.rowsData.Gender);

        if(this.rowsData.OrganizationId){
          this.selectedOrganization = this.organizationArray.find(
            (x) => x.id === this.rowsData.OrganizationId
          );
        }

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

        this.selectedLocation = this.locationArray.find(
          (x) => x.id === this.rowsData.LocationId
        );


      this.utils.hideLoader();
        


      }
    }, (error) => {
      this.utils.hideLoader();

    })
  }

  onSubmit(NgForm: any) {
    this.utils.showLoader();

     const body =  {
        Id: this.profileId ? this.profileId : null,
        FirstName: this.model?.FirstName ?? '',
        MiddleName: this.model?.MiddleName ?? '',
        LastName: this.model?.LastName ?? '',
        Password: this.model?.password ?? null,
        FullName: (this.model?.FirstName + ' ' + this.model?.LastName),
        Email: this.model?.Email ?? '',
        BloodGroup: this.model?.BloodGroup ?? '',
        Gender: this.selectedGender?.name ?? '',
        DateOfBirth: this.model?.DateOfBirth ?? new Date().toISOString(),
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
        OrganizationId: this.selectedOrganization?.id ?? null,
        CompanyId: this.selectedCompany?.id ?? null,
        LocationId: this.selectedLocation?.id ?? null,
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
        ImageName: this.profileImageName ?? '',
      }


    this.userService.storeUserDetail(body).subscribe(res => {
      if (res && res.StatusCode == 200) {
        this.utils.notification(res.CommonMessage, 'success');
        // this.router.navigate(['/main/user']);
        this.utils.hideLoader();

        
      }else {
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
    this.designationService.getAllDesignationDrop().subscribe(res => {
      if (res && res.StatusCode == 200) {
        this.designationData = res.Result;
        var filteredRows = this.designationData.filter(row => row.IsActive);
        this.designationArray = filteredRows.map((item: any) => ({
          id: item.Id,
          name: item.Name
        }));
      }
    })
  }

  getAllLocation(){
      
    this.locationService.getAllLocationsDrop().subscribe(res => {
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
    this.departmentService.getAllDepartmentsDrop().subscribe(res => {
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
        this.selectedCompany = this.companyArray.find(
          (x) => x.id === this.rowsData.CompanyId
        );
        this.onComnpanyChange(this.selectedOrganization?.id, this.selectedCompany?.id);
      }


    })


    this.locationService.getAllLocationsDrop(id).subscribe(res => {
      if (res && res.StatusCode == 200) {
        this.locationData = res.Result;
        var filteredRows = this.locationData.filter(row => row.IsActive);
        
        this.locationArray = filteredRows.map((item: any) => ({
          id: item.Id,
          name: item.Name
        }));
      }

      // if(this.mode == 'edit'){
      //   this.selectedCompany = this.companyArray.find(
      //     (x) => x.id === this.rowsData.CompanyId
      //   );
      //   this.onComnpanyChange(this.selectedOrganization?.id, this.selectedCompany?.id);
      // }
    })


    
  }


  onComnpanyChange(orgId: any, comId: any){
    
    this.selectedLocation = null;
    if(this.currentUserRole === 'Admin'){
      
      orgId = this.orgIdFromLocalHost;
    }
    this.locationService.getAllLocationsDrop(orgId, comId).subscribe(res => {
      if (res && res.StatusCode == 200) {
        this.locationData = res.Result;
        var filteredRows = this.locationData.filter(row => row.IsActive);
        this.locationArray = filteredRows.map((item: any) => ({
          id: item.Id,
          name: item.Name
        }));
      }

      if(this.mode == 'edit'){
        this.selectedLocation = this.locationArray.find(
          (x) => x.id === this.rowsData.LocationId
        );
      }

    })
  }

  
// onImageChange(event: any) {
//   const file = event.target.files?.[0];
//   if (file) {
//     const reader = new FileReader();

//     reader.onload = () => {
//       const base64Image = reader.result as string;

//       // Update profileImage to display the uploaded image
//       this.profileImage = base64Image;

//       // Now send the base64 image to your server
//       const imageData = {
//         // fileName: file.name,
//         file: base64Image
//       };

//       this.userService.uploadProfileImage(imageData).subscribe({
//         next: (response) => {
//           this.utils.notification('Image Uploaded Successfully', 'success');
//         },
//         error: (error) => {
//           this.utils.notification('Image Failed to Upload', 'error');
//         }
//       });
//     };

//     // Read the file as a Data URL (Base64)
//     reader.readAsDataURL(file);
//   } else {
//     console.error('No file selected');
//   }
// }

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
          this.profileImageName = response.OrgionalFileName;
          this.profileImage = environment.userModuleApiImageBaseUrl + this.imageUrl

          // this.getProfileImage();
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

// onImageChange(event: any) {
//   const file = event.target.files?.[0];
//   if (file) {
//     const formData = new FormData();

//     // Append the file to the FormData object with a specific field name
//     formData.append('file', file, file.name);

//     // Call the userService method to upload the file
//     this.userService.uploadImage(formData).subscribe({
//       next: (response) => {
//         if(response){
//           this.utils.notification('Image Uploaded Successfully', 'success');
//           this.imageUrl = response.FilePath;
//           this.imageName = response.OrgionalFileName;
//           this.logoPreview = environment.userModuleApiImageBaseUrl + this.imageUrl
//         }
//       },
//       error: (error) => {
//         this.utils.notification('Image Failed to Upload', 'error');
//       }
//     });
//   } else {
//     this.utils.notification('No file selected', 'warning');
//   }
// }


getProfileImage(){

    const body = {
       filePath: environment.userModuleApiImageBaseUrl + this.imageUrl

    }

    this.userService.getProfileImage(body).subscribe(res => {
      // if(res && res.filePath){
      //   this.profileImage = res.filePath || ''
      //   this.profileImageName = res.OrgionalFileName
      // }

      if (res && typeof res.filePath === 'string' && res.filePath.trim() !== '') {
        this.profileImage = res.filePath;
        this.profileImageName = res.OrgionalFileName

      } else {
        this.profileImage = '/assets/images/no-profile-pic-tiny.png'; // Use fallback
      }
    })
  }



  onClear() {
    // Logic for clearing the form
    this.model = {};
    
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

  createLocation(){
    $('#location-modal').modal('show');
  }
}
