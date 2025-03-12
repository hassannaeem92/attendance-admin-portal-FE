
import { inject, Injectable } from '@angular/core';
import { GlobalApiCallService } from '../../../_sharedresources/_services/global-api-call.service';
import { environment } from '../../../../environments/environment.development';
import { lastValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DevicesService {
 
  readonly globalApiService = inject(GlobalApiCallService);


  private getAllDeviceUrl = environment.userModuleApiBaseUrl + 'Organization/GetAllDevice';
  private getDeviceDetaByIdilUrl = environment.userModuleApiBaseUrl + 'Organization/GetDeviceById';
  private addDeviceUrl = environment.userModuleApiBaseUrl + 'Organization/AddEditDevice';
  private deleteDeviceUrl = environment.userModuleApiBaseUrl + 'Organization/DeleteDeviceById';
  private getAllAttendanceUrl = environment.userModuleApiBaseUrl + 'Attendance/GetAttendanceData';
  private getAllRawAttendanceUrl = environment.userModuleApiBaseUrl + 'Attendance/GetRawAttendanceData';
  private addEditDeviceSettingUrl = environment.userModuleApiBaseUrl + 'Attendance/SaveDeviceSetting';
  private getDeviceSettinglUrl = environment.userModuleApiBaseUrl + 'Attendance/GetDeviceSetting';
  private getCalendarDataUrl = environment.userModuleApiBaseUrl + 'Attendance/GetCalendarData';
  private downloadAttendancePdfUrl = environment.userModuleApiBaseUrl + 'Attendance/GetAttendanceReportPdf';
  private downloadAttendanceCsvUrl = environment.userModuleApiBaseUrl + 'Attendance/GetAttendanceReportCSV';
  private dashboardDetailsUrl = environment.userModuleApiBaseUrl + 'Attendance/GetCompanyDashboardDetails';

  constructor() { }

  getAllDevice(body: any, pIndex, orgId?,isActive?,isOrganization?){
    const options = {searchTerm: body.searchKeyword, isDropdown: body.isDropdown,  organizationId: orgId ? orgId : '',isActive:isActive == null ? '' : isActive,isOrganization:isOrganization == null ? '' : isOrganization};
    const request = {PageIndex: pIndex, PageSize: body.pageSize};

    return this.globalApiService.postRequestParam(this.getAllDeviceUrl, request, options);
   
  }

  getDeviceById(body){
    // return this.globalApiService.getRequest(this.getDeviceDetaByIdilUrl, body);
    const urlWithQuery = `${this.getDeviceDetaByIdilUrl}?id=${body.id}`;
    return this.globalApiService.getRequest(urlWithQuery);
  }

  getDashboardDetails(id){
    // return this.globalApiService.getRequest(this.getDeviceDetaByIdilUrl, body);
    const urlWithQuery = `${this.dashboardDetailsUrl}?organizationId=${id || ''}`;
    return this.globalApiService.getRequest(urlWithQuery);
  }

  getDeviceSetting(body) {
    const urlWithQuery = `${this.getDeviceSettinglUrl}?id=${body.id}&organizationId=${body.organizationId}`;
    return this.globalApiService.getRequest(urlWithQuery);
  }



  addEditDevice(body){
    return this.globalApiService.postRequest(this.addDeviceUrl, body);
  }


  addEditDeviceSetting(body){
    return this.globalApiService.postRequest(this.addEditDeviceSettingUrl, body);
  }

  deleteDevice(body){
    // return this.globalApiService.postRequest(this.deleteDeviceUrl, body);
    const urlWithQuery = `${this.deleteDeviceUrl}?id=${body.id}`;
    return this.globalApiService.getRequest(urlWithQuery);
  }

  getAllAttendacneData(body){
    // const urlWithQuery = `${this.getAllAttendanceUrl}?deviceId=${body.id}`;
    // return this.globalApiService.getRequest(urlWithQuery);

    const options = {
      fromDate: body.fromDate ? body.fromDate : '',
       toDate: body.toDate ? body.toDate : '', 
       deviceId: body.id || '',
      payPeriod: body.payPeriod ? body.payPeriod : '',
      shiftId: body.shiftId || '',

      organizatonId:body.organizatonId || '',
      organizationLocationId:body.organizationLocationId || '',
      companyId:body.companyId || '',
      companyLocatonId:body.companyLocatonId || ''
    };
    const request = {assignUsers: body.selectedUserObjs && body.selectedUserObjs?.length ? body.selectedUserObjs : []};

    return this.globalApiService.postRequestParam(this.getAllAttendanceUrl, request.assignUsers, options);

  }

  getAllRawAttendacneData(body){
    // const urlWithQuery = `${this.getAllAttendanceUrl}?deviceId=${body.id}`;
    // return this.globalApiService.getRequest(urlWithQuery);

    const options = {
      fromDate: body.fromDate ? body.fromDate : '',
       toDate: body.toDate ? body.toDate : '',
        deviceId: body.id || '',
        payPeriod: body.payPeriod ? body.payPeriod : '',
        shiftId: body.shiftId || '',

        organizatonId:body.organizatonId || '',
        organizationLocationId:body.organizationLocationId || '',
        companyId:body.companyId || '',
        companyLocatonId:body.companyLocatonId || ''    
      };
    const request = {assignUsers: body.selectedUserObjs && body.selectedUserObjs?.length ? body.selectedUserObjs : []};

    return this.globalApiService.postRequestParam(this.getAllRawAttendanceUrl, request.assignUsers, options);

  }


  getAttendanceCalendarData(body){
    // const urlWithQuery = `${this.getAllAttendanceUrl}?deviceId=${body.id}`;
    // return this.globalApiService.getRequest(urlWithQuery);

    const options = {locationId: body.locationId ? body.locationId : '', month: body.month ? body.month : '', year: body.year ? body.year : ''};
    const request = {assignUsers: body.selectedUserObjs && body.selectedUserObjs?.length ? body.selectedUserObjs : []};

    return this.globalApiService.postRequestParam(this.getCalendarDataUrl, request.assignUsers, options);

  }


  getAllDeviceDrop( orgId?, comId?, isActive?,isOrganizationLocation?, orgLocId?, comLocId?){
    const options = {searchTerm: 'a', isDropdown: true,  organizationId: orgId ? orgId : '',isActive:isActive == null ? '' : isActive,isOrganizationLocation:isOrganizationLocation == null ? '' : isOrganizationLocation, companyId: comId ? comId : '', organizationLocationId: orgLocId ? orgLocId : '', companyLocationId: comLocId ? comLocId : ''};
    const request = {PageIndex: 0, PageSize: 0};
    // const request = {PageIndex: pIndex, PageSize: body.pageSize};

    return this.globalApiService.postRequestParam(this.getAllDeviceUrl, request, options);
   
  }

  async downloadAttendance(body: any, type: any) {

    const options = {
      fromDate: body.fromDate ? body.fromDate : '',
       toDate: body.toDate ? body.toDate : '', 
       deviceId: body.id || '',
      payPeriod: body.payPeriod ? body.payPeriod : '',
      shiftId: body.shiftId || '',

      organizatonId:body.organizatonId || '',
      organizationLocationId:body.organizationLocationId || '',
      companyId:body.companyId || '',
      companyLocatonId:body.companyLocatonId || '',
      isAttendance: body.isAttendance || false
    };

    const request = {assignUsers: body.selectedUserObjs && body.selectedUserObjs?.length ? body.selectedUserObjs : []};


    try {
        const res = await lastValueFrom(this.globalApiService.postRequestWithBlob(type == 'pdf' ? this.downloadAttendancePdfUrl : this.downloadAttendanceCsvUrl, request.assignUsers, options));
        return res;
    } catch (error) {
        return this.handleError(error);
    }
  }

  private handleError(error: any): Promise<any> {
      return Promise.reject(error.message || error);
  }
}
