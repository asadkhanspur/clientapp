import { Component, OnInit, ViewChild } from '@angular/core';
import { PanelTabsVendorDetailComponent } from '../panel-tabs-vendor-detail/panel-tabs-vendor-detail.component';
import { StateService, VendorLookupService } from 'src/app/shared/services';
import { tap, finalize, filter, map, shareReplay } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PanelManagmentService } from '../../service';

@Component({
  selector: 'app-panel-tabs-filter',
  templateUrl: './panel-tabs-filter.component.html',
  styleUrls: ['./panel-tabs-filter.component.css']
})
export class PanelTabsFilterComponent implements OnInit {

  //#region Declarations
  input: number;
  productCategory: number = 0;
  filter: any = {};
  stateCode: string = '';
  vendorTypeId: number = 0;
  keywordFilterText: string = '';
  resetValueState;
  resetValueProduct;
  resetValueVendor;
  states;
  mapstateCode: string;
  stringCode: string;
  term: string;
  productTypeList = [];
  stateList = [];
  vendorTypeList = [];
  isStateFromMap: boolean = false;
  errorMessage: any;
  //#endregion

  //#region Events
  constructor(
    public panelManagmentService: PanelManagmentService,
    private vendorLookupService: VendorLookupService,
    private stateService: StateService,
    private snackBar: MatSnackBar) { }

  ngOnInit() {
    this.resetMethod();
  }
  //#endregion

  //#region Methods
  openFilterBox() {
    this.panelManagmentService.toggleFilterBox();
  }

  selectedProductType(event) {
    this.input = event.value;

    if (this.input != undefined && this.input != null && this.productCategory != this.input) {
      this.productCategory = this.input;
      this.applyFilter();
    }
  }

  selectedStateCode(event) {
    this.stringCode = event.value
    if (this.stringCode != undefined && this.stringCode != null && this.stateCode != this.stringCode.trim()) {
      this.stateCode = this.stringCode.trim();
      this.mapstateCode = this.stateCode;
      this.isStateFromMap = false;
      this.applyFilter();
      // this.panelTabsVendorDetail.pendingVendorService.getVendorProductStatsByStateCode(this.mapstateCode);
      // this.panelTabsVendorDetail.pendingVendorService.getVendorStatsByStateCode(this.mapstateCode);
    }
  }

  selectedVendorType(event) {
    this.input = event.value;
    if (this.input != undefined && this.input != null && this.vendorTypeId != this.input) {
      this.vendorTypeId = this.input;
      this.applyFilter();
    }
  }

  getState(filter?: any) {
    this.stateService.getPanelStates(filter).pipe(
      tap(result => {
        this.stateList = result.data.states;
      },
        (error: any) => {
          this.errorMessage = error.error.message;
          this.snackBar.open(this.errorMessage, '', {
            duration: 2000,
          });
          console.log(`error on retriving state list : ${error}`);
        }
      ),
      finalize(() => { })).subscribe();
  }

  getVendorType(filter?: any) {
    this.vendorLookupService.getVendorTypes(filter).pipe(
      tap(result => {
        this.vendorTypeList = result.data.vendorTypes;
      },
        (error: any) => {
          this.errorMessage = error.error.message;
          this.snackBar.open(this.errorMessage, '', {
            duration: 2000,
          });
          console.log(`error on retriving state list : ${error}`);
        }
      ),
      finalize(() => { })).subscribe();
  }

  getProductType(filter?: any) {
    this.vendorLookupService.getProductTypes(filter).pipe(
      tap(result => {
        this.productTypeList = result.data.productTypes;
      },
        (error: any) => {
          this.errorMessage = error.error.message;
          this.snackBar.open(this.errorMessage, '', {
            duration: 2000,
          });
          console.log(`error on retriving state list : ${error}`);
        }
      ),
      finalize(() => { })).subscribe();
  }

  private applyFilter() {
    this.filter = {};
    
    if (this.keywordFilterText.trim() != '') {
      this.filter.key = this.keywordFilterText;
    }
    if (this.stateCode !== null && this.stateCode.trim() != '') {
      this.filter.statecode = this.stateCode;
    }
    if (this.productCategory != 0) {

      this.filter.productCategory = this.productCategory;
    }
    if (this.vendorTypeId.toString() != '' && this.vendorTypeId != 0) {
      this.filter.vendorTypeId = this.vendorTypeId;
      this.panelManagmentService.emitGetPendingVendors(this.filter);
    }
  }

  resetMethod() {
    this.resetValueState = null;
    this.resetValueProduct = null;
    this.resetValueVendor = null;
    this.vendorTypeId = 0;
    this.mapstateCode = '';
    this.states = '';
    this.stateCode = null;
    this.panelManagmentService.searchFilter = '';
    this.panelManagmentService.emiResetFilter(null);
    // this.getVendorStats();
    this.getState();
    this.getProductType();
    this.getVendorType();
    this.applyFilter();
  }
  //#endregion
}
