

import { Component, ElementRef, OnDestroy, OnInit, QueryList, Renderer2, TemplateRef, ViewChild, ViewChildren } from '@angular/core';
import { COMMA, ENTER, TAB } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatSnackBar } from '@angular/material/snack-bar';
import { finalize, retry, tap } from 'rxjs/operators';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { filter } from 'rxjs/operators';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import * as $ from 'jquery';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { TemplateTypeService } from '../../service';
import { SupportingDocumentService } from '../../../document-management/services';
import { DocumentTypesService } from 'src/app/shared/services';
import { Recipients, ClientEmailTemplate } from '../../modal';
import { RoleService } from '../../../acl-management/services';
import { BaseComponent } from 'src/app/core/components';


@Component({
  selector: 'app-email-management-list',
  templateUrl: './email-management-list.component.html',
  styleUrls: ['./email-management-list.component.css']
})
export class EmailManagementListComponent extends BaseComponent implements OnInit {


  // ********* Varaibale Declaration ********* //
  emailist: string
  notficationList: string
  stringConditions = ['Equals', 'Not Equal'];
  otherConditions = ['Greater Than Equal To', 'Less Than Equal To', 'Greater Than', 'Less Than', 'Equals', 'Not Equal'];
  emailTemplateContentValidationFailed: boolean = false;
  templateVariableFound: boolean = false;
  htmlContent: string = '';
  documentTypes = [];
  allDocumentTypes: any = [];
  documentCategoryTypes = [];
  roleList = [];
  templateVariables = [];
  templateVariablesForConditionalText: [];
  templateVariableForRecipientsEmail = [];
  clientEmailTemplateForm: FormGroup;
  conditionForm: FormGroup;
  conditions = [];
  conditionColumnName: string = '';
  condition: string = '';
  conditionColumnValue: string = '';
  conditionResultValue: string = '';
  filesizeMessage: string = 'Supporting Document size cannot be more than 25MB';
  FileFormat: string = 'Supporting Document format is invalid';
  clientEmailAttachments = [];
  isShowEmailCcDiv = false;
  isShowEmailBccDiv = false;
  isShowEmailCcBtn = true;
  isShowEmailBccBtn = true;
  emailTemplateLists = [];
  documentManagementIds = [];
  tempClientDocumentManagementAttachments = [];
  clientDocumentManagementAttachments = [];
  allClientDocumentManagementAttachments = [];
  clientAttachedDocsId = [];
  errorMessage: string = '';
  btnHeading: string = "Save";
  isEdit: boolean = false;
  isView: boolean = false;
  clientDocList = [];
  allClientDocsList = [];
  gifLoader = false
  templateTypeId: number;
  successMessage:any
  // ********* Varaibale Declaration ********* //


  @ViewChildren('txtArea') textAreas: QueryList<ElementRef>;
  @ViewChild('notificationTemplateContent') notificationTextArea: ElementRef;
  modalRef: any;

  constructor(
    private snackBar: MatSnackBar,
    private templateTypeService: TemplateTypeService,
    private SupportingDocumentService: SupportingDocumentService,
    private modalService: BsModalService,
    private DocumentTypesService: DocumentTypesService,
    private RoleService: RoleService,
  ) {
    super();
   }


  // ngOnDestroy(): void {
  //   throw new Error("Method not implemented.");
  // }

