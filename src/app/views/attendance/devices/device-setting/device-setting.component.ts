import { NgClass, NgIf, NgStyle } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { RouterLink } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';
import { CompanyModalComponent } from '../../../../_sharedresources/modals/company-modal/company-modal.component';
import { OrganizationModalComponent } from '../../../../_sharedresources/modals/organization-modal/organization-modal.component';
import { MatInputModule } from '@angular/material/input';
import { Utils } from '../../../../utils';
import { UserServiceService } from '../../../_services/user-service.service';
import { environment } from '../../../../../environments/environment.development';
import { DevicesService } from '../../../_services/devices/devices.service';
import { OrganizationService } from '../../../_services/organization/organization.service';

@Component({
  selector: 'app-device-setting',
  standalone: true,
  imports: [FormsModule, NgStyle, NgIf, RouterLink, NgClass, NgSelectModule, MatDatepickerModule, MatNativeDateModule, MatFormFieldModule, MatInputModule, OrganizationModalComponent, CompanyModalComponent],

  templateUrl: './device-setting.component.html',
  styleUrl: './device-setting.component.scss'
})
export class DeviceSettingComponent {
  
    readonly utils = inject(Utils)
    readonly userService = inject(UserServiceService)
    readonly deviceService = inject(DevicesService)
    readonly organizationService = inject(OrganizationService)
  
    currentUserId: any
    selectedOrientation: any
    selectedBrightnessLevel: any = 10;
    model: any = {};
    passwordVisible: boolean;
    confirmPasswordVisible: boolean;
    organizationData: any;
    selectedOrganization: any
    organizationArray: any = [];
    orientationArray = [
      { id: 2, name: 'Landscape'},
      { id: 2, name: 'Portrait'},
    ]

    // fontSizesArray: any;
    // themesArray: any;
    // fontFamiliesArray: any

    fontSizesArray = [
      { id: 2, name: 'Small', sizeValue: '40px' },
      { id: 2, name: 'Medium', sizeValue: '60px' },
      { id: 3, name: 'Large', sizeValue: '70px' },
      { id: 3, name: 'Extra Large', sizeValue: '80px' }
    ];

    fontSizesArrayAll = [
      { id: 1, name: 'Small', sizeValue: '20px' },
      { id: 2, name: 'Medium', sizeValue: '24px' },
      { id: 3, name: 'Large', sizeValue: '28px' },
      { id: 3, name: 'Extra Large', sizeValue: '32px' }
    ];
    
    fontFamiliesArray = [
      { id: 1, name: 'Arial, sans-serif' },
      { id: 2, name: 'Times New Roman, serif' },
      { id: 3, name: 'Courier New, monospace' }
    ];
    
    themesArray = [
      { id: 1, name: 'Light' },
      { id: 2, name: 'Dark' }
    ];

    editId: any;
    selectedTimeFontSize: any;
    selectedDateFontSize: any;
    selectedAddressFontSize: any;
    selectedDisplayFontSize: any;
    selectedDisplayTextFontSize: any;

    
    selectedFontSize: any;
    selectedFontFamily: any;
    selectedTheme: any;
    logoPreview: string | ArrayBuffer | null = null;
    imageUrlEdit: any
    imageUrl: any;
    imageName: any;
    currentUserRole: any;
    orgIdFromLocalHost: any;
  
    ngOnInit(): void {
      this.utils.showLoader()

      const userData = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user') as string) : null;
      this.currentUserId = userData.Id
      this.currentUserRole = userData.Role;

      this.orgIdFromLocalHost = userData.OrganizationId

      if(this.currentUserRole == 'Admin'){
        this.getById();
      }

      if(this.currentUserRole == 'SuperAdmin'){
        this.getAllOrganization();
      }

    }


    getAllOrganization() {
      this.utils.showLoader();
      this.organizationService.getAllOrganizationDrop().subscribe(res => {
        if (res && res.StatusCode == 200) {
  
          this.organizationData = res.Result;
  
          this.organizationArray = this.organizationData.map((item: any) => ({
            id: item.Id,
            name: item.Name
          }));
  
        }
        this.utils.hideLoader()

  
      }, (error) => {
        this.utils.hideLoader();
  
      })
    }

    onOrganizationChange(id: any){

      this.getById();

    }
  
