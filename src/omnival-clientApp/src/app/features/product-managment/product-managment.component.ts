import { Component, OnInit, TemplateRef } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { trigger, style, animate, transition } from '@angular/animations';
import * as $ from 'jquery';
import { finalize, tap } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormBuilder, FormGroup, Validators, FormControl } from "@angular/forms";

// ********* Services Import ********* //
import { ProductManagmentService } from "./service"
import { AuthenticationService } from "../../core/services"
// ********* Services Import ********* //

// ********* interface Import ********* //
import { ProductManagment } from "./modal"
import { BaseComponent } from 'src/app/core/components';
// ********* interface Import ********* //

@Component({
 selector: 'app-product-managment',
  templateUrl: './product-managment.component.html',
  styleUrls: ['./product-managment.component.css']
})
export class ProductManagmentComponent extends BaseComponent implements OnInit {

  errorMessage: any
  productManagmentArray = []
  bgColor = true
  term: string
  gifLoader = false
  permissions: any

  constructor(
    private productManagmentService: ProductManagmentService,
    private AuthenticationService: AuthenticationService,
    private snackBar: MatSnackBar,
  ) {
    super();
  }

  ngOnInit() {
    super.ngOnInit()

    this.permissions = this.AuthenticationService.permissionFunction();

    $(document).ready(function () {
      $("#openPop").click(function () {
        $(".LowVisibilityDiv").addClass("openedpopeup");
      });


      $(".btn-close").click(function () {
        $(".LowVisibilityDiv").removeClass("openedpopeup");
      });
    });


    this.getProductManagmentData()

  }





  // ***************** Http Calls Method *****************// 
  getProductManagmentData() {
    this.gifLoader = true
    var clientId = localStorage.getItem("clientID");

    this.productManagmentService.getProductsManagmentList(clientId).pipe(
      tap(result => {
        this.gifLoader = false
        this.productManagmentArray = result.data

      },
        (error: any) => {
          this.gifLoader = false
          this.errorMessage = error.error.message;
          this.snackBar.open(this.errorMessage, '', {
            duration: 2000,
          });
          console.log(`error on retriving Vendor View : ${error}`);
        }
      ),
      finalize(() => {
        //this.changeDetectorRefs.detectChanges();
      })
    )
      .subscribe(
      );
  }


  // Put Method Update Product Row Info
  updateProductInfo(event, data, number, i) {

    var clientId = localStorage.getItem("clientID");
    const _ProductManagment: ProductManagment = new ProductManagment();

    if (number == 1) {

      data.isFrequentlyUsed = !data.isFrequentlyUsed

      // const _ProductManagment: ProductManagment = new ProductManagment();
      _ProductManagment.clientProductId = data.clientProductId
      _ProductManagment.productId = data.productId
      _ProductManagment.vendorId = data.vendorId
      _ProductManagment.isSystemProduct = data.isSystemProduct
      _ProductManagment.isFrequentlyUsed = data.isFrequentlyUsed
      _ProductManagment.isUADReportNeeded = data.isUADReportNeeded
      _ProductManagment.isAutoAssignmentEnable = data.isAutoAssignmentEnable
      _ProductManagment.active = data.active
    }

    else if (number == 2) {
      // const _ProductManagment: ProductManagment = new ProductManagment();
      _ProductManagment.clientProductId = data.clientProductId
      _ProductManagment.productId = data.productId
      _ProductManagment.vendorId = data.vendorId
      _ProductManagment.isSystemProduct = data.isSystemProduct
      _ProductManagment.isFrequentlyUsed = event.checked == true ? data.isFrequentlyUsed : false
      _ProductManagment.isUADReportNeeded = data.isUADReportNeeded
      _ProductManagment.isAutoAssignmentEnable = data.isAutoAssignmentEnable
      _ProductManagment.active = event.checked == true ? true : false


    }

    else if (number == 3) {
      // const _ProductManagment: ProductManagment = new ProductManagment();
      _ProductManagment.clientProductId = this.proData.clientProductId
      _ProductManagment.productId = this.proData.productId
      _ProductManagment.vendorId = this.proData.vendorId
      _ProductManagment.isSystemProduct = this.proData.isSystemProduct
      _ProductManagment.isFrequentlyUsed = this.proData.isFrequentlyUsed
      _ProductManagment.isUADReportNeeded = event.checked == true ? true : false
      _ProductManagment.isAutoAssignmentEnable = this.proData.isAutoAssignmentEnable
      _ProductManagment.active = this.proData.active


    }

    else if (number == 4) {
      // const _ProductManagment: ProductManagment = new ProductManagment();
      _ProductManagment.clientProductId = this.proData.clientProductId
      _ProductManagment.productId = this.proData.productId
      _ProductManagment.vendorId = this.proData.vendorId
      _ProductManagment.isSystemProduct = this.proData.isSystemProduct
      _ProductManagment.isFrequentlyUsed = this.proData.isFrequentlyUsed
      _ProductManagment.isUADReportNeeded = this.proData.isUADReportNeeded
      _ProductManagment.isAutoAssignmentEnable = event.checked == true ? true : false
      _ProductManagment.active = this.proData.active



    }


    this.productManagmentService.putProductManagment(clientId, _ProductManagment)
      .pipe(
        tap(result => {

          this.getProductManagmentData();
          $(".LowVisibilityDiv").removeClass("openedpopeup");
        },
          error => {
            this.errorMessage = error.error.message;
            console.log(this.errorMessage)
            this.snackBar.open(this.errorMessage, '', {
              duration: 4000,
            });

          }),
        finalize(() => {

        })
      )
      .subscribe();

  }
  // ***************** Http Calls Method *****************// 


  // Advance Setting Configuration
  UadReport = false
  // orderAssigment = false
  proData: any = []
  advanceSettingFunc(data) {
    this.proData = data
    this.UadReport = data.isUADReportNeeded
    //this.orderAssigment = data.isAutoAssignmentEnable
    $(".LowVisibilityDiv").addClass("openedpopeup");
  }


  // StarChange Method
  starChange() {
    debugger
    this.bgColor = !this.bgColor
  }

}
