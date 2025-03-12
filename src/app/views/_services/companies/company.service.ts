import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment.development';
import { GlobalApiCallService } from '../../../_sharedresources/_services/global-api-call.service';

@Injectable({
  providedIn: 'root'
})
export class CompanyService {
readonly globalApiService = inject(GlobalApiCallService);
  
  
    private getAllCompanysUrl = environment.userModuleApiBaseUrl + 'Organization/GetAllCompanys';
    private getCompanyDetaByIdilUrl = environment.userModuleApiBaseUrl + 'Organization/GetCompanyById';
    private addCompanyUrl = environment.userModuleApiBaseUrl + 'Organization/AddEditCompany';
    private deleteCompanyUrl = environment.userModuleApiBaseUrl + 'Organization/DeletetCompanyById';
  
    private getAllCountryUrl = environment.userModuleApiBaseUrl + 'Organization/getAllCountry';
    private getAllStateUrl = environment.userModuleApiBaseUrl + 'Organization/getAllState';
    private getAllCityUrl = environment.userModuleApiBaseUrl + 'Organization/getAllCity';

  constructor() { }


  getAllCompanys(body: any, pIndex, orgId?,isActive?){
    const options = {searchTerm: body.searchKeyword, isDropdown: body.isDropdown, organizationId: orgId ? orgId : '',isActive:isActive == null ? '' : isActive};
    const request = {PageIndex: pIndex, PageSize: body.pageSize};

    return this.globalApiService.postRequestParam(this.getAllCompanysUrl, request, options);
   
  }

  getAllCompanysDrop(id?, isOrganization?){
    const options = {searchTerm: 'a', isDropdown: true, isActive: true, organizationId: id ? id : '', isOrganization: isOrganization ? isOrganization : false};
    const request = {PageIndex: 0, PageSize: 0};



    return this.globalApiService.postRequestParam(this.getAllCompanysUrl, request, options);
   
  }


  getUserById(body){
    return this.globalApiService.getRequest(this.getCompanyDetaByIdilUrl, body);
  }

  addCompany(body){
    return this.globalApiService.postRequest(this.addCompanyUrl, body);
  }

  deleteCompany(body){
    const urlWithQuery = `${this.deleteCompanyUrl}?id=${body.id}`;
    return this.globalApiService.getRequest(urlWithQuery);
    // return this.globalApiService.getRequest(this.deleteCompanyUrl, body.id);
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

  getCompanyById(body){
    const urlWithQuery = `${this.getCompanyDetaByIdilUrl}?id=${body.id}`;
    return this.globalApiService.getRequest(urlWithQuery);
   
  }
}
