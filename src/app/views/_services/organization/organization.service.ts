import { inject, Injectable } from '@angular/core';
import { GlobalApiCallService } from '../../../_sharedresources/_services/global-api-call.service';
import { environment } from '../../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class OrganizationService {

    readonly globalApiService = inject(GlobalApiCallService);
  
  
    private getAllOrganizationsUrl = environment.userModuleApiBaseUrl + 'Organization/GetAllOrganizations';
    private getOrganizationDetaByIdilUrl = environment.userModuleApiBaseUrl + 'Organization/GetOrganizationById';
    private addOrganizationUrl = environment.userModuleApiBaseUrl + 'Organization/AddEditOrganization';
    private deleteOrganizationUrl = environment.userModuleApiBaseUrl + 'Organization/DeletetOrganizationById';
  
    private getAllCountryUrl = environment.userModuleApiBaseUrl + 'Organization/getAllCountry';
    private getAllStateUrl = environment.userModuleApiBaseUrl + 'Organization/getAllState';
    private getAllCityUrl = environment.userModuleApiBaseUrl + 'Organization/getAllCity';
    private getAllTimeZoneUrl = environment.userModuleApiBaseUrl + 'Organization/getAllTimeZones';


  constructor() { }

  getAllOrganizations(body?: any, pIndex?: number,isActive?){
    
    const options = {searchTerm: body.searchKeyword, isDropdown: body.isDropdown,isActive:isActive == null ? '' : isActive};
    const request = {PageIndex: pIndex, PageSize: body.pageSize};

    return this.globalApiService.postRequestParam(this.getAllOrganizationsUrl, request, options);
   
  }


  getAllOrganizationDrop(){
    const options = {searchTerm: '', isDropdown: true, isActive: true};
    const request = {PageIndex: 0, PageSize: 0};

    return this.globalApiService.postRequestParam(this.getAllOrganizationsUrl, request, options);
   
  }


  getOrganizationById(body){
    return this.globalApiService.getRequest(this.getOrganizationDetaByIdilUrl, body);
  }

  addOrganization(body){
    return this.globalApiService.postRequest(this.addOrganizationUrl, body);
  }

  deleteOrganization(body){
    return this.globalApiService.getRequest(this.deleteOrganizationUrl, body);
  }

  getAllCountry(body?){
    const options = {searchTerm: 'a', isDropdown: 'true'};
    const request = {PageIndex: 0, PageSize: 0};

    return this.globalApiService.postRequestParam(this.getAllCountryUrl, request, options);
   
  }

  getAllState(body, id){
    const options = {searchTerm: 'a', isDropdown: 'true', countryId: id};
    const request = {PageIndex: 0, PageSize: 0};

    return this.globalApiService.postRequestParam(this.getAllStateUrl, request, options);
   
  }

  getAllCity(body, cId, sId){
    const options = {searchTerm: 'a', isDropdown: 'true', countryId: cId, stateId: sId};
    const request = {PageIndex: 0, PageSize: 0};

    return this.globalApiService.postRequestParam(this.getAllCityUrl, request, options);
   
  }

  getAllTimeZone(body, useerId){
    const options = {searchTerm: 'a', isDropdown: true, userId: useerId ? useerId : null};
    const request = {PageIndex: 0, PageSize: 0};

    return this.globalApiService.postRequestParam(this.getAllTimeZoneUrl, request, options);
   
  }

  getAllTimeZoneDrop(body, useerId){
    // const options = {searchTerm: '', isDropdown: true, isActive: true};
    // const request = {PageIndex: 0, PageSize: 0};


    const options = {searchTerm: 'a', isActive: true, isDropdown: true, userId: useerId ? useerId : null};
    const request = {PageIndex: 0, PageSize: 0};


    return this.globalApiService.postRequestParam(this.getAllTimeZoneUrl, request, options);
   
  }

}
