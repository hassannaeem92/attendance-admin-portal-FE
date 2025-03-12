import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment.development';
import { GlobalApiCallService } from '../../../_sharedresources/_services/global-api-call.service';

@Injectable({
  providedIn: 'root'
})
export class DesignationService {

  readonly globalApiService = inject(GlobalApiCallService);


  private getAllDesignationUrl = environment.userModuleApiBaseUrl + 'Organization/GetAllDesignations';
  private getDesignationDetaByIdilUrl = environment.userModuleApiBaseUrl + 'Organization/GetDesignationById';
  private addDesignationUrl = environment.userModuleApiBaseUrl + 'Organization/AddEditDesignation';
  private deleteDesignationUrl = environment.userModuleApiBaseUrl + 'Organization/DeletetDesignationById';
  private quickStartUrl = environment.userModuleApiBaseUrl + 'Account/QuickStart';

  constructor() { }

  getAllDesignation(body: any, pIndex, orgId?,isActive?,isOrganization?){
    const options = {searchTerm: body.searchKeyword, isDropdown: body.isDropdown, organizationId: orgId ? orgId : '',isActive:isActive == null ? '' : isActive,isOrganization:isOrganization == null ? '' : isOrganization};
    const request = {PageIndex: pIndex, PageSize: body.pageSize};

    return this.globalApiService.postRequestParam(this.getAllDesignationUrl, request, options);
   
  }

  getAllDesignationDrop(orgId?, comId?){
    const options = {searchTerm: 'a', isDropdown: true, isActive: true, organizationId: orgId ? orgId : '', companyId: comId ? comId : ''};
    const request = {PageIndex: 0, PageSize: 0};

    return this.globalApiService.postRequestParam(this.getAllDesignationUrl, request, options);
   
  }

  getDesignationById(body){
    // return this.globalApiService.getRequest(this.getDesignationDetaByIdilUrl, body);
    const urlWithQuery = `${this.getDesignationDetaByIdilUrl}?id=${body.id}`;
    return this.globalApiService.getRequest(urlWithQuery);
  }

  addDesignation(body){
    return this.globalApiService.postRequest(this.addDesignationUrl, body);
  }

  addUserAndCompanyQuickStart(body){
    return this.globalApiService.postRequest(this.quickStartUrl, body);
  }


  deleteDesignation(body){
    // return this.globalApiService.postRequest(this.deleteDesignationUrl, body);
    const urlWithQuery = `${this.deleteDesignationUrl}?id=${body.id}`;
    return this.globalApiService.getRequest(urlWithQuery);
  }
}
