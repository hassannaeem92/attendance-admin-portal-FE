import { inject, Injectable } from '@angular/core';
import { GlobalApiCallService } from '../../../_sharedresources/_services/global-api-call.service';
import { environment } from '../../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class LocationService {

    readonly globalApiService = inject(GlobalApiCallService);
  
  
    private getAllLocationsUrl = environment.userModuleApiBaseUrl + 'Organization/GetAllLocations';
    private getLocationDetaByIdilUrl = environment.userModuleApiBaseUrl + 'Organization/GetLocationById';
    private addLocationUrl = environment.userModuleApiBaseUrl + 'Organization/AddEditLocation';
    private deleteLocationUrl = environment.userModuleApiBaseUrl + 'Organization/DeletetLocationById';
  
    private getAllCountryUrl = environment.userModuleApiBaseUrl + 'Organization/getAllCountry';
    private getAllStateUrl = environment.userModuleApiBaseUrl + 'Organization/getAllState';
    private getAllCityUrl = environment.userModuleApiBaseUrl + 'Organization/getAllCity';

  constructor() { }


  getAllLocations(body: any, pIndex, orgId?, isOrganizationLocation?,isActive? ){
    const options = {searchTerm: body.searchKeyword, isDropdown: body.isDropdown, organizationId: orgId ? orgId : '', isOrganizationLocation: isOrganizationLocation == null ? '' : isOrganizationLocation,isActive:isActive == null ? '' : isActive};
    const request = {PageIndex: pIndex, PageSize: body.pageSize};

    return this.globalApiService.postRequestParam(this.getAllLocationsUrl, request, options);
   
  }

  getAllLocationsForAdmin(body: any, pIndex, orgId,isActive?){
    const options = {searchTerm: body.searchKeyword, isDropdown: body.isDropdown, organizationId: orgId,isActive:isActive == null ? '' : isActive};
    const request = {PageIndex: pIndex, PageSize: body.pageSize};

    return this.globalApiService.postRequestParam(this.getAllLocationsUrl, request, options);
   
  }

  getAllLocationsDrop(orgId?, comId?, isOrganizationLocation?, isOrganization?){
    
    
    const options = {searchTerm: '', isDropdown: 'true', isActive: 'true', organizationId: orgId ? orgId : '', companyId: comId ? comId : '', isOrganizationLocation: isOrganizationLocation ? isOrganizationLocation: false, isOrganization: isOrganization ? isOrganization : false};
    const request = {PageIndex: 0, PageSize: 0};

    return this.globalApiService.postRequestParam(this.getAllLocationsUrl, request, options);
   
  }

  getUserById(body){
    return this.globalApiService.getRequest(this.getLocationDetaByIdilUrl, body);
  }

  addLocation(body){
    return this.globalApiService.postRequest(this.addLocationUrl, body);
  }

  deleteLocation(body){
    const urlWithQuery = `${this.deleteLocationUrl}?id=${body.id}`;
    return this.globalApiService.getRequest(urlWithQuery);
    // return this.globalApiService.getRequest(this.deleteLocationUrl, body.id);
  }


  getAllCountry(){
    const options = {searchTerm: 'a', isDropdown: 'true'};
    const request = {PageIndex: 0, PageSize: 0};

    return this.globalApiService.postRequestParam(this.getAllCountryUrl, request, options);
   
  }

  getAllState(id){
    const options = {searchTerm: 'a', isDropdown: 'true', countryId: id};
    const request = {PageIndex: 0, PageSize: 0};

    return this.globalApiService.postRequestParam(this.getAllStateUrl, request, options);
   
  }

  getAllCity(cId, sId){
    const options = {searchTerm: 'a', isDropdown: 'true', countryId: cId, stateId: sId};
    const request = {PageIndex: 0, PageSize: 0};

    return this.globalApiService.postRequestParam(this.getAllCityUrl, request, options);
   
  }

  getLocationById(body){
    const urlWithQuery = `${this.getLocationDetaByIdilUrl}?id=${body.id}`;
    return this.globalApiService.getRequest(urlWithQuery);
   
  }

}
