import { Component, inject } from '@angular/core';
import { Utils } from '../../../utils';
import { FormsModule, NgForm } from '@angular/forms';
import { NgClass, NgIf } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { UserServiceService } from '../../_services/user-service.service';
import { OrganizationService } from '../../_services/organization/organization.service';
import { Page } from '../../../_sharedresources/page';
import { lastValueFrom } from 'rxjs';
import { environment } from '../../../../environments/environment.development';
import { NgSelectModule } from '@ng-select/ng-select';

@Component({
  selector: 'app-company-profile',
  standalone: true,
  imports: [FormsModule, NgIf, RouterLink, NgClass, MatDatepickerModule, MatNativeDateModule, NgSelectModule, MatFormFieldModule, MatInputModule],
  templateUrl: './company-profile.component.html',
  styleUrl: './company-profile.component.scss'
})
export class CompanyProfileComponent {
intervalId: any
  readonly utils = inject(Utils);
  readonly router = inject(Router);
  readonly route = inject(ActivatedRoute);
  readonly organizationService = inject(OrganizationService);
  readonly userService = inject(UserServiceService);

  requiredText: string = 'This field is required';
  cityData: any;
  stateData: any;
  countryData: any;
  timeZoneData: any;

  page = new Page();
  selectedCountry: any
  countryArray: any = [];

  selectedState: any
  stateArray: any = [];

  selectedCity: any
  cityArray: any = [];
  
  selectedTimezone: any
  timezoneArray: any = [];

  startingDate = new Date();
  paramsId: any;
  mode: string = 'create';
  currentUserId: any;
  logoFile: File | null = null;
  logoPreview: string | ArrayBuffer | null = null;

  imageName: any;
  imageUrl: any;
  imageDisplay: any;

  model: any = {}
  profileImage: any = '';
  profileImageName: any;
  orgIdFromLocalHost: any;
  currentUserRole: any;

  ngOnInit(): void {
    this.utils.showLoader();
    const userData = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user') as string) : null;
    this.currentUserId = userData.Id
    this.orgIdFromLocalHost = userData.OrganizationId
    this.currentUserRole = userData.Role

    
    this.getAllCountry(); 
    
    // this.route.params.subscribe(params => {
    //   if(params['id']){
    //     this.mode = 'edit';
    //     this.paramsId = params['id'];
    //   }
    // });
    
  }


   getAllCountry(){
    
    this.organizationService.getAllCountry(this.page).subscribe(res => {
      if(res && res.StatusCode == 200){
        
        this.countryData = res.Result;

        this.countryArray = this.countryData.map((item: any) => ({
          id: item.countryId,
          name: item.name
        }));

        this.getAllTimeZone();
        if(this.orgIdFromLocalHost && this.currentUserRole != 'SuperAdmin'){
          this.getById(this.orgIdFromLocalHost);
        }


      }

      this.utils.hideLoader();

    })
  }

  


  async getAllState(countryId: any) {
    try {
  
      // Convert the Observable to a Promise using lastValueFrom
      const res = await lastValueFrom(this.organizationService.getAllState(this.page, countryId));
  
      if (res && res.StatusCode === 200) {
        this.stateData = res.Result;
  
        this.stateArray = this.stateData.map((item: any) => ({
          id: item.stateId,
          name: item.name,
        }));
      }
    } catch (error) {
      console.error('Error fetching states:', error);
    } finally {
      this.utils.hideLoader();
    }
  }
  

  async getAllCity(): Promise<void> {
    try {
      const res = await lastValueFrom(
        this.organizationService.getAllCity(this.page, this.selectedCountry.id, this.selectedState.id)
      );
  
      if (res && res.StatusCode === 200) {
        this.cityData = res.Result;
  
        this.cityArray = this.cityData.map((item: any) => ({
          id: item.cityId,
          name: item.name,
        }));
      }
    } catch (error) {
      console.error('Error fetching cities:', error);
    } finally {
      this.utils.hideLoader();
    }
  }
  

