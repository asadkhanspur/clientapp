
import { Component, ElementRef, OnDestroy, OnInit, QueryList, Renderer2, TemplateRef, ViewChild, ViewChildren } from '@angular/core';
import { COMMA, ENTER, TAB } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatSnackBar } from '@angular/material/snack-bar';
import { finalize, retry, tap } from 'rxjs/operators';
import { filter } from 'rxjs/operators';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import * as $ from 'jquery';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { NotificationTemplateService, TemplateTypeService } from '../../service';
import { DocumentTypesService } from 'src/app/shared/services';
import { BaseComponent } from 'src/app/core/components';


@Component({
  selector: 'app-notification-list',
  templateUrl: './notification-list.component.html',
  styleUrls: ['./notification-list.component.css']
})
export class NotificationListComponent extends BaseComponent implements OnInit {

  gifLoader = false
  clientNotificationTemplateLists = []
  errorMessage:any
  isNotificationView: boolean = false;
  isNotificationEdit: boolean = false;
  notficationList: string
  modalRef: BsModalRef;
  documentTypes = [];
  allDocumentTypes: any = [];
  notificationTemplateForm: FormGroup;
  templateVariables = [];
  templateVariablesForConditionalText: [];
  templateVariableForRecipientsEmail = [];
  templateVariableFound: boolean = false;
  roleList = [];
  conditionForm: FormGroup;
  conditions = [];
  stringConditions = ['Equals', 'Not Equal'];
  otherConditions = ['Greater Than Equal To', 'Less Than Equal To', 'Greater Than', 'Less Than', 'Equals', 'Not Equal'];
  templateTypeId: number;
  clientEmailTemplateForm: FormGroup;
  htmlContent: string = '';
  emailTemplateContentValidationFailed: boolean = false;
  documentCategoryTypes = []

  constructor(
    private snackBar: MatSnackBar,
    private modalService: BsModalService,
    private notificationTemplateService: NotificationTemplateService,
    private templateTypeService: TemplateTypeService,
    private DocumentTypesService: DocumentTypesService,
  ) {
    super();
  }

  ngOnInit() {
    this.getClientNotificationTemplateList();

    this.clientEmailTemplateForm = new FormGroup({
      clientEmailTemplateId: new FormControl(0),
      emailTemplateName: new FormControl('', [Validators.required, Validators.maxLength(100)]),
      emailTemplateSubject: new FormControl('', [Validators.required]),
      documentCategoryTypeId: new FormControl(0, [Validators.required, Validators.min(1)]),
      // documentTypeId: new FormControl(0, [Validators.required, Validators.min(1)]),
      documentTypeId: new FormControl(0),
      emailTypeId: new FormControl(0),
      templateTypeId: new FormControl('', [Validators.required]),
      emailTemplateContent: new FormControl('', [Validators.required]),
      emailTo: new FormControl(''),
      emailCc: new FormControl(''),
      emailBcc: new FormControl('')
    });

    this.notificationTemplateForm = new FormGroup({
      notificationTemplateId: new FormControl(0),
      documentCategoryTypeId: new FormControl(0, [Validators.required, Validators.min(1)]),
      notificationTypeId: new FormControl(0, [Validators.required, Validators.min(1)]),
      conditionColumnName: new FormControl(''),
      notificationTemplateName: new FormControl(''),
      notificationTemplateCustomContent: new FormControl('', [Validators.required])
    });

    
    this.conditionForm = new FormGroup({
      condition: new FormControl('', [Validators.required]),
      conditionColumnName: new FormControl('', [Validators.required]),
      conditionValue: new FormControl('', [Validators.required]),
      conditionResultTextArea: new FormControl('', [Validators.required])
    });
  }

  getDocumentCategoryTypes() {
    this.DocumentTypesService
      .getDocumentCategoryTypes()
      .pipe(
        tap(result => {
          debugger
          this.documentCategoryTypes = result.data.clientDocumentCategoryTypes;
        },
          (error: any) => {
            this.errorMessage = error.error.message;
            console.log(`error on retriving state list : ${error}`);
          }
        ),
        finalize(() => { })
      )
      .subscribe();
  }


