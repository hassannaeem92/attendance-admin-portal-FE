import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment.development';
import { GlobalApiCallService } from '../../../_sharedresources/_services/global-api-call.service';

@Injectable({
  providedIn: 'root'
})
export class ShiftAssignService {

  readonly globalApiService = inject(GlobalApiCallService);


  private getAllShiftAssignUrl = environment.userModuleApiBaseUrl + 'Attendance/GetAllShiftAssign';
  private getShiftAssignDetaByIdilUrl = environment.userModuleApiBaseUrl + 'Attendance/GetShiftAssignById';
  private addShiftAssignUrl = environment.userModuleApiBaseUrl + 'Attendance/AddEditShiftAssign';
  private deleteShiftAssignUrl = environment.userModuleApiBaseUrl + 'Attendance/DeleteShiftAssignById';
  private getAllShiftsUrl = environment.userModuleApiBaseUrl + 'Attendance/GetAllShift';

  constructor() { }

  getAllShiftAssign(body: any, pIndex, orgId?,isActive?,isOrganization?){
    const options = {searchTerm: body.searchKeyword, isDropdown: body.isDropdown, organizationId: orgId ? orgId : '',isActive : isActive == null ? '' :isActive,isOrganization:isOrganization==null ? '' : isOrganization};
    const request = {PageIndex: pIndex, PageSize: body.pageSize};

    return this.globalApiService.postRequestParam(this.getAllShiftAssignUrl, request, options);
   
  }

  // getAllShiftsDrop(orgId?, comId?, isOrganization?){
  //   const options = {searchTerm: '', isDropdown: true, isActive: true, organizationId: orgId ? orgId : '', companyId: comId ? comId : '', isOrganization: isOrganization ? isOrganization : false};
  //   const request = {PageIndex: 0, PageSize: 0};

  //   return this.globalApiService.postRequestParam(this.getAllShiftsUrl, request, options);
   
  // }

  getAllShiftsDrop( orgId?, comId?, isActive?,isOrganizationLocation?, orgLocId?, comLocId?){
    const options = {searchTerm: 'a', isDropdown: true,  organizationId: orgId ? orgId : '',isActive:isActive == null ? '' : isActive,isOrganizationLocation:isOrganizationLocation == null ? '' : isOrganizationLocation, companyId: comId ? comId : '', organizationLocationId: orgLocId ? orgLocId : '', companyLocationId: comLocId ? comLocId : ''};
    const request = {PageIndex: 0, PageSize: 0};
    // const request = {PageIndex: pIndex, PageSize: body.pageSize};

    return this.globalApiService.postRequestParam(this.getAllShiftsUrl, request, options);
   
  }

  getShiftAssignById(body){
    // return this.globalApiService.getRequest(this.getShiftAssignDetaByIdilUrl, body);
    const urlWithQuery = `${this.getShiftAssignDetaByIdilUrl}?id=${body.id}`;
    return this.globalApiService.getRequest(urlWithQuery);
  }

  addEditShiftAssign(body){
    return this.globalApiService.postRequest(this.addShiftAssignUrl, body);
  }

  deleteShiftAssign(body){
    // return this.globalApiService.postRequest(this.deleteShiftAssignUrl, body);
    const urlWithQuery = `${this.deleteShiftAssignUrl}?id=${body.id}`;
    return this.globalApiService.getRequest(urlWithQuery);
  }

}
