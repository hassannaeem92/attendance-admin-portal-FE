import { Component, EventEmitter, inject, Output } from '@angular/core';
import { forkJoin, lastValueFrom } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { NgClass, NgIf } from '@angular/common';
import { NgSelectModule } from '@ng-select/ng-select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Utils } from '../../../utils';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { LocationService } from '../../../views/_services/location/location.service';
import { OrganizationService } from '../../../views/_services/organization/organization.service';
import { CompanyService } from '../../../views/_services/companies/company.service';
import { Page } from '../../page';
import { OrganizationModalComponent } from '../organization-modal/organization-modal.component';
import { CompanyModalComponent } from '../company-modal/company-modal.component';
declare const $: any

@Component({
  selector: 'app-company-location-modal',
  standalone: true,
  imports: [FormsModule, NgIf, RouterLink, NgClass, NgSelectModule, MatDatepickerModule, MatNativeDateModule, MatFormFieldModule, MatInputModule, OrganizationModalComponent, CompanyModalComponent],
  templateUrl: './company-location-modal.component.html',
  styleUrl: './company-location-modal.component.scss'
})
export class CompanyLocationModalComponent {
  @Output() isComLocAdded = new EventEmitter<any>();

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
    // this.utils.showLoader();
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
          this.organizationArray = filteredRows.map((item: any) => ({
            id: item.Id,
            name: item.Name
          }));
        }

        if (results.companies && results.companies.StatusCode === 200) {
          this.companyData = results.companies.Result;
          let filteredRows = this.companyData.filter(row => row.IsActive);
          this.companyArray = filteredRows.map((item: any) => ({
            id: item.Id,
            name: item.Name
          }));
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
        // this.utils.hideLoader();
        console.error('Error loading initial data:', err);
      },
      complete: () => {
        // this.utils.hideLoader();
      },
      
    });

  }


  onSubmit(NgForm: any) {

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

      IsFacial: false,
      IsBiometric: false,
      IsSSN	: true,
      IsLastNam: false
    }


    this.locationService.addLocation(body).subscribe(res => {
      if (res && res.StatusCode == 200) {
        this.utils.notification(res.CommonMessage, 'success');
        $('#company-location-modal').modal('hide');

        this.isComLocAdded.emit(true);
        // this.router.navigate(['/main/attendance/client-company-location']);

      }
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
