import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseAPI } from '../../../core/services/baseApi';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RoleService extends BaseAPI {

  constructor(protected http: HttpClient) {
    super(http);
  }

  getRoleList(clientId) {
    this.API_URL = "/api/clients/" + clientId + `/Roles`;
    return this.getAll();
  }

  getRole(clientId, roleId) {
    return this.getCallById("/api/clients/" + clientId + `/roles/${roleId}`);
  }

  getRoleUser(clientId, roleId, userId) {
    return this.getCallById("/api/clients/" + clientId + `/roles/${roleId}/users/${userId}`);
  }


  getForNewRole(clientId) {
    return this.getCallById("/api/clients/" + clientId + `/Permissions`);
  }

  changePermission(clientId, clientRoleId, permissionId, assignToAllUser, modal,permissionEventCheck): Observable<any> {
    if(permissionEventCheck == true){
      return this.putCall("/api/clients/" + clientId + `/roles/${clientRoleId}/permissions/${permissionId}/${assignToAllUser}/add`, modal);
    }
    else{
    return this.putCall("/api/clients/" + clientId + `/roles/${clientRoleId}/permissions/${permissionId}/${assignToAllUser}/remove`, modal);
    }
  }

  changePermissionUser(clientId, clientRoleId, userId, permissionId, modal): Observable<any> {
    return this.putCall("/api/clients/" + clientId + `/roles/${clientRoleId}/users/${userId}/permissions/${permissionId}`, modal);
  }

  deleteRole(clientId, roleId): Observable<any> {
    return this.deleteCall("/api/clients/" + clientId + `/roles/${roleId}`, null);
  }

  createRole(clientId, modal): Observable<any> {
    this.API_URL = "/api/clients/" + clientId + `/roles`;
    return this.create(modal);
  }

  updateRole(clientId, roleId, modal): Observable<any> {
    debugger
    this.API_URL = "/api/clients/" + clientId + `/roles`;
    return this.update(roleId, modal);
  }

  checkCustomPermission(clientId, clientRoleId): Observable<any> {
    return this.getCallById("/api/clients/" + clientId + "/roles/" + clientRoleId+"/custom");
  }

  resetClientRolePermission(clientId, clientRoleId, deleteUserPermission): Observable<any> {
    return this.deleteCall("/api/clients/" + clientId + `/roles/${clientRoleId}/permissions/reset/${deleteUserPermission}`, null);
  }

  resetUserRolePermission(clientId, userId): Observable<any> {
    return this.deleteCall("/api/clients/" + clientId + `/users/${userId}/permissions/reset`, null);
  }
}




