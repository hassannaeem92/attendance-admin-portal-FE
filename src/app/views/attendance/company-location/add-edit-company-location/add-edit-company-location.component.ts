import { Component, inject } from '@angular/core';
import { Utils } from '../../../../utils';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { LocationService } from '../../../_services/location/location.service';
import { OrganizationService } from '../../../_services/organization/organization.service';
import { CompanyService } from '../../../_services/companies/company.service';
import { Page } from '../../../../_sharedresources/page';
import { forkJoin, lastValueFrom, Subject } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { NgClass, NgIf } from '@angular/common';
import { NgSelectModule } from '@ng-select/ng-select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { OrganizationModalComponent } from '../../../../_sharedresources/modals/organization-modal/organization-modal.component';
import { CompanyModalComponent } from '../../../../_sharedresources/modals/company-modal/company-modal.component';
declare const $: any;


@Component({
  selector: 'app-add-edit-company-location',
  standalone: true,
  imports: [FormsModule, NgIf, RouterLink, NgClass, NgSelectModule, MatDatepickerModule, MatNativeDateModule, MatFormFieldModule, MatInputModule, OrganizationModalComponent, CompanyModalComponent],
  templateUrl: './add-edit-company-location.component.html',
  styleUrl: './add-edit-company-location.component.scss'
})
export class AddEditCompanyLocationComponent {
intervalId: any
  readonly utils = inject(Utils);
  readonly router = inject(Router);
  readonly route = inject(ActivatedRoute);
  readonly locationService = inject(LocationService);
  readonly organizationService = inject(OrganizationService);
  readonly companyService = inject(CompanyService);


  startingDate = new Date();
  paramsId: any;
  mode: string = 'create';
  currentUserId: any;
  requiredText: string = 'This field is required'

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

  companyData: any;
  selectedCompany: any
  companyArray: any = [];

  model: any = {}
  

  page = new Page();
  currentUserRole: any
  orgIdFromLocalHost: any;

  
  // constructor() {
  //   // Subscribe to the typeahead subject to handle search terms
  //   this.typeaheadSubject.subscribe((term) => {
  //     this.searchTerm = term;
  //     const exists = this.organizationArray.some((org) =>
  //       org.name.toLowerCase().includes(term.toLowerCase())
  //     );
  //     this.showAddButton = term.trim() !== '' && !exists;
  //   });
  // }

  ngOnInit(): void {

    // this.utils.showLoader();
    const userData = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user') as string) : null;
    this.currentUserId = userData.Id
    this.currentUserRole = userData.Role

    this.orgIdFromLocalHost = userData.OrganizationId
    
    
    setTimeout(() => {
      if(this.currentUserRole === 'Admin' && userData.OrganizationId){
        this.onOrganizationChange(userData.OrganizationId);
      }
      this.loadInitialData();
    }, 1000)





  }


  loadInitialData() {
    this.utils.showLoader();
    forkJoin({
      countries: this.locationService.getAllCountry(),
      organizations: this.organizationService.getAllOrganizationDrop(),
      companies: this.companyService.getAllCompanysDrop(this.orgIdFromLocalHost),
      timezones: this.organizationService.getAllTimeZoneDrop(this.page, this.currentUserId),

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
          let filteredRows = this.organizationData.filter(row => row.IsActive);
          this.organizationArray = [
            // {id: 'add', name: 'Add Company'},
            ...filteredRows.map((item: any) => ({
            id: item.Id,
            name: item.Name
          }))
        ]
        }

        if (results.companies && results.companies.StatusCode === 200) {
          this.companyData = results.companies.Result;
          // let filteredRows = this.companyData.filter(row => row.IsActive);
          
          // this.companyArray = this.companyData.map((item: any) => ({
          //   id: item.Id,
          //   name: item.Name
          // }));
          
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
        this.utils.hideLoader();
        console.error('Error loading initial data:', err);
      },
      complete: () => {
        this.utils.hideLoader();
      },
      
    });

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
      Name: this.model?.Name ? this.model.Name : null,
      Address: this.model?.Address ? this.model.Address : null,
      Zip: this.model?.Zip ? this.model.Zip : null,
      Notes: this.model?.Notes ? this.model.Notes : null,
      IsActive: true,
      Email: this.model?.Email ? this.model.Email : null,
      Phone: this.model?.Phone ? this.model.Phone : null,
      TimeZoneId: this.selectedTimezone ? this.selectedTimezone.id : null,
      CompanyId: this.selectedCompany ? this.selectedCompany?.id : null,
      // CompanyId: this.model?.CompanyId ? this.model.CompanyId : null,
      OrganizationId: orgId ? orgId : null,
      UserId: this.currentUserId ? this.currentUserId : "",
      State: this.selectedState ? this.selectedState.name : null,
      City: this.selectedCity ? this.selectedCity.name : null,
      Country: this.selectedCountry ? this.selectedCountry.name : null,

