import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { finalize, tap } from 'rxjs/operators';
import { AppInjector } from 'src/app/app-injector.service';

import { ClientService} from "../../../shared/services"
import { RouteLinks } from '../../modals';
import { ErrorMessage, SuccessMessage, WarningMessage } from '../../enum/message';
import { AuthenticationService } from '../../services';
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
  selector: 'app-base',
  templateUrl: './base.component.html',
  styleUrls: ['./base.component.css']
})
export class BaseComponent implements OnInit {
  protected ClientService: ClientService;   
  protected AuthenticationService: AuthenticationService;
  protected SnackBar:MatSnackBar;
  setting: any;
  permissions: any;
  routeLinks:RouteLinks;
  successMessages:SuccessMessage;
  errorMessages:ErrorMessage;
  warningMessages:WarningMessage;
  
  constructor(

  ) { 
    // Manually retrieve the dependencies from the injector    
    // so that constructor has no dependencies that must be passed in from child    
    const injector = AppInjector.getInjector();    
    this.ClientService = injector.get(ClientService);
    this.AuthenticationService = injector.get(AuthenticationService);
    this.SnackBar = injector.get(MatSnackBar);

    if(this.AuthenticationService.isAlreadySignIn() && this.setting == undefined){
      this.getClientSetting();
      this.permissions = this.AuthenticationService.permissionFunction();
    }
    this.routeLinks = new RouteLinks();
  }

  ngOnInit() {
  }


  getClientSetting() {
    var clientId = localStorage.getItem("clientID");
    if (localStorage.getItem("settings") != null) {
      var settingObject = localStorage.getItem("settings");
      this.setting = JSON.parse(settingObject);
    }
    else {
      this.ClientService
        .getClientSetting(clientId)
        .pipe(
          tap(result => {
            if (result.data != null && result.data != undefined)
              this.setting = result.data;
            localStorage.setItem("settings", JSON.stringify(this.setting));
          },
            (error: any) => {
              console.log(`error on retriving state list : ${error}`);
            }
          ),
          finalize(() => { })
        )
        .subscribe();
    }
  }

  // ***************** Form Touched Method *****************// 
   markFormGroupTouched(formGroup: FormGroup) {
    (<any>Object).values(formGroup.controls).forEach(control => {
      control.markAsTouched();

      if (control.controls) {
        this.markFormGroupTouched(control);
      }
    });
  }
  // ***************** Form Touched Method *****************// 

  // ***************** CheckValidation Method *****************// 
   validateForm = (form: FormGroup, controlName: string, errorName: string) => {
    return form.controls[controlName].hasError(errorName);
  }
  // ***************** CheckValidation Method *****************// 


  // ***************** Filter Type Check Method *****************//
   validDocumentExt(fileName: string): boolean {
    var ext = fileName.split('.')[fileName.split('.').length - 1];
    if (ext === 'txt' || ext === 'csv' || ext === 'pdf' || ext === 'xlsx' || ext === 'zip' || ext === 'doc' || ext === 'docx' || ext === 'xml' || ext === 'xls' || ext === 'jpg' || ext === 'jpeg' || ext === 'png' || ext === 'ppt' || ext === 'rpt' || ext === 'aci' || ext === 'zap' || ext === 'zoo') {
      return true;
    }
    return false;
  }
  // ***************** Filter Type Check Method *****************// 

  // ***************** Data Sorting Method *****************// 
   sort(column, array) {
    if (array._sortColumn == undefined) {
      array._sortColumn = true;
    }
    if (array._sortColumn) {
      this.ascendic(column, array);
    }
    else {
      this.descendic(column, array);
    }
    array._sortColumn = !array._sortColumn;
  }

   ascendic(column, list) {
    list = list.sort((n1, n2) => {
      if (n1[column] < n2[column]) {
        return 1;
      }
      if (n1[column] > n2[column]) {
        return -1;
      }
      return 0;
    });
  }

   descendic(column, list) {
    list = list.sort((n1, n2) => {
      if (n1[column] > n2[column]) {
        return 1;
      }
      if (n1[column] < n2[column]) {
        return -1;
      }
      return 0;
    });
  }
  // ***************** Data Sorting Method *****************// 

  Success(masssage:SuccessMessage,params:string[],duration?:number);
  Success(masssage:SuccessMessage,param:string,duration?:number);
 
 
  Success(masssage:SuccessMessage,params:any = null,duration = 4000){
    this.openSnackBar(masssage,params,duration,'success')
  }


 Error(masssage:ErrorMessage,params:string[],duration?:number);
 Error(masssage:ErrorMessage,param:string,duration?:number);


 Error(masssage:ErrorMessage,params:any = null,duration = 4000){
  this.openSnackBar(masssage,params,duration,'error')
 }

 
 Warning(masssage:WarningMessage,params:string[],duration?:number);
 Warning(masssage:WarningMessage,param:string,duration?:number);


 Warning(masssage:WarningMessage,params:any = null,duration = 4000){
  this.openSnackBar(masssage,params,duration,'warning')
 }


 openSnackBar(masssage,params,duration,typeClass){
  var msg = masssage.toString()
  if(params){
    if(typeof(params) === "string"){
      msg = msg.replace("{0}",params);
    }
    else{
      for (let index = 0; index < params.length; index++) {
        const param = params[index];
        msg = msg.replace("{"+index+"}",param);
      }
    }
  }
  this.SnackBar.open(msg, '', {duration: duration, panelClass: typeClass});
 }

}
