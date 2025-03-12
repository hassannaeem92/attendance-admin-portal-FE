import { Component, inject } from '@angular/core';
import { Utils } from '../../../../utils';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { LocationService } from '../../../_services/location/location.service';
import { OrganizationService } from '../../../_services/organization/organization.service';
import { CompanyService } from '../../../_services/companies/company.service';
import { Page } from '../../../../_sharedresources/page';
import { forkJoin, lastValueFrom } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { NgClass, NgIf } from '@angular/common';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { NgSelectModule } from '@ng-select/ng-select';
import { OrganizationModalComponent } from '../../../../_sharedresources/modals/organization-modal/organization-modal.component';
import { UserServiceService } from '../../../_services/user-service.service';
import { environment } from '../../../../../environments/environment.development';
declare var $: any;

@Component({
  selector: 'app-add-edit-company',
  standalone: true,
  imports: [FormsModule, NgIf, RouterLink, NgClass, NgSelectModule, MatDatepickerModule, MatNativeDateModule, MatFormFieldModule, MatInputModule, OrganizationModalComponent],
  templateUrl: './add-edit-company.component.html',
  styleUrl: './add-edit-company.component.scss'
})
export class AddEditCompanyComponent {
  intervalId: any
  readonly utils = inject(Utils);
  readonly router = inject(Router);
  readonly route = inject(ActivatedRoute);
  readonly locationService = inject(LocationService);
  readonly organizationService = inject(OrganizationService);
  readonly companyService = inject(CompanyService);
  readonly userService = inject(UserServiceService);

  requiredText: string = 'This field is required';
  startingDate = new Date();
  paramsId: any;
  mode: string = 'create';
  currentUserId: any;

  cityData: any;
  stateData: any;
  countryData: any;
  organizationData: any;
  timeZoneData: any;

  selectedCountry: any
  countryArray: any = [];

  selectedState: any
  stateArray: any = [];

  selectedCity: any
  cityArray: any = [];

  selectedOrganization: any
  organizationArray: any = [];

  selectedTimezone: any
  timezoneArray: any = [];
  model: any = {}

  page = new Page();
  logoFile: File | null = null;
  logoPreview: string | ArrayBuffer | null = null;
  currentUserRole: any
  orgIdFromLocalHost: any
  imageName: any;
  imageUrl: any;
  imageDisplay: any;
  
  ngOnInit(): void {

    // this.utils.showLoader();
    const userData = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user') as string) : null;
    this.currentUserId = userData.Id
    this.currentUserRole = userData.Role
    this.orgIdFromLocalHost = userData.OrganizationId

    this.loadInitialData();

  }


  loadInitialData() {
    this.utils.showLoader();
    forkJoin({
      countries: this.locationService.getAllCountry(),
      organizations: this.organizationService.getAllOrganizationDrop(),
      timezones: this.organizationService.getAllTimeZone(this.page, this.currentUserId),

    }).subscribe({
      next: (results: any) => {
        // Handle countries
        
        if (results.countries && results.countries.StatusCode === 200) {
          this.countryData = results.countries.Result;
          this.countryArray = this.countryData.map((item: any) => ({
            id: item.countryId,
            name: item.name,
          }));
        }

        // Handle organizations
        if (results.organizations && results.organizations.StatusCode === 200) {
          this.organizationData = results.organizations.Result;
          this.organizationArray = [
            {id: 'add', name: 'Add Company'},
            ...this.organizationData.map((item: any) => ({
            id: item.Id,
            name: item.Name
          }))
        ]
        }

        // Handle timezones
        if (results.timezones && results.timezones.StatusCode === 200) {
          this.timeZoneData = results.timezones.Result;
          this.timezoneArray = this.timeZoneData.map((item: any) => ({
            id: item.Id,
            name: item.Name,
          }));
        }

        this.route.params.subscribe(params => {
          if (params['id']) {
            // this.utils.showLoader();
            this.mode = 'edit';
            this.paramsId = params['id'];
            this.getById(this.paramsId);
          }
        });

      },
      error: (err) => {

        console.error('Error loading initial data:', err);
      },
      complete: () => {
      },
      
    });
    this.utils.hideLoader()
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
      IsActive: true,
      OrganizationId: orgId ? orgId : null,
      TimeZoneId: this.selectedTimezone ? this.selectedTimezone.id : null,
      State: this.selectedState ? this.selectedState.name : null,
      City: this.selectedCity ? this.selectedCity.name : null,
      Country: this.selectedCountry ? this.selectedCountry.name : null,
      UserId: this.currentUserId ? this.currentUserId : "",
      Image: this.imageUrl ?? '',
      ImageName: this.imageName ?? '',

    }