  notificationTypes = []
  getNotificationTypes() {
    var clientId = localStorage.getItem("clientID");
    this.notificationTemplateService.setClientId = clientId;
    this.notificationTemplateService.getNotificationTypes(filter).pipe(
      tap(result => {
        this.notificationTypes = result.data;

      },
        (error: any) => {
          this.gifLoader = false;
          this.errorMessage = error.error.message;
          this.snackBar.open(this.errorMessage, '', {
            duration: 2000,
          });
          console.log(`error on retriving notification type list : ${error}`);
        }
      ),
      finalize(() => {
        //this.changeDetectorRefs.detectChanges();
      })
    )
      .subscribe(
      )
  }

  getClientNotificationTemplateList(filter?: any) {
    debugger;
    this.gifLoader = true;
    var clientId = localStorage.getItem("clientID");
    this.notificationTemplateService.setClientId = clientId;
    this.notificationTemplateService.getClientNotificationTemplates(filter).pipe(
      tap(result => {
        this.clientNotificationTemplateLists = result.data.clientNotificationTemplates;
        this.gifLoader = false;

      },
        (error: any) => {
          this.gifLoader = false;
          this.errorMessage = error.error.message;
          this.snackBar.open(this.errorMessage, '', {
            duration: 2000,
          });
          console.log(`error on retriving client notification template list : ${error}`);
        }
      ),
      finalize(() => {
        //this.changeDetectorRefs.detectChanges();
      })
    )
      .subscribe(
      );
  }

   //Popup existing notification template
   openModalWithClassExistingNotificationTemplate(template: TemplateRef<any>, notificationTemplateId, editMode) {
    debugger;

    if (editMode) {
      this.onEditNotificationTemplate(notificationTemplateId);
    } else {
      this.onNotificationTemplateView(notificationTemplateId);
    }

    this.modalRef = this.modalService.show(
      template,
      Object.assign({}, { class: 'deletepopup editNotification' })
    );

  }

  onEditNotificationTemplate(notificationTemplateId) {
    this.isNotificationView = false;
    this.isNotificationEdit = true;

    this.notificationTemplateService.getClientNotificationTemplate(notificationTemplateId).pipe(
      tap(result => {
        debugger;
        this.documentTypes = this.allDocumentTypes.filter(x => x.documentTypeId == result.data["documentTypeId"]);
        this.notificationTemplateForm.patchValue(result.data);

        if (result.data['notificationTemplateCustomContent'] !== null) {
          this.notificationTemplateForm.controls['notificationTemplateCustomContent'].setValue(result.data['notificationTemplateCustomContent']);
        } else {
          this.notificationTemplateForm.controls['notificationTemplateCustomContent'].setValue(result.data['notificationTemplateContent']);
        }

        this.getTemplateVariableMappings(result.data["templateTypeId"]);
      },
        (error: any) => {
          this.errorMessage = error.error.message;
          this.snackBar.open(this.errorMessage, '', {
            duration: 2000,
          });
          console.log(`error on retrieving client notification : ${error}`);
        }),
      finalize(() => {
      })
    )
      .subscribe();
  }

  onNotificationTemplateView(id: Number) {
    this.isNotificationView = true;
    this.isNotificationEdit = false;

    this.notificationTemplateService.getClientNotificationTemplate(id).pipe(
      tap(result => {
        debugger;

        this.documentTypes = this.allDocumentTypes.filter(x => x.documentTypeId == result.data["documentTypeId"]);

        this.notificationTemplateForm.patchValue(result.data);
        this.getTemplateVariableMappings(result.data["templateTypeId"]);

        if (result.data['notificationTemplateCustomContent'] !== null) {
          this.notificationTemplateForm.controls['notificationTemplateCustomContent'].setValue(result.data['notificationTemplateCustomContent']);
        } else {
          this.notificationTemplateForm.controls['notificationTemplateCustomContent'].setValue(result.data['notificationTemplateContent']);
        }
      },
        (error: any) => {
          this.errorMessage = error.error.message;
          this.snackBar.open(this.errorMessage, '', {
            duration: 2000,
          });
          console.log(`error on retrieving client notification : ${error}`);
        }),
      finalize(() => {
      })
    )
      .subscribe();
  }

