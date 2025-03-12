import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { GlobalApiCallService } from '../../_sharedresources/_services/global-api-call.service';
import { HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserServiceService {
  readonly globalApiService = inject(GlobalApiCallService);


  private getUserDetailUrl = environment.userModuleApiBaseUrl + 'Account/GetUserById';
  private userStoreDetailUrl = environment.userModuleApiBaseUrl + 'Account/AddEditUser';
  private getAllUsersUrl = environment.userModuleApiBaseUrl + 'Account/GetAllUsers';
  private getAllOrganizationUrl = environment.userModuleApiBaseUrl + 'Organization/GetAllOrganizations';
  private addUserUrl = environment.userModuleApiBaseUrl + 'Account/AddEditUser';
  // private addUserUrl = environment.userModuleApiBaseUrl + 'Organization/AddEditEmployee';
  private getUserDetaByIdilUrl = environment.userModuleApiBaseUrl + 'Account/GetUserById';
  private activeUserByIdUrl = environment.userModuleApiBaseUrl + 'Account/ActiveUserById';
  private deActiveUserByIdUrl = environment.userModuleApiBaseUrl + 'Account/DeletetUserById';
  private deleteUserByIdUrl = environment.userModuleApiBaseUrl + 'Account/DeletetUserById';
  private uploadProfileImageUrl = environment.userModuleApiBaseUrl + 'Organization/UploadFile';
  private getProfileImageUrl = environment.userModuleApiBaseUrl + 'Organization/GetBaseImage';
  private forgetPasswordUrl = environment.userModuleApiBaseUrl + 'Account/ForgotPassword';
  private changePasswordUrl = environment.userModuleApiBaseUrl + 'Account/ResetPassword';
  

  constructor() { }

  getAllUsers(body, pIndex, orgId?,isActive?,isOrganization?){
    // body.searchTerm
    const options = {searchTerm: body.searchKeyword, isDropdown: body.isDropdown, organizationId: orgId ? orgId : '',isActive:isActive == null ? '' : isActive,isOrganization:isOrganization == null ? '' : isOrganization};
    const request = {PageIndex: pIndex, PageSize: body.pageSize};

    return this.globalApiService.postRequestParam(this.getAllUsersUrl, request, options);
   
  }

  getAllUsersForShiftAssign(body, pIndex, orgId?, comId?,isOrganization?, isActive?){
    // body.searchTerm
    const options = {searchTerm: body.searchKeyword, isDropdown: true, organizationId: orgId ? orgId : '',  companyId: comId ? comId : '',isOrganization:isOrganization == null ? '' : isOrganization, isActive:isActive == null ? '' : isActive};
    const request = {PageIndex: 0, PageSize: 0};
    // const request = {PageIndex: pIndex, PageSize: body.pageSize};

    return this.globalApiService.postRequestParam(this.getAllUsersUrl, request, options);
   
  }

  getAllUsersDrop(orgId?, comId?, isActive?,isOrganizationLocation?, orgLocId?, comLocId?){

    const options = {searchTerm: 'a', isDropdown: true,  organizationId: orgId ? orgId : '',isActive:isActive == null ? '' : isActive,isOrganizationLocation:isOrganizationLocation == null ? '' : isOrganizationLocation, companyId: comId ? comId : '', organizationLocationId: orgLocId ? orgLocId : '', companyLocationId: comLocId ? comLocId : ''};
    const request = {PageIndex: 0, PageSize: 0};

    return this.globalApiService.postRequestParam(this.getAllUsersUrl, request, options);
   
  }

  addEditUser(body){
    
    return this.globalApiService.postRequest(this.addUserUrl, body);
  }

  forgotPasswordSendEmail(body){
    
    return this.globalApiService.getRequest(this.forgetPasswordUrl, body);
  }

  getUserById(body){
    // return this.globalApiService.getRequest(this.getUserDetaByIdilUrl, body);
    const urlWithQuery = `${this.getUserDetaByIdilUrl}?id=${body.id}`;
    return this.globalApiService.getRequest(urlWithQuery);
  }

  activeUserById(id){
    // return this.globalApiService.getRequest(this.getUserDetaByIdilUrl, body);
    const urlWithQuery = `${this.activeUserByIdUrl}?id=${id}`;
    return this.globalApiService.getRequest(urlWithQuery);
  }

  deActiveUserById(id){
    // return this.globalApiService.getRequest(this.getUserDetaByIdilUrl, body);
    const urlWithQuery = `${this.deActiveUserByIdUrl}?id=${id}`;
    return this.globalApiService.getRequest(urlWithQuery);
  }

  getAllOrganization(body){
    // body.searchTerm
    const options = {searchTerm: 'a', isDropdown: body.isDropdown};
    const request = {PageIndex: body.pageIndex, PageSize: body.pageSize};

    return this.globalApiService.postRequestParam(this.getAllOrganizationUrl, request, options);
   
  }

  getUserProfile(body){
    return this.globalApiService.getRequest(this.getUserDetailUrl, body);
  }

  storeUserDetail(body){
    return this.globalApiService.postRequest(this.userStoreDetailUrl, body);
  }

  deleteUserById(body){
    
    // return this.globalApiService.postRequest(this.deleteDepartmentUrl, body);
    const urlWithQuery = `${this.deleteUserByIdUrl}?id=${body.id}`;
    return this.globalApiService.getRequest(urlWithQuery);
  }

  uploadImage(formData: FormData){
    
    return this.globalApiService.postMultipartRequest(this.uploadProfileImageUrl, formData);

  }

  getProfileImage(data){
    return this.globalApiService.getRequest(this.getProfileImageUrl, data);

  }

  changePassword(body){
    return this.globalApiService.getRequest(this.changePasswordUrl, body);
  }

}
