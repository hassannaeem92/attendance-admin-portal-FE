import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment.development';
import { GlobalApiCallService } from '../../../_sharedresources/_services/global-api-call.service';


@Injectable({
  providedIn: 'root'
})
export class DepartmentsService {

  readonly globalApiService = inject(GlobalApiCallService);


  private getAllDepartmentsUrl = environment.userModuleApiBaseUrl + 'Organization/GetAllDepartments';
  private getDepartmentDetaByIdilUrl = environment.userModuleApiBaseUrl + 'Organization/GetDepartmentById';
  private addDepartmentUrl = environment.userModuleApiBaseUrl + 'Organization/AddEditDepartment';
  private deleteDepartmentUrl = environment.userModuleApiBaseUrl + 'Organization/DeletetDepartmentById';

  constructor() { }

  getAllDepartments(body: any, pIndex, orgId?,isActive?,isOrganization?) {
    const options = {searchTerm: body.searchKeyword, isDropdown: body.isDropdown, organizationId: orgId ? orgId : '',isActive:isActive == null ? '' : isActive,isOrganization:isOrganization == null ? '' : isOrganization};
    const request = {PageIndex: pIndex, PageSize: body.pageSize};

    return this.globalApiService.postRequestParam(this.getAllDepartmentsUrl, request, options);
   
  }

  getAllDepartmentsDrop(orgId?, comId?){
    const options = {searchTerm: 'a', isDropdown: true, isActive: true, organizationId: orgId ? orgId : '', companyId: comId ? comId : ''};
    const request = {PageIndex: 0, PageSize: 0};

    return this.globalApiService.postRequestParam(this.getAllDepartmentsUrl, request, options);
   
  }

  getUserById(body){
    return this.globalApiService.getRequest(this.getDepartmentDetaByIdilUrl, body);
  }

  addDepartment(body){
    return this.globalApiService.postRequest(this.addDepartmentUrl, body);
  }

  deleteDepartment(body){
    // return this.globalApiService.postRequest(this.deleteDepartmentUrl, body);
    const urlWithQuery = `${this.deleteDepartmentUrl}?id=${body.id}`;
    return this.globalApiService.getRequest(urlWithQuery);
  }
}