  templateTypeChanged(templateTypeId) {
    this.getTemplateVariableMappings(templateTypeId.value);
  }

  getTemplateVariableMappings(templateTypeId) {
    this.templateTypeService
      .getTemplateTypeVariableMapping(templateTypeId)
      .pipe(
        tap(result => {
          debugger;
          this.templateVariables =  result.data.filter(x => x.columnName.includes("_Id") == false);
          this.templateVariableForRecipientsEmail = this.templateVariables.filter(x => x.columnName.includes("email") || x.columnName.includes("Email"));
          if (this.roleList.length > 0) {
            this.roleList.forEach(element => {
              this.templateVariableForRecipientsEmail.push({ 
                columnDisplayName: element.roleName, 
                columnName: element.roleName });
            });

            this.templateVariableForRecipientsEmail.push({ 
              columnDisplayName: "Order Users", 
              columnName: "Order Users" });
              
            this.templateVariableForRecipientsEmail.push({ 
              columnDisplayName: "Borrower User", 
              columnName: "Borrower User" });

              this.templateVariableForRecipientsEmail.push({ 
                columnDisplayName: "Specific User", 
                columnName: "Specific User" });

                this.templateVariableForRecipientsEmail.push({ 
                  columnDisplayName: "Delivery Email Users", 
                  columnName: "Delivery Email Users" });

          }
          this.templateVariableFound = true;
          this.conditionForm.controls['conditionColumnName'].patchValue(this.templateVariables[0].columnName);
          this.templateVariablesForConditionalText = result.data.filter(x => x.isForConditionVariable == true);
          // if(this.templateVariablesForConditionalText !== undefined){
          //   this.conditionForm.controls['conditionColumnName'].patchValue(this.templateVariablesForConditionalText[0].columnName);
          // }
          this.onTemplateVariableChange(this.templateVariables[0].columnName);
        },
          (error: any) => {
            this.errorMessage = error.error.message;
            console.log(`error on retriving template variable list : ${error}`);
          }
        ),
        finalize(() => { })
      )
      .subscribe();
  }

  onTemplateVariableChange(columnName) {
    debugger;
    //Filter out column data from the list 
    var templateVariableData = this.templateVariables.filter(x => x.columnName == columnName);
    if (templateVariableData !== null) {
      //Now get its data type
      var dataType = templateVariableData[0].dataType;
  
      switch (dataType) {
        case "string": {
          this.conditions = this.stringConditions;
          break;
        }
        case "int": {
          this.conditions = this.otherConditions;
          break;
        }
        case "Datetime": {
          this.conditions = this.otherConditions;
          break;
        }
        default: {
          this.conditions = [];
          break;
        }
      }
      this.conditionForm.controls['condition'].patchValue(this.conditions[0]);
    }
  }

  public checkNotificationTemplatePopupError = (controlName: string, errorName: string) => {
    return this.notificationTemplateForm.controls[controlName].hasError(errorName);
  }

  addTemplateVariableToNotificationContent(templateVariableColumnName) {
    debugger;
    var textToInsert = " {$" + templateVariableColumnName.replace(" ", "_") + "} ";
    this.insertNotificationTextAtCursor(textToInsert);
  }

  insertNotificationTextAtCursor(textToInsert) {
    textToInsert = this.notificationTemplateForm.controls["notificationTemplateCustomContent"].value + " " + textToInsert;
    this.notificationTemplateForm.controls["notificationTemplateCustomContent"].patchValue(textToInsert);
    // make sure we have focus in the right input
    // and just run the command
  }