      IsFacial: this.model.isFacial || false,
      IsBiometric: this.model.isBiometric || false,
      IsSSN	: this.model.isSSN || false,
      IsLastName: this.model.isLastName || false
    }


    this.locationService.addLocation(body).subscribe(res => {
      if (res && res.StatusCode == 200) {
        this.utils.notification(res.CommonMessage, 'success');
        this.router.navigate(['/main/attendance/client-company-location']);
        this.utils.hideLoader();


      }
    }, (error) => {
    this.utils.hideLoader();

    })
  }







  async getAllState(countryId: any): Promise<void> {
    try {
      const res = await lastValueFrom(this.locationService.getAllState(countryId));
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
        this.locationService.getAllCity(this.selectedCountry.id, this.selectedState.id)
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




  // getAllTimeZone() {

  //   this.organizationService.getAllTimeZoneDrop(this.page, this.currentUserId).subscribe(res => {
  //     if (res && res.StatusCode == 200) {

  //       this.timeZoneData = res.Result;

  //       this.timezoneArray = this.timeZoneData.map((item: any) => ({
  //         id: item.Id,
  //         name: item.Name
  //       }));


  //     }
  //   })
  // }
  async getById(id: any) {
    const body = { id };

    try {
      const res = await lastValueFrom(this.locationService.getLocationById(body));

      if (res && res.StatusCode === 200) {
        this.model = res.Result;
        this.model.departmentName = res.Result.Name || '';
        this.model.description = res.Result.Description || '';

        this.selectedOrganization = this.organizationArray.find((x) => x.id === res.Result.OrganizationId);
        this.selectedCountry = this.countryArray.find((x) => x.name === res.Result.Country);
        this.selectedTimezone = this.timezoneArray.find((x) => x.id === res.Result.TimeZoneId);

        this.model.isFacial = res.Result.IsFacial || false,
        this.model.isBiometric = res.Result.IsBiometric || false,
        this.model.isSSN = res.Result.IsSSN || false,
        this.model.isLastName = res.Result.IsLastName || false

        this.onOrganizationChange(this.selectedOrganization.id);

        if (this.selectedCountry) {
          // Fetch states for the selected country
          await this.getAllState(this.selectedCountry.id);

          // Map selected state
          this.selectedState = this.stateArray.find((x) => x.name === res.Result.State);

          if (this.selectedState) {
            // Fetch cities for the selected state
            await this.getAllCity();

            // Map selected city
            this.selectedCity = this.cityArray.find((x) => x.name === res.Result.City);
          }
        }
      }
    } catch (error) {
      console.error('Error in getById:', error);
    }
  }

  onlyDecimalNumberKey(event){
    return this.utils.onlyDecimalNumberKey(event);
  }

    
  onOrganizationChange(id: any){
    this.selectedCompany = null;
    this.companyService.getAllCompanysDrop(id).subscribe(res => {
      if (res && res.StatusCode == 200) {
        this.companyData = res.Result;
        var filteredRows = this.companyData.filter(row => row.IsActive);
        this.companyArray = 
          filteredRows.map((item: any) => ({
          id: item.Id,
          name: item.Name
        }))
      
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
          this.organizationArray = [
            // {id: 'add', name: 'Add Company'},
            ...filteredRows.map((item: any) => ({
            id: item.Id,
            name: item.Name
          }))
        ]
        }
  
      })
    }

  }


  isComAdded(event: any){
    if(true){
      this.selectedCompany = null;
      this.selectedOrganization = null

      if(this.selectedOrganization){
        var orgId = this.selectedOrganization.id
      }else if(this.orgIdFromLocalHost){
         orgId = this.orgIdFromLocalHost
      }

      this.companyService.getAllCompanysDrop(orgId).subscribe(res => {
        if (res && res.StatusCode == 200) {
          this.companyData = res.Result;
          var filteredRows = this.companyData.filter(row => row.IsActive);
          this.companyArray = 
            
            filteredRows.map((item: any) => ({
            id: item.Id,
            name: item.Name
          }));
        
        }
      })
    
    }

  }


  onAddCompany(event: string) {
    
    if (event === 'Add Company') {
        this.createCompany(); // Call the existing function to open the popup
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
    this.selectedCity = null;
    this.selectedCountry = null;
    this.selectedState = null;
    this.selectedOrganization = null;
    this.selectedCompany = null;
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

  createCompany() {
    $('#company-modal').modal('show');
  }

}