    onSubmit(f: NgForm) {
      
      this.utils.showLoader();
      
      if(this.currentUserRole == 'SuperAdmin' && !this.selectedOrganization){
      
      this.utils.hideLoader();
      this.utils.notification('Select Company', 'error');
      return

      }

    
      if(this.currentUserRole == 'Admin'){
        var orgId = this.orgIdFromLocalHost
      }else if(this.currentUserRole == 'SuperAdmin'){
        orgId = this.selectedOrganization?.id
      }
      // else if(this.orgIdFromLocalHost){
      //    orgId = this.orgIdFromLocalHost
      // }

  
      const body = {
        id: this.editId ? this.editId : '',
        DeviceId: null,
        FontFamily: this.selectedFontFamily ? this.selectedFontFamily?.name : null,
        Theme: this.selectedTheme ? this.selectedTheme.name : null,
        TimeFontSize: this.selectedTimeFontSize ? this.selectedTimeFontSize.name : null,
        DateFontSize: this.selectedDateFontSize ? this.selectedDateFontSize.name : null,
        AddressFontSize: this.selectedAddressFontSize ? this.selectedAddressFontSize.name : null,
        DialpadTextFontSize: this.selectedDisplayTextFontSize ? this.selectedDisplayTextFontSize.name : null,
        DialpadFontSize: this.selectedDisplayFontSize ? this.selectedDisplayFontSize.name : null,
        OrganizationId: orgId ? orgId : '',
        CompanyId: null,
        OrganizationLogo: this.imageUrl || this.imageUrlEdit || '',
        CompanyLogo: null,
        UserId: this.currentUserId,
        Orientation: this.selectedOrientation.name || '',
        IsActive: true ,
        Brightness: (this.selectedBrightnessLevel/100).toString() || '0.1',

      }
  
      this.deviceService.addEditDeviceSetting(body).subscribe({
        next: (res) => {
          if(res){
            this.utils.hideLoader();
            this.utils.notification(res.CommonMessage, 'success')
            this.getById();
          }else {
            this.utils.hideLoader();
          }
        },
        error: (err) => {
          console.error(err);
          this.utils.hideLoader();
          
        }
      })
  
    }


    getById(){

      this.utils.showLoader();
      
      if (this.orgIdFromLocalHost) {
        var orgId = this.orgIdFromLocalHost
      } else if(this.selectedOrganization){
        var orgId = this.selectedOrganization.id
      }

      const body = {
        id: '',
        organizationId: orgId ? orgId : ''
      }
      this.deviceService.getDeviceSetting(body).subscribe((data: any) => {
        this.resetAllValues();
        if (data && data.Result) {
          var res = data.Result;
          this.selectedBrightnessLevel = res.Brightness ? Number(res.Brightness) * 100 : 10

          this.editId = res.Id;

          if (res.TimeFontSize) {
            this.selectedTimeFontSize = this.fontSizesArray.find((x: any) => x.name == res.TimeFontSize);
          }
          
          if (res.DateFontSize) {
            this.selectedDateFontSize = this.fontSizesArrayAll.find((x: any) => x.name == res.DateFontSize);
          }
          
          if (res.AddressFontSize) {
            this.selectedAddressFontSize = this.fontSizesArrayAll.find((x: any) => x.name == res.AddressFontSize);
          }
          
          if (res.DialpadTextFontSize) {
            this.selectedDisplayTextFontSize = this.fontSizesArrayAll.find((x: any) => x.name == res.DialpadTextFontSize);
          }
          
          if (res.DialpadFontSize) {
            this.selectedDisplayFontSize = this.fontSizesArrayAll.find((x: any) => x.name == res.DialpadFontSize);
          }

          if (res.FontFamily) {
            this.selectedFontFamily = this.fontFamiliesArray.find((x: any) => x.name == res.FontFamily);
          }
          
          if(res.Theme){
            this.selectedTheme = this.themesArray.find((x: any) => x.name == res.Theme);
          }
          
          if(res.Orientation){
            this.selectedOrientation = this.orientationArray.find((x: any) => x.name == res.Orientation);
          }

          if(res.OrganizationLogo){
            this.logoPreview = environment.userModuleApiImageBaseUrl + res.OrganizationLogo
            this.imageUrlEdit = res.OrganizationLogo
          }


          this.utils.hideLoader()

        }else {
        this.utils.hideLoader()
        if(this.currentUserRole == 'SuperAdmin'){
          this.resetAllValues();
        }
        }
      }, (error) => {
        this.utils.hideLoader()

      })
    } 

    removeLogo(){
      
    }
    
    
    togglePasswordVisibility() {
      this.passwordVisible = !this.passwordVisible;
  
    }
  
    toggleConfirmPasswordVisibility() {
      this.confirmPasswordVisible = !this.confirmPasswordVisible;
  
    }


    // onLogoUpload(event: any) {
    //   const file = event.target.files[0];
    //   if (file) {
    //     const reader = new FileReader();
    //     reader.onload = (e) => {
    //       this.logoPreview = e.target?.result;
    //     };
    //     reader.readAsDataURL(file);
    //   }
    // }


    onLogoUpload(event: any) {
      this.utils.showLoader()
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
                this.utils.hideLoader()

              }
            },
            error: (error) => {
              this.utils.notification('Image Failed to Upload', 'error');
              this.utils.hideLoader()

            }
          });
        } else {
          this.utils.notification('No file selected', 'warning');
        }
      }
  


      resetAllValues() {
        this.selectedTimeFontSize = null;
        this.selectedDateFontSize = null;
        this.selectedAddressFontSize = null;
        this.selectedDisplayFontSize = null;
        this.selectedDisplayTextFontSize = null;
        this.selectedFontSize = null;
        this.selectedFontFamily = null;
        this.selectedTheme = null;
        this.logoPreview = null;
        this.imageUrlEdit = null;
        this.imageUrl = null;
        this.imageName = null;
        this.editId = null;
    }
    
}