  onNotificationEnableChange(event, notificationTemplateId, isForMobile) {
    debugger;
    this.gifLoader = true;
    if (event.checked) {
      this.notificationTemplateService.putActiveClientNotificationTemplate(notificationTemplateId, isForMobile).pipe(
        tap(result => {

          this.snackBar.open(result.message, '', {
            duration: 8000,
          })
          this.gifLoader = false;
        },
          (error: any) => {
            this.gifLoader = false
            this.errorMessage = error.error.message;
            this.snackBar.open(this.errorMessage, '', {
              duration: 2000,
            });
            console.log(`error on create Client Notification Template : ${error}`);
          }),
        finalize(() => {
        })
      )
        .subscribe();
    } else {
      this.notificationTemplateService.putInActiveClientNotificationTemplate(notificationTemplateId, isForMobile).pipe(
        tap(result => {

          this.snackBar.open(result.message, '', {
            duration: 8000,
          })
          this.clientNotificationTemplateLists = result.data.clientNotificationTemplates;
          this.gifLoader = false;
        },
          (error: any) => {
            this.gifLoader = false
            this.errorMessage = error.error.message;
            this.snackBar.open(this.errorMessage, '', {
              duration: 2000,
            });
            console.log(`error on create Client Notification Template : ${error}`);
          }),
        finalize(() => {
        })
      )
        .subscribe();
    }
  }

  
  onCategoryChange(event) {
    debugger
    this.documentTypes = this.allDocumentTypes.filter(x => x.documentCategoryTypeId == event.value);
    this.getTemplateTypes(event.value);
  }

  
  onSaveNotificationTemplate(data) {
    if (this.notificationTemplateForm.status !== "VALID") {
      this.validateTemplateEditor();
      return;
    }

    this.gifLoader = true;

    if (data.notificationTemplateId > 0) {
      this.updateNotificationTemplate(data);
    }
  }


  getTemplateTypes(docuemntCategoryTypeId) {
    this.templateTypeService
      .getTemplateTypes(docuemntCategoryTypeId)
      .pipe(
        tap(result => {
          debugger;
          this.getTemplateVariableMappings(result.data["templateTypeId"]);
          this.templateTypeId = result.data["templateTypeId"];

          var _obj = {
            "templateTypeId": 0
          };

          _obj.templateTypeId = this.templateTypeId;
          this.clientEmailTemplateForm.patchValue(_obj);
          console.log('TemplateType is: ', this.templateTypeId);
        },
          (error: any) => {
            this.errorMessage = error.error.message;
            console.log(`error on retriving template type list : ${error}`);
          }
        ),
        finalize(() => { })
      )
      .subscribe();
  }

  private updateNotificationTemplate(data) {
    debugger;

    this.notificationTemplateService.putClientNotificationTemplate(data.notificationTemplateId, data).pipe(
      tap(result => {

        this.snackBar.open(result.message, '', {
          duration: 8000,
        })
        this.modalRef.hide();
        this.notificationTemplateForm.markAsPristine();
        this.getClientNotificationTemplateList();
        this.gifLoader = false;
      },
        (error: any) => {
          this.gifLoader = false
          this.errorMessage = error.error.message;
          this.snackBar.open(this.errorMessage, '', {
            duration: 2000,
          });
          console.log(`error on create Client Document Template : ${error}`);
        }),
      finalize(() => {
      })
    )
      .subscribe();
  }



  validateTemplateEditor() {
    if ((this.htmlContent == null || this.htmlContent === undefined || this.htmlContent.length === 0))
      this.emailTemplateContentValidationFailed = true;
  }


  closeNotificationTemplateModal() {
    this.modalRef.hide();
    this.isNotificationEdit = false;
    this.isNotificationView = false;
    this.templateVariables = [];
    this.emailTemplateContentValidationFailed = false;
    this.notificationTemplateForm.reset({});
  }

}
