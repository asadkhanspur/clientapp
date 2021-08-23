import { Component, OnInit, TemplateRef, ElementRef, QueryList, ViewChildren, ViewChild, Renderer2, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import * as $ from 'jquery';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { MatSnackBar } from '@angular/material/snack-bar';
import { finalize, retry, tap } from 'rxjs/operators';
import { FormBuilder, FormGroup, FormControlDirective, FormControlName, Validators, FormControl, NgForm } from "@angular/forms";
import { InteractivityChecker } from '@angular/cdk/a11y';
import * as fileSaver from 'file-saver';


// ********* Services Import ********* //
import { SupportingDocumentService } from '../../services';
import {DocumentTypesService, TemplateTypeService, PropertyCategoryTypeService, PropertyTypeService, LoanPurposeService, LoanTypeService, StateService, CountiesService, ProductTypeService, OccupancyTypeService, VendorService, OrderService, VendorTypeService} from 'src/app/shared/services'
import { MatSelect } from '@angular/material/select';
import { MatOption } from '@angular/material/core';
// ********* Services Import ********* //

import { BaseComponent } from 'src/app/core/components';

const originFormControlNgOnChanges = FormControlDirective.prototype.ngOnChanges;
FormControlDirective.prototype.ngOnChanges = function () {
  try {
    if (this.valueAccessor !== null && this.valueAccessor !== undefined && this.valueAccessor._elementRef !== null && this.valueAccessor._elementRef !== undefined && this.valueAccessor._elementRef.nativeElement !== null &&
      this.valueAccessor._elementRef.nativeElement !== undefined) {
      this.form.nativeElement = this.valueAccessor._elementRef.nativeElement;
      return originFormControlNgOnChanges.apply(this, arguments);
    }
  }
  catch {

  }
};

const originFormControlNameNgOnChanges = FormControlName.prototype.ngOnChanges;
FormControlName.prototype.ngOnChanges = function () {
  try {
    const result = originFormControlNameNgOnChanges.apply(this, arguments);
    if (this.valueAccessor !== null && this.valueAccessor !== undefined && this.valueAccessor._elementRef !== null && this.valueAccessor._elementRef !== undefined && this.valueAccessor._elementRef.nativeElement !== null
      && this.valueAccessor._elementRef.nativeElement !== undefined) {
      this.control.nativeElement = this.valueAccessor._elementRef.nativeElement;
      return result;
    }
  }
  catch {

  }
};

@Component({
  selector: 'app-document-list',
  templateUrl: './document-list.component.html',
  styleUrls: ['./document-list.component.css']
})
export class DocumentListComponent extends BaseComponent implements OnInit{
  @ViewChildren('txtArea') textAreas: QueryList<ElementRef>;
  @ViewChild('aForm') aForm: ElementRef;
  @ViewChild('f') f: NgForm;
  @ViewChild("txtInput") txtInput: ElementRef;
  @ViewChild('txtArea') myTextArea: ElementRef;
  @HostListener('keyup', ['$event'])


  docList: string
  htmlContent: string = '';
  modalRef: BsModalRef;
  templateTypeId: number;
  templateVariables = [];
  templateVariablesForConditionalText = [];
  errorMessage: string = '';
  gifLoader = false;
  gifLoaderConfig = false;
  clientDocList = [];
  documentTypes = [];
  allDocumentTypes: any = [];
  documentCategoryTypes = [];
  conditions = [];
  clientDocCustomForm: FormGroup;
  clientDocumentTemplateForm: FormGroup;
  conditionForm: FormGroup;
  btnHeading: string = 'Save';
  permissions: any
  isEdit: boolean = false;
  isView: boolean = false;
  templateVariableFound: boolean = false;
  documentTemplateContentValidationFailed: boolean = false;
  filter: any = {};
  successMessage: any;
  conditionColumnName: string = '';
  condition: string = '';
  conditionColumnValue: string = '';
  conditionResultValue: string = '';
  reportUrl: string;

  stringConditions = ['Equals', 'Not Equal'];
  otherConditions = ['Greater Than Equal To', 'Less Than Equal To', 'Greater Than', 'Less Than', 'Equals', 'Not Equal'];


  constructor(
    private snackBar: MatSnackBar,
    private modalService: BsModalService,
    private templateTypeService: TemplateTypeService, 
    private router: Router,
    private SupportingDocumentService: SupportingDocumentService,
    private DocumentTypeService: DocumentTypesService,
    private render: Renderer2, private interactivityChecker: InteractivityChecker,
    private VendorService: VendorService,
    private PropertyTypeService: PropertyTypeService,
    private LoanPurposeService: LoanPurposeService,
    private LoanTypeService: LoanTypeService,
    private PropertyCategoryTypeService: PropertyCategoryTypeService,
    private OccupancyTypeService: OccupancyTypeService,
    private StateService: StateService,
    private ProductTypeService: ProductTypeService,
    private OrderService:OrderService,
    private CountiesService:CountiesService,
    private VendorTypeService:VendorTypeService,
  ) { 
    super();
  }

  ngOnInit() {
    super.ngOnInit()
    this.getDocumentTypes();
    this.getDocumentCategoryTypes();
    this.getDocumentList();
    this.getDefaultTemplate();


    this.getloanpurpose();
    // this.getpropertType(0);
    // this.getloanType(0);
    this.getloanTypeList();
    this.getpropertTypeList();
    this.getPropertyCategory()
    this.getOccuancyType();
    this.getStates();
    this.getProducts();
    this.getProdutTypes();
    //this.getVendor();
    this.getCurrentVendor();
    this.getCountyList();
    // ********* Company Profile Forms Values Declare ********* //

    this.clientDocCustomForm = new FormGroup({
      documentId: new FormControl(0),
      documentCategoryTypeId: new FormControl(0, [Validators.required, Validators.min(1)]),
      documentTypeId: new FormControl(0, [Validators.required, Validators.min(1)]),
      documentName: new FormControl('', [Validators.required, Validators.maxLength(100)]),
      templateTypeId: new FormControl(0, [Validators.required]),
      documentDescription: new FormControl('', [Validators.maxLength(500)]),
      file: new FormControl(),
    });

    this.clientDocumentTemplateForm = new FormGroup({
      clientDocumentTemplateId: new FormControl(0),
      documentTemplateName: new FormControl('', [Validators.required, Validators.maxLength(100)]),
      documentTemplateDescription: new FormControl('', [Validators.maxLength(500)]),
      documentCategoryTypeId: new FormControl(0, [Validators.required, Validators.min(1)]),
      documentTypeId: new FormControl(null, [Validators.required, Validators.min(1)]),
      templateTypeId: new FormControl('', [Validators.required]),
      documentTemplateContent: new FormControl('', [Validators.required])
    });

    this.conditionForm = new FormGroup({
      condition: new FormControl('', [Validators.required]),
      conditionColumnName: new FormControl('', [Validators.required]),
      conditionValue: new FormControl('', [Validators.required]),
      conditionResultTextArea: new FormControl('', [Validators.required])
    });

    this.btnHeading = 'Save'
    // ********* Company Profile Forms Values Declare ********* //


    this.fileName.name = "Click Here To Upload";


    // Email Markup Html
    //this.htmlContent = ' <table border="0" cellpadding="0" cellspacing="0" height="100%" width="100%"><tr><td align="top" valign="top"><table border="0" cellpadding = "0" cellspacing = "0" width = "100%" style = "background-color:#ffffff;" ><tr><td align="center" valign = "top" ><table border="0" cellpadding = "20" cellspacing = "0" width = "100%" ><tr><td class="header" align = "center" style = "background-color: #003171;" ><img alt="OmniVal Softwares" src = "https://mcusercontent.com/7e625ac7d88971ac43e4120d8/images/da949d62-e013-4ab4-a279-2c60db7f7363.png" style = "width:160px;height:60px;margin: 0 auto;display: table;" /></td></tr></table></td></tr><tr><td align="center" valign = "top" ><table border="0" cellpadding = "0" cellspacing = "0" width = "600" ><tr><td class="content" valign = "top" align = "center" class="bodyContent" ><table border="0" cellpadding = "0" cellspacing = "0" width = "560" ><tr><td width="100%" valign = "middle" style = "padding: 20px 0;" ></td></tr></table></td></tr></table></td></tr><tr><td align="center" valign = "top" ><table border="0" cellpadding = "20" cellspacing = "0" width = "100%" bgColor = "#003171" ><tr><td class="header" align = "center" ><div style="text-align: center;" ><p style="color: #ffffff;font-size:14px;" >© 2020 OmniVal Software.All Rights Reserved</p></div></td></tr></table></td></tr></table><br/></td></tr></table> '
    // Email Markup Html
    this.editorConfig.editable = false;

  }


  keyevent(event) {

    if (event.keyCode === 38) {
      this.setPrevFocus(event.target.name);
    }
    if (event.keyCode === 40) {
      this.setValue(event);
      this.setNextFocus(event.target.name);

    }

  }

  loanpurpose = []
  getloanpurpose() {
    this.LoanPurposeService
      .getAll()
      .pipe(
        tap(result => {

          this.loanpurpose = result.data.loanPurposes;
        },
          (error: any) => {
            this.errorMessage = error.error.message;
            this.snackBar.open(this.errorMessage, '', {
              duration: 4000,
            });
            console.log(`error on retriving Loan Purpose list : ${error.error.message}`);
          }
        ),
        finalize(() => { })
      )
      .subscribe();
  }
  loanType=[]
  getloanTypeList() {
    this.LoanTypeService
      .completeLoanListCall()
      .pipe(
        tap(result => {
          this.loanType = result.data.loanTypes;
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
  propertyType=[]
  getpropertTypeList() {
    this.PropertyTypeService
      .completePropertytyppeList()
      .pipe(
        tap(result => {
          this.propertyType = result.data.propertyTypes;
        },
          (error: any) => {
            this.errorMessage = error.error.message;
            this.snackBar.open(this.errorMessage, '', {
              duration: 4000,
            });
            console.log(`error on retriving state list : ${error.error.message}`);
          }
        ),
        finalize(() => { })
      )
      .subscribe();
  }
  propertyCategory = []
  getPropertyCategory() {
    this.PropertyCategoryTypeService
      .getallPropertyType()
      .pipe(
        tap(result => {


          this.propertyCategory = result.data.propertyCategoryTypes;

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
  occupancytype = []
  getOccuancyType() {
    this.OccupancyTypeService
      .getAll()
      .pipe(
        tap(result => {

          this.occupancytype = result.data.occupancyTypes;
        },
          (error: any) => {
            this.errorMessage = error.error.message;
            this.snackBar.open(this.errorMessage, '', {
              duration: 4000,
            });
            console.log(`error on retriving Occupancy Type list : ${error.error.message}`);
          }
        ),
        finalize(() => { })
      )
      .subscribe();
  }
  state = []
  getStates() {
    this.StateService
      .getAll()
      .pipe(
        tap(result => {

          this.state = result.data.states;
          this.state = this.state.map(function(obj){return {Id: obj.stateCode,Name:obj.stateName}});
        },
          (error: any) => {
            this.errorMessage = error.error.message;
            this.snackBar.open(this.errorMessage, '', {
              duration: 4000,
            });
            console.log(`error on retriving state list : ${error.error.message}`);
          }
        ),
        finalize(() => { })
      )
      .subscribe();
  }
  products = []
  getProducts() {
    var clientId = localStorage.getItem("clientID");
    this.OrderService
      .clientVendorProdctGet(clientId, 1)
      .pipe(
        tap(result => {

          this.products = result.data.clientVendorProducts;
        },
          (error: any) => {
            this.errorMessage = error.error.message;
            this.snackBar.open(this.errorMessage, '', {
              duration: 4000,
            });
            console.log(`error on retriving state list : ${error.error.message}`);
          }
        ),
        finalize(() => { })
      )
      .subscribe();
  }
  productTypes = []
  getProdutTypes() {
    this.ProductTypeService
      .getAll()
      .pipe(
        tap(result => {
          this.productTypes = result.data.productTypes;
        },
          (error: any) => {
            this.errorMessage = error.error.message;
            console.log(`error on retriving product type list : ${error}`);
          }
        ),
        finalize(() => { })
      )
      .subscribe();
  }
  currentVendorList = []
  getCurrentVendor(filter?: any) {
    this.gifLoader = true
    var clientId = localStorage.getItem("clientID");
    // this.VendorService.setClientId = clientId;
    this.VendorService.getCurrentVendor(filter).pipe(
      tap(result => {
        this.gifLoader = false
        this.currentVendorList = result.data;
      },
        (error: any) => {
          this.gifLoader = false
          this.errorMessage = error.error.message;
          this.snackBar.open(this.errorMessage, '', {
            duration: 2000,
          });
          console.log(`error on retriving product type list : ${error}`);
        }
      ),
      finalize(() => {
        //this.changeDetectorRefs.detectChanges();
      })
    )
      .subscribe(
      );
  }

  counties=[]
  getCountyList() {
    this.CountiesService
      .getAll()
      .pipe(
        tap(result => {
          if (result.data != null && result.data != undefined) {
            this.counties = result.data.counties
            this.counties = this.counties.map(function(obj){return {Id: obj.countyID,Name:obj.countyName}});
            console.log(this.counties)
          }

        },
          (error: any) => {
            this.errorMessage = error.error.message;
            console.log(`error on retriving Subscibe Vendor list : ${error}`);
          }
        ),
        finalize(() => { })
      )
      .subscribe();
  }

  vendorTypes = []
  getVendorTye(filter?: any) {
    this.VendorTypeService.getAll(filter).pipe(
      tap(result => {
        this.vendorTypes = result.data.vendorTypes;
        console.log(this.vendorTypes)
      },
        (error: any) => {
          this.errorMessage = error.error.message;
          this.snackBar.open(this.errorMessage, '', {
            duration: 2000,
          });
          console.log(`error on retriving state list : ${error}`);
        }
      ),
      finalize(() => {
        //this.changeDetectorRefs.detectChanges();
      })
    )
      .subscribe(
      );
  }


  //Form Validation Method
  public checkErrorForclientDocCustomForm = (controlName: string, errorName: string) => {
    if (this.clientDocCustomForm.controls[controlName] !== undefined)
      return this.clientDocCustomForm.controls[controlName].hasError(errorName);
  }
  onTextAreaBlur(event) {
    debugger
  }
  public checkErrorForclientDocTemplateForm = (controlName: string, errorName: string) => {
    if (controlName === 'documentTemplateContent' && (this.htmlContent === null || this.htmlContent === undefined))
      return this.clientDocumentTemplateForm.controls[controlName].hasError(errorName);
    else
      return this.clientDocumentTemplateForm.controls[controlName].hasError(errorName);
  }

  public checkCondtionalPopupError = (controlName: string, errorName: string) => {
    return this.conditionForm.controls[controlName].hasError(errorName);
  }


  defaultTemplate = ''
  getDefaultTemplate() {
    this.templateTypeService
      .getTemplate()
      .pipe(
        tap(result => {
          debugger

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

  openTemplateSlider() {
    $(".templateSlider").addClass("openedpopeup");
    this.htmlContent = this.defaultTemplate;
    this.conditionList = [];
  }






  closeTemplateSlider() {
    debugger;
    $(".templateSlider").removeClass("openedpopeup");
    this.templateVariables = [];
    this.clientDocumentTemplateForm.reset({});
    this.documentTemplateContentValidationFailed = false;
    this.clientDocumentTemplateForm.controls['documentTemplateName'].setValue(null);
    this.clientDocumentTemplateForm.controls['templateTypeId'].setValue(null);

    this.isEdit = false;
    this.isView = false;
    this.templateVariableFound = false;
    this.editorConfig.editable = false;

  }

  openUploadSlider(documentId) {
    if (documentId === 0) {
      this.onAdd();
    }
    $(".uploadSlider").addClass("openedpopeup");
  }

  closeUploadSlider() {
    $(".uploadSlider").removeClass("openedpopeup");
    this.isEdit = false;
    this.isView = false;
    this.clientDocCustomForm.controls['documentTypeId'].setValue(null);
    this.clientDocCustomForm.controls['documentCategoryTypeId'].setValue(null);
    this.clientDocCustomForm.controls['documentName'].setValue(null);
  }

  validateDocumentTemplate() {
    if ((this.htmlContent == null || this.htmlContent === undefined || this.htmlContent.length === 0 || this.htmlContent == ""))
      this.documentTemplateContentValidationFailed = true
  }
  
  editorConfig: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: '600px',
    minHeight: '600px',
    maxHeight: '600px',
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
    sanitize: false,
    toolbarPosition: 'top',
    toolbarHiddenButtons: [
      ['bold', 'italic', 'fontName'],
      ['fontSize', 'insertImage', 'insertVideo', 'customClasses', 'link', 'unlink', 'removeFormat', 'toggleEditorMode'],
    ],

  };




  // Form Input File
  base64File: string = null;
  filename: string = null;
  fileName: any = [];
  filesExel: File[] = [];
  fileReturned: boolean;
  filesizeMessage: string = 'Supporting Document size cannot be more than 25MB';
  FileFormat: string = 'Supporting Document format is invalid';
  fileError: boolean = false

  // private subject = new FileFormats();

  onFileSelect(e: any): void {
    const file = e.target.files[0];

    if (file.size > 26214400) {
      this.snackBar.open(this.filesizeMessage, '', {
        duration: 4000,
      });
      this.clientDocCustomForm.controls["file"].patchValue(null);
      this.filesExel = [];
      this.filename = null;
      this.base64File = null;
      return
    };

    if (this.validDocumentExt(e.target.files[0].name)) {
      this.filesExel = [];
      // this.filesExel.push(...event.addedFiles[0]);
      this.filesExel.push(...e.target.files);
      //const file = e.target.files[0];
      const fReader = new FileReader()
      fReader.readAsDataURL(file)
      fReader.onloadend = (_event: any) => {
        this.filename = file.name;
        this.base64File = _event.target.result;
        this.fileError = false;
      }
    } else {
      this.snackBar.open(this.FileFormat, '', {
        duration: 4000,
      });
      this.clientDocCustomForm.controls["file"].patchValue(null);
      this.filesExel = [];
      this.filename = null;
      this.base64File = null;
      console.log('no file was selected...');
      return
    }
  }

  removeDocument() {
    this.base64File = null;
    this.filename = null;
    this.filesExel[0] = null;
    // this.VendorDocCustomForm.controls['file'].patchValue(null);
  }
  // Form Input File

  onConditionClose() {
    this.modalRef.hide();
  }


  //Popup Method
  openModalWithClass(template: TemplateRef<any>) {
    debugger
    this.modalRef = this.modalService.show(
      template,
      Object.assign({}, { class: 'deletepopup', ignoreBackdropClick: true })
    );
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
          this.clientDocumentTemplateForm.patchValue(_obj);
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
    debugger;
    this.templateTypeService
      .getTemplateTypeVariableMapping(templateTypeId)
      .pipe(
        tap(result => {
          debugger;
          this.templateVariables = result.data.filter(x => x.columnName.includes("_Id") == false);
          this.templateVariablesForConditionalText = result.data.filter(x => x.isForConditionVariable == true);
          console.log('templateVariablesForConditionalText: ', this.templateVariablesForConditionalText);
          this.templateVariableFound = true;
          this.editorConfig.editable = true;
          this.conditionForm.controls['conditionColumnName'].patchValue(this.templateVariables[0].columnName);
          this.onTemplateVariableChange(this.templateVariables[0].columnName);
        },
          (error: any) => {
            this.templateVariableFound = false;
            this.editorConfig.editable = false;
            this.errorMessage = error.error.message;
            console.log(`error on retriving template variable list : ${error}`);
          }
        ),
        finalize(() => { })
      )
      .subscribe();
  }

  templateTypeChanged(templateTypeId) {
    this.getTemplateVariableMappings(templateTypeId.value);
  }

  addTemplateVariableToEditor(templateVariableColumnName) {
    debugger;
    var textToInsert = " {$" + templateVariableColumnName.replace(" ", "_") + "} ";

    if (this.textAreas !== null && this.textAreas !== undefined && this.textAreas.length > 0) {
      var requiredTextArea = (<any>this.textAreas.toArray()[0]);
      if (requiredTextArea !== null && requiredTextArea !== undefined && requiredTextArea.textArea !== null && requiredTextArea.textArea !== undefined && requiredTextArea.textArea.nativeElement !== null && requiredTextArea.textArea.nativeElement !== undefined) {
        requiredTextArea.textArea.nativeElement.focus();
        this.insertAtCursor(textToInsert);
      }
    }
  }

  // Uzairs Section


  setFocus(name) {
    if (this.aForm !== null && this.aForm !== undefined && this.aForm.nativeElement !== null && this.aForm.nativeElement !== undefined) {
      const ele = this.aForm.nativeElement[name];
      if (ele) {
        ele.focus();
        return true
      }
      else
        return false
    }
  }

  removeFocus(name) {
    if (this.aForm !== null && this.aForm !== undefined && this.aForm.nativeElement !== null && this.aForm.nativeElement !== undefined) {
      const ele = this.aForm.nativeElement[name];
      if (ele) {
        ele.blur();
      }
    }
  }

  setPrevFocus(currentId) {
    if (this.aForm !== null && this.aForm !== undefined && this.aForm.nativeElement !== null && this.aForm.nativeElement !== undefined) {
      if (this.f !== null && this.f !== undefined && this.f.controls !== null && this.f.controls !== undefined) {
        const ctrls = Object.keys(this.f.controls);
        for (let key = ctrls.indexOf(currentId) - 1; key >= 0; key--) {
          const control = this.aForm.nativeElement[ctrls[key]];
          if (control && this.interactivityChecker.isFocusable(control)) {
            control.focus();
            control.select();
            break;
          }
        }
      }
    }
  }

  setNextFocus(currentId) {
    if (this.aForm !== null && this.aForm !== undefined && this.aForm.nativeElement !== null && this.aForm.nativeElement !== undefined) {
      const ctrls = Object.keys(this.f.controls);
      for (let key = ctrls.indexOf(currentId) + 1; key < ctrls.length; key++) {
        const control = this.aForm.nativeElement[ctrls[key]];
        if (control && this.interactivityChecker.isFocusable(control)) {
          control.focus();
          control.select();
          break;
        }
      }
    }
  }

  setValue(evt) {
    if (this.aForm !== null && this.aForm !== undefined && this.aForm.nativeElement !== null && this.aForm.nativeElement !== undefined) {
      const { name, value } = evt.target;
      this.f.form.get(name).setValue(value);
      this.render.setProperty(this.aForm.nativeElement[name], 'value', dateFormat(value));
    }

  }

  insertAtCursor(textToInsert) {
    // make sure we have focus in the right input
    // and just run the command
    document.execCommand('insertText', false /*no UI*/, textToInsert);
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

  getDocumentTypes() {
    debugger;
    this.gifLoader = true;
    this.DocumentTypeService
      .getAll()
      .pipe(
        tap(result => {
          debugger
          //this.documentTypes = result.data.clientDocumentTypes;
          var validDocumentType = [4, 5, 6, 7, 8, 9, 10, 11, 13, 14, 15, 12, 17];
          validDocumentType.forEach(item => {
            var documentType = result.data.clientDocumentTypes.filter(x => x.documentTypeId == item)
            if (documentType.length >= 1) {
              this.allDocumentTypes.push(documentType[0]);
            }
          });

          result.data.clientDocumentTypes.filter(x => x.documentCategoryTypeId != 2).forEach(item => {
            this.allDocumentTypes.push(item);
          });

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

  getDocumentCategoryTypes() {
    this.DocumentTypeService
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

  viewDocTemplate(data) {
    debugger;
    this.isView = true;
    this.isEdit = false;
    this.fileName = [];
    this.filesExel = [];
    this.filename = null;
    this.base64File = null;
    if (data.documentClassificationTypeId == 1) {
      this.isEdit = true;
      if (data.documentId > 0) {
        this.onClientDocumentTemplateEdit(data);
      }
      else {
        this.onAdd();
      }
    }
    else {
      if (data.documentId > 0) {
        this.onEdit(data);
        //this.heading = "Update Document";
        this.btnHeading = "Save"
      }
      else {
        this.onAdd();
        //this.heading = "Add New Document";
        this.btnHeading = "Add"
      }
    }
  }

  onCloneClick(data) {
    debugger;
    this.isView = false;
    this.btnHeading = "Add";
    this.onCloneDocumentTemplate(data);
  }

  // closePdfSlider() {
  //   $(".viewPdfSliderClass").removeClass("openedpopeup");
  // }



  closePDFSlider() {
    debugger;
    $(".pdfSlider").removeClass("openedpopeup");
  }


  previewTemplate(clientDocumentTemplateId: Number) {
    debugger;
    this.gifLoader = true
    var clientId = localStorage.getItem("clientID");
    this.SupportingDocumentService.setClientId = clientId;

    this.SupportingDocumentService.getClientDocumentTemplatePreview(clientDocumentTemplateId).pipe(
      tap(result => {
        debugger
        this.reportUrl = result.data;
        $(".pdfSlider").addClass("openedpopeup");
        this.gifLoader = false;
      },
        (error: any) => {
          this.gifLoader = false
          this.errorMessage = error.error.message;
          this.snackBar.open(this.errorMessage, '', {
            duration: 2000,
          });
          console.log(`error on Previewing client document template : ${error}`);
        }
      ),
      finalize(() => {
        //this.changeDetectorRefs.detectChanges();
      })
    )
      .subscribe(
      );
  }

  downloadTemplate(data: any) {
    debugger
    this.gifLoader = true
    var clientId = localStorage.getItem("clientID");
    this.SupportingDocumentService.setClientId = clientId;

    //if tempalte is uploaded type then directly download it.
    if (data.documentClassificationTypeId == 2) {
      const pdfUrl = data.documentURL;
      const pdfName = data.documentFileName;
      fileSaver.saveAs(pdfUrl, pdfName);
      this.gifLoader = false;
    }
    else {
      this.SupportingDocumentService.getClientDocumentTemplatePreview(data.documentId).pipe(
        tap(result => {
          debugger;
          this.reportUrl = result.data;
          const pdfUrl = this.reportUrl;
          const pdfName = data.documentName + '.pdf';
          fileSaver.saveAs(pdfUrl, pdfName);
          this.gifLoader = false;
        },
          (error: any) => {
            this.gifLoader = false
            this.errorMessage = error.error.message;
            this.snackBar.open(this.errorMessage, '', {
              duration: 2000,
            });
            console.log(`error on Previewing client document template : ${error}`);
          }
        ),
        finalize(() => {
          //this.changeDetectorRefs.detectChanges();
        })
      )
        .subscribe(
        );
    }
  }

  //documentCategoryTypeId

  onEditClick(data) {
    debugger;
    this.isView = false;
    this.fileName = [];
    this.filesExel = [];
    this.filename = null;
    this.base64File = null;
    if (data.documentClassificationTypeId == 1) {
      this.isEdit = true;
      if (data.documentId > 0) {
        this.onClientDocumentTemplateEdit(data);
        if (data.documentCategoryTypeId == 2) {
          this.SaveConfigureSettingVariable = true
        } else {
          this.SaveConfigureSettingVariable = false
        }
      }
      else {
        this.onAdd();
        this.htmlContent = this.defaultTemplate;
      }
    }
    else {
      if (data.documentId > 0) {

        if (data.documentCategoryTypeId == 2) {
          this.SaveConfigureSettingVariable = true
        } else {
          this.SaveConfigureSettingVariable = false
        }

        this.onEdit(data);
        //this.heading = "Update Document";
        this.btnHeading = "Save"
      }
      else {
        this.onAdd();
        //this.heading = "Add New Document";
        this.btnHeading = "Add"
      }
    }
  }

  onEdit(data: any) {
    debugger
    // this.editRowProductFun(i);
    this.isEdit = true;

    //this.alreadyUploaded = false;
    this.clientDocCustomForm.patchValue(data);
    //this.clientDocCustomForm.controls['documentCategoryTypeId'].setValue(data.documentCategoryTypeName);
    this.documentTypes = this.allDocumentTypes.filter(x => x.documentCategoryTypeId == data.documentCategoryTypeId);
    //this.clientDocCustomForm.controls['documentTypeId'].setValue(data.documentTypeName);

    var _obj = {
      "documentCategoryTypeId": 0,
      "documentTypeId": 0,
      "documentName": "",
      "documentDescription": "",
      "file": ""
    };

    _obj.documentCategoryTypeId = parseInt(data.documentCategoryTypeId);
    _obj.documentTypeId = parseInt(data.documentTypeId);
    _obj.documentName = data.documentName;
    _obj.documentDescription = data.documentDescription;
    this.clientDocCustomForm.patchValue(_obj);

    if (data.documentFileName != null && data.documentFileName != '') {
      this.filename = data.documentFileName;
      this.base64File = data.documentURL;
    }
    else {
      this.filename = '';
      this.base64File = '';
    }
    this.openUploadSlider(null);
  }

  onCloneDocumentTemplate(data: any) {
    debugger;
    // this.editRowProductFun(i);
    this.isEdit = true;
    //this.alreadyUploaded = false;


    var _obj = {
      "clientDocumentTemplateId": 0,
      "documentCategoryTypeId": 0,
      "documentTypeId": 0,
      "templateTypeId": 0,
      "documentTemplateName": "",
      "documentTemplateDescription": "",
      "documentTemplateContent": ""
    };

    _obj.templateTypeId = data.templateTypeId;
    _obj.documentCategoryTypeId = data.documentCategoryTypeId;
    _obj.documentTypeId = data.documentTypeId;
    _obj.clientDocumentTemplateId = null;
    _obj.documentTemplateName = data.documentName;
    _obj.documentTemplateDescription = data.documentDescription;
    _obj.documentTemplateContent = data.documentTemplateContent;
    this.htmlContent = data.documentTemplateContent
    //this.documentTypes = this.allDocumentTypes.filter(x => x.documentTypeId == data.documentTypeId);

    var selectedDocumentType = this.allDocumentTypes.filter(x => x.documentTypeId == data.documentTypeId);
    this.clientDocumentTemplateForm.patchValue(_obj);

    debugger;

    this.documentTypes = this.allDocumentTypes.filter(x => x.documentCategoryTypeId == data.documentCategoryTypeId);

    if (selectedDocumentType !== null && selectedDocumentType !== undefined && selectedDocumentType.length > 0)
      this.clientDocumentTemplateForm.controls['documentTypeId'].patchValue(selectedDocumentType[0].documentTypeId);
    //this.clientDocumentTemplateForm.patchValue({documentTypes : selectedDocumentType});
    /*
    this.clientDocumentTemplateForm.patchValue({
      clientDocumentTemplateId: data.documentId,
      templateTypeId: data.documentTypeId,
      documentTemplateName: data.documentName,
      documentTemplateDescription: data.documentDescription,
      documentTemplateContent: data.documentTemplateContent
    });
    */
    this.getTemplateVariableMappings(data.templateTypeId);
    $(".templateSlider").addClass("openedpopeup");
  }


  onClientDocumentTemplateEdit(data: any) {
    debugger;
    // this.editRowProductFun(i);
    this.isEdit = true;
    //this.alreadyUploaded = false;


    var _obj = {
      "clientDocumentTemplateId": 0,
      "documentCategoryTypeId": 0,
      "documentTypeId": 0,
      "templateTypeId": 0,
      "documentTemplateName": "",
      "documentTemplateDescription": "",
      "documentTemplateContent": ""
    };

    _obj.templateTypeId = data.templateTypeId;
    _obj.documentCategoryTypeId = data.documentCategoryTypeId;
    _obj.documentTypeId = parseInt(data.documentTypeId);
    _obj.clientDocumentTemplateId = parseInt(data.documentId);
    _obj.documentTemplateName = data.documentName;
    _obj.documentTemplateDescription = data.documentDescription;
    _obj.documentTemplateContent = data.documentTemplateContent;
    this.htmlContent = data.documentTemplateContent
    //this.documentTypes = this.allDocumentTypes.filter(x => x.documentTypeId == data.documentTypeId);

    var selectedDocumentType = this.allDocumentTypes.filter(x => x.documentTypeId == data.documentTypeId);
    this.clientDocumentTemplateForm.patchValue(_obj);

    debugger;

    this.documentTypes = this.allDocumentTypes.filter(x => x.documentCategoryTypeId == data.documentCategoryTypeId);

    if (selectedDocumentType !== null && selectedDocumentType !== undefined && selectedDocumentType.length > 0)
      this.clientDocumentTemplateForm.controls['documentTypeId'].patchValue(selectedDocumentType[0].documentTypeId);
    //this.clientDocumentTemplateForm.patchValue({documentTypes : selectedDocumentType});
    /*
    this.clientDocumentTemplateForm.patchValue({
      clientDocumentTemplateId: data.documentId,
      templateTypeId: data.documentTypeId,
      documentTemplateName: data.documentName,
      documentTemplateDescription: data.documentDescription,
      documentTemplateContent: data.documentTemplateContent
    });
    */
    this.getTemplateConditions(data.documentId);
    this.getTemplateVariableMappings(data.templateTypeId);
    $(".templateSlider").addClass("openedpopeup");
  }

  getTemplateConditions(templateTypeId){
    this.SupportingDocumentService
      .getClientDocumentTemplateConditions(templateTypeId)
      .pipe(
        tap(result => {
          debugger;
         
          var documentCondition = result.data;
          this.conditionList = documentCondition.map( function(e){

            const obj ={
              conditionName:e.conditionName.trim(),
              criteria:e.criteria,
              dataType:e.dataType,
              conditionalCode:e.conditionalCode,
              allSelectedData:false,
              saved: true,
              criteriaValues:[],
              conditions:[],
              criterias:e.documentConditionDetails.map(function(c) { 
                if(e.dataType == 'string'){
                  const criteria= {
                    criteriaOperator:c.criteriaOperator,
                    criteriaValue:c.criteriaValue.split(',').map(s=>parseInt(s)),
                    conditionalText:c.conditionalText,
                    }
                    return criteria
                }
                else{
                  const criteria= {
                    criteriaOperator:c.criteriaOperator,
                    criteriaValue:c.criteriaValue,
                    conditionalText:c.conditionalText,
                    }
                    return criteria
                }
                })
            };
            return obj;
          });
        },
          (error: any) => {
            this.templateVariableFound = false;
            this.editorConfig.editable = false;
            this.errorMessage = error.error.message;
            console.log(`error on retriving template variable list : ${error}`);
          }
        ),
        finalize(() => { })
      )
      .subscribe();
    
  }

  onAdd() {
    this.filename = null
    this.base64File = null
    this.isEdit = false;
    this.errorMessage = "";
    this.btnHeading = "Add"
    this.reset();
  }



  naviagteDocSetting(data) {
    this.gifLoaderConfig = false
    var managmentId = data.clientDocumentManagementId
    if (managmentId != null || managmentId != undefined || managmentId != '') {
      this.router.navigateByUrl('/orderSetting/documentSetting/' + managmentId)
    }
  }

  onSave(data, checkValue) {

    if (this.clientDocCustomForm.status != "VALID") {
      return;
    }
    if (data.documentId > 0) {
      this.update(data, checkValue);
    }
    else {
      this.create(data, checkValue);
    }
  }

  private create(data, checkValue) {


    if (checkValue == 'config') {
      this.gifLoaderConfig = true
    } else {
      this.gifLoader = true
    }


    this.fileError = false;
    const formData: FormData = new FormData();
    formData.append('documentTypeId', this.clientDocCustomForm.get('documentTypeId').value);
    formData.append('supportingDocumentName', this.clientDocCustomForm.get('documentName').value);
    formData.append('supportingDocumentDescription', this.clientDocCustomForm.get('documentDescription').value);
    if (this.filesExel[0] != undefined && this.filesExel[0] != null) {
      formData.append('file', this.filesExel[0], this.filesExel[0].name);

      this.SupportingDocumentService.postClientDocument(formData).pipe(
        tap(result => {
          if (checkValue == 'config') {
            this.gifLoaderConfig = false
            var managmentId = result.data.clientDocumentManagementId
            if (managmentId != null || managmentId != undefined || managmentId != '') {
              this.router.navigateByUrl('/orderSetting/documentSetting/' + managmentId)
            }
            console.log({ 'Current Post Object': result })
          } else {
            this.snackBar.open(result.message, '', {
              duration: 8000,
            })
            this.clientDocCustomForm.markAsPristine();
            this.getDocumentList();
            this.gifLoader = false
            this.closeUploadSlider();
          }
        },
          (error: any) => {
            this.gifLoader = false
            this.errorMessage = error.error.message;
            this.snackBar.open(this.errorMessage, '', {
              duration: 2000,
            });
            console.log(`error on create Vendor Document data : ${error}`);
          }),
        finalize(() => {
        })
      )
        .subscribe();
    } else {
      this.fileError = true;
      this.gifLoaderConfig = false
      //this.VendorDocCustomForm.controls['file'].setErrors({ 'invalid': true });
      // if(this.VendorDocCustomForm.controls['file'].value == null && this.VendorDocCustomForm.controls['file'].value == undefined){
      //   debugger
      //   this.VendorDocCustomForm.controls['file'].setErrors({ 'invalid': true });
      //   return
      // }
      this.gifLoader = false
      // var documentMessage = 'Document is missing'
      // this.snackBar.open(documentMessage, '', {
      //   duration: 2000,
      // });
    }
  }

  private update(data, checkValue) {

    if (checkValue == 'config') {
      this.gifLoaderConfig = true
    } else {
      this.gifLoader = true
    }


    var _obj = {
      "documentTypeId": 0,
      "documentName": "",
      "documentDescription": ""
    };

    _obj.documentTypeId = parseInt(data.documentTypeId);
    _obj.documentName = data.documentName;
    _obj.documentDescription = data.documentDescription;


    const formData: FormData = new FormData();
    formData.append('documentTypeId', _obj.documentTypeId.toString());
    formData.append('supportingDocumentName', _obj.documentName.toString());
    formData.append('supportingDocumentDescription', _obj.documentDescription !== null ? _obj.documentDescription.toString() : "");
    if (this.filesExel[0] != undefined && this.filesExel[0] != null)
      formData.append('file', this.filesExel[0], this.filesExel[0].name);

    this.SupportingDocumentService.putVendorDocument(data.documentId, formData).pipe(
      tap(result => {
        debugger
        if (checkValue == 'config') {

          this.gifLoaderConfig = false
          var managmentId = result.data.clientDocumentManagementId
          if (managmentId != null || managmentId != undefined || managmentId != '') {
            this.router.navigateByUrl('/orderSetting/documentSetting/' + managmentId)
          }

          console.log({ 'Current Post Object': result })

        } else {
          this.snackBar.open(result.message, '', {
            duration: 8000,
          })
          this.clientDocCustomForm.markAsPristine();
          this.clientDocList = result.data.clientDocuments;

          this.gifLoader = false
          this.closeUploadSlider();
          this.getDocumentList();


        }
      },
        (error: any) => {
          this.gifLoader = false
          this.errorMessage = error.error.message;
          this.snackBar.open(this.errorMessage, '', {
            duration: 2000,
          });
          console.log(`error on update Vendor Document data : ${error}`);
        }),
      finalize(() => {
      })
    )
      .subscribe();
    // } else {
    //   this.fileError = true;
    //   //this.VendorDocCustomForm.controls['file'].setErrors({ 'invalid': true });
    //   // if(this.VendorDocCustomForm.controls['file'].value == null && this.VendorDocCustomForm.controls['file'].value == undefined){
    //   //   debugger
    //   //   this.VendorDocCustomForm.controls['file'].setErrors({ 'invalid': true });
    //   //   return
    //   // }
    //   this.loadingforgot = false
    //   // var documentMessage = 'Document is missing'
    //   // this.snackBar.open(documentMessage, '', {
    //   //   duration: 2000,
    //   // });
    // }
  }

  //Delete Popup Method

  //documentList Record Delete Method
  deleteDoc(data) {
    debugger;
    this.gifLoader = true
    var clientId = localStorage.getItem("clientID");
    this.SupportingDocumentService.setClientId = clientId;
    if (data.documentClassificationTypeId == 1) {
      this.SupportingDocumentService
        .deleteDocumentTemplate(data.documentId)
        .pipe(
          tap(result => {
            this.successMessage = result
            this.snackBar.open(this.successMessage.message, '', {
              duration: 8000,
            });
            this.getDocumentList();
            this.modalRef.hide()
            this.gifLoader = false
          },
            error => {
              this.gifLoader = false
              this.errorMessage = error.error.message;
              this.snackBar.open(this.errorMessage, '', {
                duration: 8000,
              });
            }),
          finalize(() => {
          })
        )
        .subscribe();
    }
    else {
      this.SupportingDocumentService
        .deleteRec(data.documentId)
        .pipe(
          tap(result => {
            this.successMessage = result
            this.snackBar.open(this.successMessage.message, '', {
              duration: 8000,
            });
            this.getDocumentList();
            this.modalRef.hide()
            this.gifLoader = false
          },
            error => {
              this.gifLoader = false
              this.errorMessage = error.error.message;
              this.snackBar.open(this.errorMessage, '', {
                duration: 8000,
              });
            }),
          finalize(() => {
          })
        )
        .subscribe();
    }
  }

  onSaveClientDocumentTemplate(data, isButtonClicked: boolean, checkValue) {
    debugger;
    if (isButtonClicked) {
      if (this.clientDocumentTemplateForm.status != "VALID") {
        this.validateDocumentTemplate();
        return;
      }
      //console.log(this.myTextArea.nativeElement.innerHTML);
      var clientDocumentTemplateId = parseInt(this.clientDocumentTemplateForm.get('clientDocumentTemplateId').value)
      if (clientDocumentTemplateId > 0) {
        this.updateClientDocumentTemplate(data, checkValue);
      }
      else {
        this.createClientDocumentTemplate(checkValue);
      }
    }
  }


  private createClientDocumentTemplate(checkValue) {

    if (checkValue == 'configurationType') {
      this.gifLoaderConfig = true
    } else {
      this.gifLoader = true
    }

    this.fileError = false;
    const formData:any ={};
    formData.documentTemplateName= this.clientDocumentTemplateForm.get('documentTemplateName').value;
    formData.documentTemplateDescription=this.clientDocumentTemplateForm.get('documentTemplateDescription').value;

    var conditions = this.conditionList.map(function(e) { 
      const obj ={
        conditionName:e.conditionName.trim(),
        criteria:e.criteria,
        dataType:e.dataType,
        conditionalCode:e.conditionalCode,
        documentConditionDetails:e.criterias.map(function(c) { 
          if(e.dataType == 'string'){
            const criteria= {
              criteriaOperator:c.criteriaOperator,
              criteriaValue:c.criteriaValue.join(),
              conditionalText:c.conditionalText,
              }
              return criteria
          }
          else{
            const criteria= {
              criteriaOperator:c.criteriaOperator,
              criteriaValue:c.criteriaValue,
              conditionalText:c.conditionalText,
              }
              return criteria
          }
          })
      };
      return obj 
    })

    formData.documentConditions=conditions;

    formData.documentTemplateContent=this.htmlContent;
    formData.templateTypeId=this.clientDocumentTemplateForm.get('templateTypeId').value;
    formData.documentCategoryTypeId=this.clientDocumentTemplateForm.get('documentCategoryTypeId').value;
    formData.documentTypeId=this.clientDocumentTemplateForm.get('documentTypeId').value;


    this.SupportingDocumentService.postClientDocumentTemplate(formData).pipe(
      tap(result => {

        debugger

        if (checkValue == 'configurationType') {

          this.gifLoaderConfig = false
          var managmentId = result.data.clientDocumentManagementId
          if (managmentId != null || managmentId != undefined || managmentId != '') {
            this.router.navigateByUrl('/orderSetting/documentSetting/' + managmentId)
          }

          console.log({ 'Current Post Object': result })

        } else {
          this.snackBar.open(result.message, '', {
            duration: 8000,
          })
          this.clientDocumentTemplateForm.markAsPristine();
          this.clientDocList = result.data.clientDocuments;
          this.gifLoader = false
          this.closeTemplateSlider();
          this.getDocumentList();
          console.log(this.clientDocumentTemplateForm.get('documentTypeId').value);

        }






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


  private updateClientDocumentTemplate(data, checkValue) {
    if (checkValue == 'configurationType') {
      this.gifLoaderConfig = true
    } else {
      this.gifLoader = true
    }

    var _obj = {
      "documentId": 0,
      "documentCategoryTypeId": 0,
      "documentTypeId": 0,
      "templateTypeId": 0,
      "documentTemplateName": "",
      "documentTemplateDescription": "",
      "documentTemplateContent": ""
    };


    _obj.documentCategoryTypeId = parseInt(data.documentCategoryTypeId);
    _obj.documentTypeId = parseInt(data.documentTypeId);
    _obj.templateTypeId = parseInt(data.templateTypeId);
    _obj.documentId = parseInt(data.clientDocumentTemplateId);
    _obj.documentTemplateName = data.documentTemplateName;
    _obj.documentTemplateDescription = data.documentTemplateDescription == null ? "" : data.documentTemplateDescription;
    // _obj.documentTemplateContent = data.documentTemplateContent;

    const formData:any ={};
    formData.documentTemplateName=_obj.documentTemplateName;
    formData.documentTemplateDescription=_obj.documentTemplateDescription;
    formData.templateTypeId=_obj.templateTypeId;
    formData.documentCategoryTypeId=_obj.documentCategoryTypeId;
    formData.documentTypeId=_obj.documentTypeId;

    var conditions = this.conditionList.map(function(e) { 
      const obj ={
        conditionName:e.conditionName.trim(),
        criteria:e.criteria,
        dataType:e.dataType,
        conditionalCode:e.conditionalCode,
        documentConditionDetails:e.criterias.map(function(c) { 
          if(e.dataType == 'string'){
            const criteria= {
              criteriaOperator:c.criteriaOperator,
              criteriaValue:c.criteriaValue.join(),
              conditionalText:c.conditionalText,
              }
              return criteria
          }
          else{
            const criteria= {
              criteriaOperator:c.criteriaOperator,
              criteriaValue:c.criteriaValue,
              conditionalText:c.conditionalText,
              }
              return criteria
          }
          })
      };
      return obj 
    })

    formData.documentConditions=conditions;
    formData.documentTemplateContent=this.htmlContent;


    var clientDocumentTemplateId = _obj.documentId.toString();
    this.SupportingDocumentService.putClientDocumentTemplate(clientDocumentTemplateId, formData).pipe(
      tap(result => {

        debugger

        if (checkValue == 'configurationType') {

          this.gifLoaderConfig = false
          var managmentId = result.data.clientDocumentManagementId
          if (managmentId != null || managmentId != undefined || managmentId != '') {
            this.router.navigateByUrl('/orderSetting/documentSetting/' + managmentId)
          }

          console.log({ 'Current Post Object': result })

        } else {
          this.snackBar.open(result.message, '', {
            duration: 8000,
          })
          this.clientDocCustomForm.markAsPristine();
          this.clientDocList = result.data.clientDocuments;

          this.gifLoader = false
          this.closeTemplateSlider();
          this.getDocumentList();
          console.log(this.clientDocumentTemplateForm.get('documentTypeId').value);

        }


      },
        (error: any) => {
          debugger
          this.gifLoader = false
          this.gifLoaderConfig = false
          this.errorMessage = error.error.message;
          this.snackBar.open(this.errorMessage, '', {
            duration: 2000,
          });
          console.log(`error on update Vendor Document data : ${error}`);
        }),
      finalize(() => {
      })
    )
      .subscribe();
  }

  reset() {
    this.clientDocCustomForm.patchValue({
      documentId: 0,
      documentTypeId: 0,
      documentName: '',
      documentDescription: '',
      vendorProductDescription: '',
      file: ''
    });

    this.clientDocumentTemplateForm.patchValue({
      clientDocumentTemplateId: 0,
      templateTypeId: 0,
      documentTemplateName: '',
      documentTemplateDescription: '',
      documentTemplateContent: '',
    });
  }
  onChangeEnabled(event, data) {

    this.gifLoader = true;
    var clientId = localStorage.getItem("clientID");
    if (event.checked) {
      this.SupportingDocumentService.putActiveDocument(data.documentId, data.documentClassificationTypeId, data)
        .pipe(
          tap(result => {
            debugger
            this.getDocumentList();
            this.gifLoader = false;
            debugger
          },
            (error: any) => {
              this.gifLoader = false;
              this.errorMessage = error.error.message;
              console.log(`error on updating : ${error}`);
            }
          ),
          finalize(() => { })
        ).subscribe();
    }
    else {
      this.SupportingDocumentService.putInActiveDocument(data.documentId, data.documentClassificationTypeId, data)
        .pipe(
          tap(result => {
            this.getDocumentList();
            this.gifLoader = false;
            debugger
          },
            (error: any) => {
              this.gifLoader = false;
              this.errorMessage = error.error.message;
              console.log(`error on updating : ${error}`);
            }
          ),
          finalize(() => { })
        ).subscribe();
    }
    //this.update(setting)
  }





  // ********** Sorting *********//


  SortColumn: boolean[] = [];
  sort(column) {
    if (this.SortColumn[column] == undefined) {
      this.SortColumn[column] = true;
    }
    if (this.SortColumn[column]) {
      this.ascendic(column, this.clientDocList);
    }
    else {
      this.descendic(column, this.clientDocList);
    }
    this.SortColumn[column] = !this.SortColumn[column];
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

  // ********** Sorting *********//




  getDocumentList(filter?: any) {
    this.gifLoader = true
    var clientId = localStorage.getItem("clientID");
    this.SupportingDocumentService.setClientId = clientId;

    this.SupportingDocumentService.getClientDocuments(filter).pipe(
      tap(result => {
        debugger
        this.clientDocList = result.data.clientDocuments;

        console.log(this.clientDocList)

        this.gifLoader = false

      },
        (error: any) => {
          this.gifLoader = false
          this.errorMessage = error.error.message;
          this.snackBar.open(this.errorMessage, '', {
            duration: 2000,
          });
          console.log(`error on retriving product type list : ${error}`);
        }
      ),
      finalize(() => {
        //this.changeDetectorRefs.detectChanges();
      })
    )
      .subscribe(
      );
  }

  saveClientDocumentTemplate() {
    if (this.clientDocumentTemplateForm.status === 'INVALID') {
      return;
    }

    var clientId = localStorage.getItem("clientID");
    console.log('Doc template form status : ', this.clientDocumentTemplateForm);
    console.log('doc template value is: ', this.clientDocumentTemplateForm.value);
  }
  documentTemplateContentOnFocus(event) {
    debugger
  }
  documentTemplateContentOnChange(event) {
    debugger
  }

  SaveConfigureSettingVariable = false




  onCategoryChange(event) {
    debugger
    this.documentTypes = this.allDocumentTypes.filter(x => x.documentCategoryTypeId == event.value);
    this.getTemplateTypes(event.value);


    if (event.value == 2) {
      this.SaveConfigureSettingVariable = true
    } else {
      this.SaveConfigureSettingVariable = false
    }
    /* this.gifLoader = true;
     if(event.value > 0){
       this.documentTypesService
       .getDocumentTypesByCategory(event.value)
       .pipe(
         tap(result => {
           this.documentTypes = result.data.clientDocumentTypes;
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
     }*/
  }



// ***** Conditional Slider ******//

  @ViewChild('selectData') selectData: MatSelect;
  toggleAllSelectionData() {

    if (this.currentConditionModel.allSelectedData) {
      this.selectData.options.forEach((item: MatOption) => item.select());
    } else {
      this.selectData.options.forEach((item: MatOption) => item.deselect());
    }
  }
  optionClickData() {
    let newStatus = true;
    this.selectData.options.forEach((item: MatOption) => {
      if (!item.selected) {
        newStatus = false;
      }
    });
    this.currentConditionModel.allSelectedData = newStatus;
  }

  conditionList = [];

  currentConditionModel = {
    conditionName:'',//"New Condition "+(this.conditionList.length+1),
    criteria:"",
    allSelectedData:false,
    criterias:[{
      criteriaOperator:"",
      criteriaValue:[],
      conditionalText:"",
    }],
    dataType:'string',
    criteriaValues:[],
    conditions:[],
    saved: false,
    conditionalCode:''
  };

  criteriaValues = [];

  AddCondition(){
    this.currentConditionModel = {
        conditionName:'',//"New Condition "+(this.conditionList.length+1),
        criteria:"",
        allSelectedData:false,
        criterias:[{
          criteriaOperator:"",
          criteriaValue:[],
          conditionalText:"",
        }],
        dataType:'string',
        criteriaValues:[],
        conditions:[],
        saved: false,
        conditionalCode:''
      };
    $(".conditionalSlider").addClass("openedpopeup");
  }

  updateCondition(condition){
    this.currentConditionModel = condition;
    this.onTemplateVariableChange(this.currentConditionModel.criteria);
    this.criteriaChange(this.currentConditionModel.criteria);
    $(".conditionalSlider").addClass("openedpopeup");
  }

  selectCondition(condition){
    debugger;
    var textToInsert = "{$if}" + condition.conditionName +"{$/if}";

    if (this.textAreas !== null && this.textAreas !== undefined && this.textAreas.length > 0) {
      var requiredTextArea = (<any>this.textAreas.toArray()[0]);
      if (requiredTextArea !== null && requiredTextArea !== undefined && requiredTextArea.textArea !== null && requiredTextArea.textArea !== undefined && requiredTextArea.textArea.nativeElement !== null && requiredTextArea.textArea.nativeElement !== undefined) {
        requiredTextArea.textArea.nativeElement.focus();
        this.insertAtCursor(textToInsert);
      }
    }
  }

  conditionSave(){
    var unique = this.conditionList.filter(x=>x.conditionName.trim() === this.currentConditionModel.conditionName.trim())
    if(this.currentConditionModel.saved == false && unique.length>0){
      this.errorMessage = "Condition Name already exist.";
      this.snackBar.open(this.errorMessage, '', {
        duration: 2000,
      });
      return false
    }
    if(this.currentConditionModel.saved == true && unique.length>1){
      this.errorMessage = "Condition Name already exist.";
      this.snackBar.open(this.errorMessage, '', {
        duration: 2000,
      });
      return false
    }
    
    if(!this.validateCondition(this.currentConditionModel)){
      this.errorMessage = "Please fill all required fields";
      this.snackBar.open(this.errorMessage, '', {
        duration: 2000,
      });
      return false
    }
    var textToInsert ='';

    this.currentConditionModel.criterias.forEach(criteria => {
      if(this.currentConditionModel.dataType == 'int'){
        if (criteria.criteriaOperator== "Equals") {
          textToInsert += "{$if(" + this.currentConditionModel.criteria + "==" + criteria.criteriaValue + ")} " + criteria.conditionalText + "  {$/if}";
        }
        else if (criteria.criteriaOperator== "Not Equal") {
          textToInsert += "{$if(" + this.currentConditionModel.criteria + "!=" + criteria.criteriaValue + ")} " + criteria.conditionalText + "  {$/if}";
        }
        else if (criteria.criteriaOperator== "Greater Than Equal To") {
          textToInsert += "{$if(" + this.currentConditionModel.criteria + ">=" + criteria.criteriaValue + ")} " + criteria.conditionalText + "  {$/if}";
        }
        else if (criteria.criteriaOperator== "Less Than Equal To") {
          textToInsert += "{$if(" + this.currentConditionModel.criteria + "<=" + criteria.criteriaValue + ")} " + criteria.conditionalText + "  {$/if}";
        }
        else if (criteria.criteriaOperator== "Greater Than") {
          textToInsert += "{$if(" + this.currentConditionModel.criteria + ">" + criteria.criteriaValue + ")} " + criteria.conditionalText + "  {$/if}";
        }
        else if (criteria.criteriaOperator== "Less Than") {
          textToInsert += "{$if(" + this.currentConditionModel.criteria + "<" + criteria.criteriaValue + ")} " + criteria.conditionalText + "  {$/if}";
        }
      }
      else{
        if (criteria.criteriaOperator== "Equals") {
          textToInsert += "{$if(" + this.currentConditionModel.criteria + "==" + criteria.criteriaValue.join() + ")} " + criteria.conditionalText + "  {$/if}";
        }
        if (criteria.criteriaOperator== "Not Equals") {
          textToInsert += "{$if(" + this.currentConditionModel.criteria + "!=" + criteria.criteriaValue.join() + ")} " + criteria.conditionalText + "  {$/if}";
        }
      }
      textToInsert += '</br>'
    });
    this.currentConditionModel.conditionalCode = textToInsert;
    if(this.currentConditionModel.saved == true){
      this.conditionList.splice(  this.conditionList.map(function(e) { return e.conditionName.trim(); }).indexOf(this.currentConditionModel.conditionName.trim()), 1);
    }
    this.currentConditionModel.saved = true;
    this.conditionList.push(this.currentConditionModel);
    this.closeConditionSlider();
  }

  validateCondition(currentConditionModel){
    if(currentConditionModel.conditionName.trim()==''){
      return false;
    }
    if(currentConditionModel.criteria.trim()==''){
      return false;
    }
    for (let index = 0; index < currentConditionModel.criterias.length; index++) {
      const element = currentConditionModel.criterias[index];
      if (element.criteriaOperator.trim()==''){
        return false;
      }
      if (element.conditionalText.trim()==''){
        return false;
      }
      if (currentConditionModel.dataType == 'int' && element.criteriaValue.trim() == ""){
        return false;
      }
      else if(element.criteriaValue == null || element.criteriaValue == undefined || element.criteriaValue.length <= 0){
        return false;
      }
    }
    return true;
  }

  conditionDelete(){
    this.conditionList.splice(  this.conditionList.map(function(e) { return e.conditionName; }).indexOf(this.currentConditionModel.conditionName), 1);
    this.currentConditionModel = this.conditionList.length >= 1 ? this.conditionList[0]:null
  }

  onTemplateVariableChange(columnName) {
    debugger;
    //Filter out column data from the list
    var templateVariableData = this.templateVariables.filter(x => x.columnName == columnName);
    if (templateVariableData !== null && templateVariableData.length > 0) {
      //Now get its data type
      var dataType = templateVariableData[0].dataType;

      this.currentConditionModel.dataType = dataType;
      switch (dataType) {
        case "string": {
          this.currentConditionModel.conditions = this.stringConditions;
          break;
        }
        case "int": {
          this.currentConditionModel.conditions = this.otherConditions;
          break;
        }
        case "Datetime": {
          this.currentConditionModel.conditions = this.otherConditions;
          break;
        }
        default: {
          this.currentConditionModel.conditions = [];
          break;
        }
      }

      this.conditionForm.controls['condition'].patchValue(this.conditions[0]);
    }
    if (templateVariableData.length <= 0) {
      templateVariableData = this.templateVariablesForConditionalText.filter(x => x.columnName == columnName);
      if (templateVariableData !== null && templateVariableData.length > 0) {
        //Now get its data type
        var dataType = templateVariableData[0].dataType;
  
        this.currentConditionModel.dataType = dataType;
        switch (dataType) {
          case "string": {
            this.currentConditionModel.conditions = this.stringConditions;
            break;
          }
          case "int": {
            this.currentConditionModel.conditions = this.otherConditions;
            break;
          }
          case "Datetime": {
            this.currentConditionModel.conditions = this.otherConditions;
            break;
          }
          default: {
            this.currentConditionModel.conditions = [];
            break;
          }
        }
  
        this.conditionForm.controls['condition'].patchValue(this.conditions[0]);
      }
    }
  }

  criteriaChange(criteria){
    this.currentConditionModel.allSelectedData = false;
    // this.currentConditionModel.criterias.criteriaValue = [];
    this.currentConditionModel.criteriaValues =[];
    this.onTemplateVariableChange(criteria)
    switch (criteria.replace("_Id","")) {
      case "Loan_Type":
        this.currentConditionModel.criteriaValues = this.loanType.map(function(obj){return {Id: obj.loanTypeId,Name:obj.loanTypeName}});
        break;
      case "Vendor_Company_Name":
        this.currentConditionModel.criteriaValues = this.currentVendorList.map(function(obj){return {Id: obj.vendorId,Name:obj.vendorName}});
        break;
      case "Product_Name":
        this.currentConditionModel.criteriaValues = this.products.map(function(obj){return {Id: obj.productId,Name:obj.productName}});
        break;
      case "Loan_Purpose":
        this.currentConditionModel.criteriaValues = this.loanpurpose.map(function(obj){return {Id: obj.loanPurposeId,Name:obj.loanPurposeName}});
        break;
      case "Property_Category":
        this.currentConditionModel.criteriaValues = this.propertyCategory.map(function(obj){return {Id: obj.propertyCategoryTypeId,Name:obj.propertyCategoryTypeName}});
        break;
      case "Property_Sub_Category":
        this.currentConditionModel.criteriaValues = this.propertyType.map(function(obj){return {Id: obj.propertyTypeId,Name:obj.propertyTypeName}});
        break;
      case "Property_State":
        this.currentConditionModel.criteriaValues = this.state;
        break;
      case "Property_County":
        this.currentConditionModel.criteriaValues = this.counties;
        break;
      case "Occupancy_Type":
        this.currentConditionModel.criteriaValues = this.occupancytype.map(function(obj){return {Id: obj.occupancyTypeId,Name:obj.occupancyTypeName}});
        break;
      case "Product_Category":
        this.currentConditionModel.criteriaValues = this.productTypes.map(function(obj){return {Id: obj.productTypeId,Name:obj.productTypeName}});
        break;
      case "Property_Zip_Code":

        break;
      case "Loan_Amount":

      break;
      case "Sales_Amount":

      break;
      case "Order_Fee":

      break;
      case "Vendor_Type":
        this.currentConditionModel.criteriaValues = this.vendorTypes.map(function(obj){return {Id: obj.vendorTypeId,Name:obj.vendorTypeName}});
        break;
      default:
        break;
    }
  }

  addCriteria(){
    this.currentConditionModel.criterias.push({
      criteriaValue:[],
      conditionalText:"",
      criteriaOperator:"",
    });
  }

  deleteCriteria(index){
    this.currentConditionModel.criterias.splice(index,1);
  }

closeConditionSlider(){
  $(".conditionalSlider").removeClass("openedpopeup");
}

// ***** Conditional Slider ******//

}


function dateFormat(dateStr) {
  if (dateStr.length === 8) {
    dateStr = String(dateStr).substring(0, 4) + '.' +
      String(dateStr).substring(4, 6) + '.' +
      String(dateStr).substring(6, 8);
  }
  else if (dateStr.length === 7) {
    dateStr = String(dateStr).substring(0, 3) + '.' +
      String(dateStr).substring(3, 5) + '.' +
      String(dateStr).substring(5, 7);
  }
  else if (dateStr.length === 6) {
    dateStr = String(dateStr).substring(0, 2) + '.' +
      String(dateStr).substring(2, 4) + '.' +
      String(dateStr).substring(4, 6);
  }
  return dateStr;


}