  getAllTimeZone(){
    
    this.organizationService.getAllTimeZone(this.page, this.currentUserId).subscribe(res => {
      if(res && res.StatusCode == 200){
        
        this.timeZoneData = res.Result;

        this.timezoneArray = this.timeZoneData.map((item: any) => ({
          id: item.Id,
          name: item.Name
        }));


      }
    })
    this.utils.hideLoader();

  }

  onCountryChange(){
    if(this.selectedCountry){
      this.getAllState(this.selectedCountry.id);
    }
  }

  onStateChange(){
    if(this.selectedCountry && this.selectedState){
      this.getAllCity();
    }
  }


  onSubmit(form: NgForm) {
    this.utils.showLoader();


    const body  = {
      Id: this.orgIdFromLocalHost ? this.orgIdFromLocalHost : "",
      VatRegistrationNo: this.model?.vatRegNo ? this.model.vatRegNo : null,
      LogoPath: this.model?.LogoPath ? this.model.LogoPath : null,
      Website: this.model?.website ? this.model.website : null,
      Landline: this.model?.landline ? this.model.landline : null,
      Town: this.model?.town ? this.model.town : null,
      Postcode: this.model?.postcode ? this.model.postcode : null,
      CompanyRegNo: this.model?.companyRegNo ? this.model.companyRegNo : null,
      Name: this.model?.name ? this.model.name : null,
      Email: this.model?.email ? this.model.email : null,
      Address: this.model?.address ? this.model.address : null,
      PhoneNo: this.model?.phone ? this.model.phone : null,
      State: this.selectedState ? this.selectedState.name : null,
      City: this.selectedCity ? this.selectedCity.name : null,
      Country: this.selectedCountry.name ? this.selectedCountry.name : null,
      Password: "",
      IsActive: true,
      TimeZoneId: this.selectedTimezone ? this.selectedTimezone.id : null,
      UserId: this.currentUserId ? this.currentUserId : null,
      Image: this.imageUrl ?? '',
      ImageName: this.imageName ?? '',

    }

    this.organizationService.addOrganization(body).subscribe(res => {
      if (res && res.StatusCode == 200) {
        this.utils.notification(res.CommonMessage, 'success');
        // this.router.navigate(['/main/attendance/organization/all-organization']);
        this.utils.hideLoader();

      }else {
      this.utils.hideLoader();

      }
    }, (error) => {
      this.utils.hideLoader();

    })
  }



  async getById(id: any): Promise<void> {
    try {
      const body = { id: this.orgIdFromLocalHost };
  
      // Fetch organization details
      const res = await lastValueFrom(this.organizationService.getOrganizationById(body));
  
      if (res && res.StatusCode === 200) {
        const result = res.Result;
  
        // Map organization details to the model
        this.model.companyRegNo = result.CompanyRegNo;
        this.model.name = result.Name;
        this.model.vatRegNo = result.VatRegistrationNo;
        this.model.email = result.Email;
        this.model.address = result.Address;
        this.model.phone = result.PhoneNo;
        this.model.landline = result.Landline;
        this.model.website = result.Website ? result.Website : null;
        this.model.postcode = result.Postcode;
        this.model.town = result.Town;
  
        // Map selected country
        this.selectedCountry = this.countryArray.find((x) => x.name === result.Country);
  
        if(result.ImageName && result.Image){
          this.profileImage = environment.userModuleApiImageBaseUrl + result.Image
        }

        if (this.selectedCountry) {
          // Fetch states for the selected country
          await this.getAllState(this.selectedCountry.id);
  
          // Map selected state
          this.selectedState = this.stateArray.find((x) => x.name === result.State);
  
          if (this.selectedState) {
            // Fetch cities for the selected state
            await this.getAllCity();
  
            // Map selected city
            this.selectedCity = this.cityArray.find((x) => x.name === result.City);
          }
        }
  
        // Map timezone
        this.selectedTimezone = this.timezoneArray.find((x) => x.id === result.TimeZoneId);
      }
    } catch (error) {
      console.error('Error fetching organization details:', error);
    }
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
            this.profileImageName = response.OrgionalFileName;
            this.profileImage = environment.userModuleApiImageBaseUrl + this.imageUrl
            // this.getProfileImage();
            // this.logoPreview = environment.userModuleApiImageBaseUrl + this.imageUrl
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

  onSave() {
  
   

  }
}