  ngOnInit() {
    super.ngOnInit()


    this.getClientEmailTempalteList();
    this.getDocumentList();
    this.getDocumentTypes();
    this.getDocumentCategoryTypes();
    this.getDefaultTemplate();
    this.getClientRoleList();

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

    this.conditionForm = new FormGroup({
      condition: new FormControl('', [Validators.required]),
      conditionColumnName: new FormControl('', [Validators.required]),
      conditionValue: new FormControl('', [Validators.required]),
      conditionResultTextArea: new FormControl('', [Validators.required])
    });

    var clientId = localStorage.getItem("clientID");
    this.templateTypeService.setClientId = clientId;


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

  getDocumentTypes() {
    this.gifLoader = true;
    this.DocumentTypesService
      .getAll()
      .pipe(
        tap(result => {
          //this.documentTypes = result.data.clientDocumentTypes;
          this.allDocumentTypes = result.data.clientDocumentTypes;
          this.gifLoader = false;
        },
          (error: any) => {
            this.gifLoader = false;
            this.errorMessage = error.error.message;
            console.log(`error on retriving state list : ${error}`);
          }
        ),
        finalize(() => { })
      )
      .subscribe();
  }

  getDocumentList(filter?: any) {
    this.gifLoader = true
    var clientId = localStorage.getItem("clientID");
    this.SupportingDocumentService.setClientId = clientId;
    debugger
    this.SupportingDocumentService.getClientDocuments(filter).pipe(
      tap(result => {
        debugger;
        this.allClientDocsList = result.data.clientDocuments;
        this.clientDocList = this.allClientDocsList.filter(x => 1 == 1);
        this.gifLoader = false;

        console.log('client Docs list ', this.clientDocList);
        console.log('all client Docs list ', this.allClientDocsList);

      },
        (error: any) => {
          this.gifLoader = false
          this.errorMessage = error.error.message;
          this.snackBar.open(this.errorMessage, '', {
            duration: 2000,
          });
          console.log(`error on retriving document list : ${error}`);
        }
      ),
      finalize(() => {
        //this.changeDetectorRefs.detectChanges();
      })
    )
      .subscribe(
      );
  }

  getClientRoleList() {
    this.gifLoader = true
    var clientId = localStorage.getItem("clientID");
    this.RoleService.getRoleList(clientId).pipe(
      tap(result => {
        console.log(result)
        this.gifLoader = false
        this.roleList = result.data.clientRoles;
        console.log(this.roleList);
        //this.roleList = this.roleList.filter(x => x.roleId != 1);
      },
        (error: any) => {
          this.gifLoader = false
          this.errorMessage = error.error.message;
          this.snackBar.open(this.errorMessage, '', {
            duration: 2000,
          });
          console.log(`error on retriving roles : ${error}`);
        }
      ),
      finalize(() => {
        //this.changeDetectorRefs.detectChanges();
      })
    )
      .subscribe(
      );
  }

  getClientEmailTempalteList(filter?: any) {
    this.gifLoader = true
    var clientId = localStorage.getItem("clientID");
    this.templateTypeService.setClientId = clientId;
    this.templateTypeService.getClientEmailTemplates(filter).pipe(
      tap(result => {
        debugger;
        this.emailTemplateLists = result.data.clientEmailTemplates;
        this.gifLoader = false;

      },
        (error: any) => {
          this.gifLoader = false
          this.errorMessage = error.error.message;
          this.snackBar.open(this.errorMessage, '', {
            duration: 2000,
          });
          console.log(`error on retriving client email template list : ${error}`);
        }
      ),
      finalize(() => {
        //this.changeDetectorRefs.detectChanges();
      })
    )
      .subscribe(
      );
  }


  // Template method
  defaultTemplate = ''
  getDefaultTemplate() {
    this.templateTypeService
      .getTemplate()
      .pipe(
        tap(result => {


          this.defaultTemplate = result.data.emailTemplate

        },
          (error: any) => {
            this.errorMessage = error.error.message;
            this.snackBar.open(this.errorMessage, '', {
              duration: 4000,
            });
            console.log(`error on retriving Loan Type list : ${error.error.message}`);
          }
        ),
        finalize(() => { })
      )
      .subscribe();
  }


  showCcDiv() {
    this.isShowEmailCcDiv = !this.isShowEmailCcDiv;
    this.isShowEmailCcBtn = !this.isShowEmailCcBtn;
  }
  showBccDiv() {
    this.isShowEmailBccDiv = !this.isShowEmailBccDiv;
    this.isShowEmailBccBtn = !this.isShowEmailBccBtn;
  }





editorConfig: AngularEditorConfig = {
  editable: true,
  spellcheck: true,
  height: '450px',
  minHeight: '450px',
  maxHeight: '450px',
  width: 'auto',
  minWidth: '0',
  translate: 'yes',
  enableToolbar: true,
  showToolbar: true,
  placeholder: 'Enter text here...',
  defaultParagraphSeparator: '',
  defaultFontName: '',
  defaultFontSize: '',
  fonts: [
    { class: 'arial', name: 'Arial' },
    { class: 'times-new-roman', name: 'Times New Roman' },
    { class: 'calibri', name: 'Calibri' },
    { class: 'comic-sans-ms', name: 'Comic Sans MS' }
  ],
  customClasses: [
    {
      name: 'quote',
      class: 'quote',
    },
    {
      name: 'redText',
      class: 'redText'
    },
    {
      name: 'titleText',
      class: 'titleText',
      tag: 'h1',
    },
  ],

  uploadUrl: 'v1/image',
  uploadWithCredentials: false,
  sanitize: true,
  toolbarPosition: 'top',
  toolbarHiddenButtons: [
    ['bold', 'italic', 'fontName'],
    ['fontSize', 'insertImage', 'insertVideo', 'customClasses', 'link', 'unlink', 'removeFormat', 'toggleEditorMode'],
  ],
};

public checkError = (controlName: string, errorName: string) => {
  if (controlName === 'documentTemplateContent' && (this.htmlContent === null || this.htmlContent === undefined))
    return this.clientEmailTemplateForm.controls[controlName].hasError(errorName);
  else
    return this.clientEmailTemplateForm.controls[controlName].hasError(errorName);
}

public checkCondtionalPopupError = (controlName: string, errorName: string) => {
  return this.conditionForm.controls[controlName].hasError(errorName);
}

openTemplateSlider() {
  $(".templateSlider").addClass("openedpopeup");
  this.editorConfig.editable = true;
  this.editorConfig.enableToolbar = true;

  this.htmlContent = this.defaultTemplate
}


closeTemplateSlider() {
  debugger;
  $(".templateSlider").removeClass("openedpopeup");
  this.templateVariables = [];
  this.templateVariableForRecipientsEmail = [];
  this.clientEmailTemplateForm.reset({});
  this.emailTemplateContentValidationFailed = false;
  this.emailToList = [];
  this.emailBccList = [];
  this.emailCcList = [];
  this.documentManagementIds = [];
  this.clientDocumentManagementAttachments = [];
  this.tempClientDocumentManagementAttachments = [];
  this.btnHeading = "Save";
  this.isEdit = false;
  this.isView = false;
  this.templateVariableFound = false;
  this.isShowEmailCcBtn = true;
  this.isShowEmailBccBtn = true;
  this.isShowEmailBccDiv = false;
  this.isShowEmailCcDiv = false;
  this.clientDocList = this.allClientDocsList;
}


onCategoryChange(event) {
  debugger
  this.documentTypes = this.allDocumentTypes.filter(x => x.documentCategoryTypeId == event.value);
  this.getTemplateTypes(event.value);
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

onEmailTemplateView(emailTypeId, id: number) {
  this.isView = true;
  this.isEdit = false;
  this.templateTypeService.getClientEmailTemplateById(emailTypeId, id).pipe(
    tap(result => {
      debugger;
      var emailToList = result.data["emailTo"] != null ? result.data["emailTo"].split(',') : [];
      if (emailToList.length > 0) {
        emailToList.forEach(element => {
          this.emailToList.push({ name: element });
        });
      }
      var emailBccList = result.data["emailBcc"] != null ? result.data["emailBcc"].split(',') : [];
      if (emailBccList.length > 0) {
        this.isShowEmailBccDiv = true;
        emailBccList.forEach(element => {
          this.emailBccList.push({ name: element });
        });
      }
      var emailCcList = result.data["emailCc"] != null ? result.data["emailCc"].split(',') : [];
      if (emailCcList.length > 0) {
        this.isShowEmailCcDiv = true;
        emailCcList.forEach(element => {
          this.emailCcList.push({ name: element });
        });
      }

      var clientEmailAtatchments = result.data["clientEmailAttachments"];
      if (clientEmailAtatchments !== null && clientEmailAtatchments.length > 0) {
        clientEmailAtatchments.forEach(element => {
          this.clientDocumentManagementAttachments.push({
            name: element.documentName,
            clientDocumentManagementId: element.clientDocumentManagementId
          });
        });
      }
      this.documentTypes = this.allDocumentTypes.filter(x => x.documentTypeId == result.data["documentTypeId"]);

      this.clientEmailTemplateForm.patchValue(result.data);
      this.btnHeading = "Update";
      this.gifLoader = false;
      this.getTemplateVariableMappings(result.data["templateTypeId"]);
      //this.openTemplateSlider();
      $(".templateSlider").addClass("openedpopeup");
      console.log(result);
    },
      (error: any) => {
        this.errorMessage = error.error.message;
        this.snackBar.open(this.errorMessage, '', {
          duration: 2000,
        });
        console.log(`error on retrieving check list data : ${error}`);
      }),
    finalize(() => {
    })
  )
    .subscribe();
}


onEnableChange(event, data) {
  debugger;
  this.gifLoader = true;
  if (event.checked) {
    this.templateTypeService.putActiveClientEmailTemplate(data.emailTypeId, data).pipe(
      tap(result => {
        this.snackBar.open(result.message, '', {
          duration: 8000,
        })
        this.getClientEmailTempalteList();
        // this.emailTemplateLists = result.data.clientEmailTemplates;
        this.gifLoader = false;
      },
        (error: any) => {
          this.gifLoader = false
          this.errorMessage = error.error.message;
          this.snackBar.open(this.errorMessage, '', {
            duration: 2000,
          });
          console.log(`error on create Client Email Template : ${error}`);
        }),
      finalize(() => {
      })
    )
      .subscribe();
  } else {
    this.templateTypeService.putInActiveClientEmailTemplate(data.emailTypeId, data).pipe(
      tap(result => {

        this.snackBar.open(result.message, '', {
          duration: 8000,
        })
        this.getClientEmailTempalteList();
        // this.emailTemplateLists = result.data.clientEmailTemplates;
        this.gifLoader = false;
      },
        (error: any) => {
          this.gifLoader = false
          this.errorMessage = error.error.message;
          this.snackBar.open(this.errorMessage, '', {
            duration: 2000,
          });
          console.log(`error on create Client Email Template : ${error}`);
        }),
      finalize(() => {
      })
    )
      .subscribe();
  }
}

onEditClientEmailTemplate(emailTypeId, clientEmailTemplateId) {
  debugger;
  this.editorConfig.editable = true;
  this.editorConfig.enableToolbar = true;
  this.gifLoader = true;
  this.isView = false;
  var clientId = localStorage.getItem("clientID");
  this.templateTypeService.setClientId = clientId;
  this.templateTypeService.getClientEmailTemplateById(emailTypeId, clientEmailTemplateId).pipe(
    tap(result => {
      debugger;
      var emailToList = result.data["emailTo"] != null ? result.data["emailTo"].split(',') : [];
      if (emailToList.length > 0) {
        emailToList.forEach(element => {
          this.emailToList.push({ name: element });
        });
      }
      var emailBccList = result.data["emailBcc"] != null ? result.data["emailBcc"].split(',') : [];
      if (emailBccList.length > 0) {
        this.isShowEmailBccDiv = true;
        emailBccList.forEach(element => {
          this.emailBccList.push({ name: element });
        });
      }
      var emailCcList = result.data["emailCc"] != null ? result.data["emailCc"].split(',') : [];
      if (emailCcList.length > 0) {
        this.isShowEmailCcDiv = true;
        emailCcList.forEach(element => {
          this.emailCcList.push({ name: element });
        });
      }

      var clientEmailAtatchments = result.data["clientEmailAttachments"];
      if (clientEmailAtatchments !== null && clientEmailAtatchments.length > 0) {
        clientEmailAtatchments.forEach(element => {
          //Remove added docs from the client docs list 
          let findClientDocIndex = this.clientDocList.findIndex(item => item.clientDocumentManagementId === element.clientDocumentManagementId);
          if (findClientDocIndex !== -1)
            this.clientDocList.splice(findClientDocIndex, 1);
          this.clientDocumentManagementAttachments.push({
            name: element.documentName,
            clientDocumentManagementId: element.clientDocumentManagementId
          });
        });
      }

      this.documentTypes = this.allDocumentTypes.filter(x => x.documentTypeId == result.data["documentTypeId"]);

      this.clientEmailTemplateForm.patchValue(result.data);
      var selectedDocumentType = this.allDocumentTypes.filter(x => x.documentTypeId == result.data.documentTypeId);
      this.documentTypes = this.allDocumentTypes
      if (selectedDocumentType !== null && selectedDocumentType !== undefined && selectedDocumentType.length > 0)
        this.clientEmailTemplateForm.controls['documentTypeId'].patchValue(selectedDocumentType[0].documentTypeId);

      this.btnHeading = "Update";
      this.gifLoader = false;
      this.getTemplateVariableMappings(result.data["templateTypeId"]);
      //this.openTemplateSlider();
      $(".templateSlider").addClass("openedpopeup");
      this.htmlContent = result.data.emailTemplateContent
      console.log(result);

    },
      (error: any) => {
        this.gifLoader = false;
        this.errorMessage = error.error.message;
        this.snackBar.open(this.errorMessage, '', {
          duration: 2000,
        });
        console.log(`error on retriving client email template : ${error}`);
      }
    ),
    finalize(() => {
      //this.changeDetectorRefs.detectChanges();
    })
  )
    .subscribe(
    );
}

deleteClientEmailTemplate(clientEmailTemplateId) {
  debugger;
  this.gifLoader = true
  var clientId = localStorage.getItem("clientID");
  this.templateTypeService.setClientId = clientId;
  this.templateTypeService.deleteEmailTemplate(clientEmailTemplateId).pipe(
    tap(result => {
      this.successMessage = result
      this.snackBar.open(this.successMessage.message, '', {
        duration: 8000,
      });
      this.getClientEmailTempalteList();
      this.modalRef.hide();
      this.gifLoader = false;
      console.log(result);
    },
      (error: any) => {
        this.gifLoader = false
        this.errorMessage = error.error.message;
        this.snackBar.open(this.errorMessage, '', {
          duration: 8000,
        });
        console.log(`error on deleting client email template : ${error}`);
      }
    ),
    finalize(() => {
      //this.changeDetectorRefs.detectChanges();
    })
  )
    .subscribe(
    );
}


onConditionAdd() {
  debugger;
  if (this.conditionForm.status !== "VALID") {
    return;
  }

  this.modalRef.hide();
  if (this.textAreas !== null && this.textAreas !== undefined && this.textAreas.length > 0) {
    var requiredTextArea = (<any>this.textAreas.toArray()[0]);
    if (requiredTextArea !== null && requiredTextArea !== undefined && requiredTextArea.textArea !== null && requiredTextArea.textArea !== undefined && requiredTextArea.textArea.nativeElement !== null && requiredTextArea.textArea.nativeElement !== undefined) {
      requiredTextArea.textArea.nativeElement.focus();
      var textToInsert = "";
      this.condition = this.conditionForm.get('condition').value;
      this.conditionColumnName = this.conditionForm.get('conditionColumnName').value;
      this.conditionColumnValue = this.conditionForm.get('conditionValue').value;
      this.conditionResultValue = this.conditionForm.get('conditionResultTextArea').value;
      if (this.condition == "Equals") {
        textToInsert = "{$if(" + this.conditionColumnName + "==" + this.conditionColumnValue + ")} " + this.conditionResultValue + "  {$/if}";
      }
      else if (this.condition == "Not Equal") {
        textToInsert = "{$if(" + this.conditionColumnName + "!=" + this.conditionColumnValue + ")} " + this.conditionResultValue + "  {$/if}";
      }
      else if (this.condition == "Greater Than Equal To") {
        textToInsert = "{$if(" + this.conditionColumnName + ">=" + this.conditionColumnValue + ")} " + this.conditionResultValue + "  {$/if}";
      }
      else if (this.condition == "Less Than Equal To") {
        textToInsert = "{$if(" + this.conditionColumnName + "<=" + this.conditionColumnValue + ")} " + this.conditionResultValue + "  {$/if}";
      }
      else if (this.condition == "Greater Than") {
        textToInsert = "{$if(" + this.conditionColumnName + ">" + this.conditionColumnValue + ")} " + this.conditionResultValue + "  {$/if}";
      }
      else if (this.condition == "Less Than") {
        textToInsert = "{$if(" + this.conditionColumnName + "<" + this.conditionColumnValue + ")} " + this.conditionResultValue + "  {$/if}";
      }

      this.insertAtCursor(textToInsert);
    }
  }
}


addTemplateVariableToRecipients(templateVariableColumnName, listType: string) {

  // Add our fruit
  if ((templateVariableColumnName || '').trim()) {
    if (listType === 'emailTo') {
      this.emailToList.push({ name: templateVariableColumnName.trim() });
    } else if (listType === 'emailCc') {
      this.emailCcList.push({ name: templateVariableColumnName.trim() });
    } else if (listType === 'emailBcc') {
      this.emailBccList.push({ name: templateVariableColumnName.trim() });
    }
  }


  // Reset the input value
  if (templateVariableColumnName) {
    templateVariableColumnName.value = '';
  }
}

addTemplateVariableToEditor(templateVariableColumnName) {
  var textToInsert = " {$" + templateVariableColumnName.replace(" ", "_") + "} ";
  this.insertAtCursor(textToInsert);
}

insertAtCursor(textToInsert) {
  // make sure we have focus in the right input
  // and just run the command
  document.execCommand('insertText', false /*no UI*/, textToInsert);
}

onSaveClientEmailTemplate() {
  this.gifLoader = true;
  if (this.clientEmailTemplateForm.status !== "VALID") {
    this.validateTemplateEditor();
    return;
  }


  const _clientEmailTemplate: ClientEmailTemplate = new ClientEmailTemplate();

  _clientEmailTemplate.emailTemplateName = this.clientEmailTemplateForm.controls["emailTemplateName"].value;
  _clientEmailTemplate.documentCategoryTypeId = this.clientEmailTemplateForm.controls["documentCategoryTypeId"].value;
  _clientEmailTemplate.documentTypeId = this.clientEmailTemplateForm.controls["documentTypeId"].value;
  _clientEmailTemplate.emailTemplateSubject = this.clientEmailTemplateForm.controls["emailTemplateSubject"].value;
  _clientEmailTemplate.templateTypeId = this.clientEmailTemplateForm.controls["templateTypeId"].value;
  _clientEmailTemplate.emailTemplateContent = this.clientEmailTemplateForm.controls["emailTemplateContent"].value;
  _clientEmailTemplate.emailTypeId = this.clientEmailTemplateForm.controls["emailTypeId"].value;
  _clientEmailTemplate.clientEmailTemplateId = parseInt(this.clientEmailTemplateForm.controls["clientEmailTemplateId"].value);
  _clientEmailTemplate.emailTo = this.emailToList.length > 0 ? this.emailToList.map(function (elem) {
    return elem.name;
  }).join(",") : null;
  _clientEmailTemplate.emailCc = this.emailCcList.length > 0 ? this.emailCcList.map(function (elem) {
    return elem.name;
  }).join(",") : null;
  _clientEmailTemplate.emailBcc = this.emailBccList.length > 0 ? this.emailBccList.map(function (elem) {
    return elem.name;
  }).join(",") : null;

  this.clientDocumentManagementAttachments.forEach(x => {
    this.documentManagementIds.push(x.clientDocumentManagementId);
  });

  _clientEmailTemplate.clientDocumentManagementId = this.documentManagementIds;

  var emailTypeId = parseInt(this.clientEmailTemplateForm.controls["emailTypeId"].value);
  var clientEmailTemplateId = parseInt(this.clientEmailTemplateForm.controls["clientEmailTemplateId"].value);
  
  if (emailTypeId > 0 || clientEmailTemplateId > 0) {
    // _clientEmailTemplate.clientEmailTemplateId = clientEmailTemplateId;
    this.updateClientEmailTemplate(emailTypeId, clientEmailTemplateId, _clientEmailTemplate);
  }
  else {
    this.createClientEmailTemplate(_clientEmailTemplate);
  }
}

private createClientEmailTemplate(data) {

  console.log(data);

  this.templateTypeService.postClientEmailTemplate(data).pipe(
    tap(result => {

      this.snackBar.open(result.message, '', {
        duration: 8000,
      })
      this.clientEmailTemplateForm.markAsPristine();
      this.getClientEmailTempalteList();
      this.gifLoader = false;
      this.closeTemplateSlider();
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

private updateClientEmailTemplate(emailTypeId, clientEmailTemplateId, data) {
  debugger;
  console.log(data);

  this.templateTypeService.putClientEmailTemplate(emailTypeId, data).pipe(
    tap(result => {

      this.snackBar.open(result.message, '', {
        duration: 8000,
      })
      this.clientEmailTemplateForm.markAsPristine();
      this.getClientEmailTempalteList();
      this.gifLoader = false;
      this.closeTemplateSlider();
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

clientDocumentManagement = [];
onDocChange(docName, clientDocumentManagementId, event) {
  debugger;
  //We will check if any record already exists in the list
  this.clientDocumentManagement = this.clientDocumentManagementAttachments.filter(x => x.clientDocumentManagementId == clientDocumentManagementId);
  if (this.clientDocumentManagement.length === 0) {
    if (event.checked) {
      //Checking if document is already added to tempList
      var checkTempList = this.tempClientDocumentManagementAttachments.filter(x => x.clientDocumentManagementId == clientDocumentManagementId);
      if (checkTempList.length === 0) {
        // Push into an array
        this.tempClientDocumentManagementAttachments.push({
          name: docName,
          clientDocumentManagementId: clientDocumentManagementId
        });
      }
    } else {
      //Means checkbox is unchecked. Remove an element
      let removeIndex = this.tempClientDocumentManagementAttachments.findIndex(item => item.clientDocumentManagementId === clientDocumentManagementId);

      if (removeIndex !== -1)
        this.tempClientDocumentManagementAttachments.splice(removeIndex, 1);
    }
  }
}

addDocs() {
  debugger;
  this.modalRef.hide();
  this.tempClientDocumentManagementAttachments.forEach(x => {
    //Remove added docs from the client docs list 
    let findClientDocIndex = this.clientDocList.findIndex(item => item.clientDocumentManagementId === x.clientDocumentManagementId);
    if (findClientDocIndex !== -1)
      this.clientDocList.splice(findClientDocIndex, 1);
    this.clientDocumentManagementAttachments.push({
      name: x.name,
      clientDocumentManagementId: x.clientDocumentManagementId
    });
  });

  this.tempClientDocumentManagementAttachments = [];
}

removeDoc(clientDocumentManagementId) {
  debugger;

  //get desired document from the allCLientDocsList and then push into clientDocs
  var clientDoc = this.allClientDocsList.filter(x => x.clientDocumentManagementId == clientDocumentManagementId);
  if (clientDoc.length > 0)
    this.clientDocList.push(clientDoc[0]);

  let removeIndex = this.clientDocumentManagementAttachments.findIndex(item => item.clientDocumentManagementId === clientDocumentManagementId);

  if (removeIndex !== -1)
    this.clientDocumentManagementAttachments.splice(removeIndex, 1);
}

 // Files Select Method
 files: File[] = [];
//  private subject = new FileFormats();
 onSelect(event) {
   debugger;
   console.log(event);

   if (event.addedFiles.size > 26214400) {
     this.snackBar.open(this.filesizeMessage, '', {
       duration: 4000,
     });
     return
   };

   // this.files.push(...event.addedFiles);


   event.addedFiles.forEach(file => {
     if (this.validDocumentExt(file.name)) {
       this.files.push(file);

       file.editFormShow = false;

       //this.files.editFormShow = false;


     } else {
       this.snackBar.open(this.FileFormat, '', {
         duration: 4000,
       });
     }
   });



 }


  //Popup Exisiting DOc open method
  openModalWithClassExisitingDoc(template: TemplateRef<any>) {
    // this.clientDocList;

    this.modalRef = this.modalService.show(
      template,
      Object.assign({}, { class: 'deletepopup existingDoc' })
    );
  }
  //Popup Exisiting DOc open method

//Popup Condition Method
openModalWithClass(template: TemplateRef<any>) {
  debugger;
  this.modalRef = this.modalService.show(
    template,
    Object.assign({}, { class: 'deletepopup' })
  );
}


// ********* Chips method *************//
visible = true;
selectable = true;
removable = true;
addOnBlur = true;
readonly separatorKeysCodes: number[] = [ENTER, COMMA, TAB];
emailToList: Recipients[] = [];
emailCcList: Recipients[] = [];
emailBccList: Recipients[] = [];

add(event: MatChipInputEvent, listType: string): void {
  const input = event.input;
  const value = event.value;

  // Add our fruit
  if ((value || '').trim()) {
    if (listType === 'emailTo') {
      this.emailToList.push({ name: value.trim() });
    } else if (listType === 'emailCc') {
      this.emailCcList.push({ name: value.trim() });
    } else if (listType === 'emailBcc') {
      this.emailBccList.push({ name: value.trim() });
    }
  }

  // Reset the input value
  if (input) {
    input.value = '';
  }
}

remove(recipient: Recipients, listType: string): void {

  if (listType === 'emailTo') {
    const index = this.emailToList.indexOf(recipient);
    if (index >= 0) {
      this.emailToList.splice(index, 1);
    }
  } else if (listType === 'emailCc') {
    const index = this.emailCcList.indexOf(recipient);
    if (index >= 0) {
      this.emailCcList.splice(index, 1);
    }
  } else if (listType === 'emailBcc') {
    const index = this.emailBccList.indexOf(recipient);
    if (index >= 0) {
      this.emailBccList.splice(index, 1);
    }
  }
}
// ********* Chips method *************// 

}