    this.companyService.addCompany(body).subscribe(res => {
      if (res && res.StatusCode == 200) {
        this.utils.notification(res.CommonMessage, 'success');
        this.router.navigate(['/main/attendance/company']);
        this.utils.hideLoader();

      }else {
      this.utils.hideLoader();

      }
    }, (error) => {
    this.utils.hideLoader();

    })
  }


  async getAllState(countryId: any): Promise<void> {
    try {
      const res = await lastValueFrom(this.companyService.getAllState(countryId));
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
    }
  }




  async getAllCity(): Promise<void> {
    try {
      const res = await lastValueFrom(
        this.companyService.getAllCity(this.selectedCountry.id, this.selectedState.id)
      );
      if (res && res.StatusCode === 200) {
        this.cityData = res.Result;

        this.cityArray = this.cityData.map((item: any) => ({
          id: item.cityId,
          name: item.name,
        }));
        // 
      }
    } catch (error) {

      console.error('Error fetching cities:', error);
    } finally {
    }
  }




  getAllTimeZone() {

    this.organizationService.getAllTimeZone(this.page, this.currentUserId).subscribe(res => {
      if (res && res.StatusCode == 200) {

        this.timeZoneData = res.Result;

        this.timezoneArray = this.timeZoneData.map((item: any) => ({
          id: item.Id,
          name: item.Name
        }));


      }
    })
  }
  async getById(id: any) {
    const body = { id };

    try {
      const res = await lastValueFrom(this.companyService.getCompanyById(body));

      if (res && res.StatusCode === 200) {
        var editResult = res.Result;
        this.model.companyRegNo = editResult.CompanyRegNo;
        this.model.name = editResult.Name;
        this.model.vatRegNo = editResult.VatRegistrationNo;
        this.model.email = editResult.Email;
        this.model.address = editResult.Address;
        this.model.phone = editResult.PhoneNo;
        this.model.landline = editResult.Landline;
        this.model.website = editResult.Website ? editResult.Website : null;
        this.model.postcode = editResult.Postcode;
        this.model.town = editResult.Town;

        this.selectedOrganization = this.organizationArray.find((x) => x.id === editResult.OrganizationId);
        this.selectedCountry = this.countryArray.find((x) => x.name === editResult.Country);
        this.selectedTimezone = this.timezoneArray.find((x) => x.id === editResult.TimeZoneId);


        if(editResult.ImageName && editResult.Image){
          this.logoPreview = environment.userModuleApiImageBaseUrl + editResult.Image
        }

        if (this.selectedCountry) {
          // Fetch states for the selected country
          await this.getAllState(this.selectedCountry.id);

          // Map selected state
          this.selectedState = this.stateArray.find((x) => x.name === editResult.State);

          if (this.selectedState) {
            // Fetch cities for the selected state
            await this.getAllCity();

            // Map selected city
            this.selectedCity = this.cityArray.find((x) => x.name === editResult.City);
          }
        }
      }
    } catch (error) {
      console.error('Error in getById:', error);
    }
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

  
  isOrgAdded(event: any){
    if(true){
      this.selectedOrganization = null
      this.organizationService.getAllOrganizationDrop().subscribe(res => {
        if (res && res.StatusCode == 200) {
          this.organizationData = res.Result;
          var filteredRows = this.organizationData.filter(row => row.IsActive);
          this.organizationArray =[
            {id: 'add', name: 'Add Company'},
            ... filteredRows.map((item: any) => ({
            id: item.Id,
            name: item.Name
          }))
        ]
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



  onlyDecimalNumberKey(event){
    return this.utils.onlyDecimalNumberKey(event);
  }

  onClear() {
    // Logic for clearing the form
    this.model = {};
    this.selectedCity = null;
    this.selectedCountry = null;
    this.selectedState = null;
    this.selectedOrganization = null;
    this.selectedTimezone = null;

  }

  onCountryChange() {
    if (this.selectedCountry) {
      this.getAllState(this.selectedCountry.id);
    }
  }

  onStateChange() {
    if (this.selectedCountry && this.selectedState) {
      this.getAllCity();
    }
  }

  createOrganization() {
    $('#organization-modal').modal('show');
  }

}
