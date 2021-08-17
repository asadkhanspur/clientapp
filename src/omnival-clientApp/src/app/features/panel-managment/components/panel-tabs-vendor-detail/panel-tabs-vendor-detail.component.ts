import {
  Component,
  OnInit
} from '@angular/core';
import {
  VendorService
} from 'src/app/shared/services';
import {
  tap,
  finalize
} from 'rxjs/operators';
import {
  MatSnackBar
} from '@angular/material/snack-bar';

import * as $ from 'jquery';

@Component({
  selector: 'app-panel-tabs-vendor-detail',
  templateUrl: './panel-tabs-vendor-detail.component.html',
  styleUrls: ['./panel-tabs-vendor-detail.component.css']
})
export class PanelTabsVendorDetailComponent implements OnInit {
  currentVendorList = [];
  gifLoader = false;
  errorMessage: any;
  term: string;

  constructor(private CurrentVendorService: VendorService,
    private snackBar: MatSnackBar) {}

  ngOnInit() {
    this.getCurrentVendor();
  }

  getCurrentVendor() {
    this.gifLoader = true
    var clientId = localStorage.getItem("clientID");
    this.CurrentVendorService.getCurrentVendor(clientId).pipe(
        tap(result => {
            this.gifLoader = false
            this.currentVendorList = result.data;
            console.log(this.currentVendorList)
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
        finalize(() => {})
      )
      .subscribe();
  }

  backSideShow: any = [];
  flipped: any = [];
  flipIts(i) {
    this.backSideShow[i] = !this.backSideShow[i];
    this.flipped[i] = !this.flipped[i];
  }

  openProile(vendorId, invitationStatus, vendor = null, invitationid, clientSubscribedVendorId) {
    // this.clientSubscribeVendorId = clientSubscribedVendorId
    // this.invitationStatus = invitationStatus;
    // this.invitationId = invitationid;
    // this.vendor = vendor;
    // if (this.invitationStatus == 2) {
    //   this.InviationButton = true;
    // } else if (this.invitationStatus == 3) {
    //   this.InviationButton = false;
    // } else {
    //   this.InviationButton = false;
    // }

    // this.VendorId = vendorId
    // $(".detail-slider-wrapper").addClass("opened");
    // this.getCurrentVendorVeiwProfile(vendorId);
    // this.getCurrentVendorProduct(vendorId)
    // this.getCurrentVendorStateCoverages(vendorId)
    // this.getCurrentVendorContact(vendorId)
    // this.getCurrentVendorSupportingDocument(vendorId)
  }


  removeVendor(invitationId) {
    // var clientId = localStorage.getItem("clientID");
    // this.InvitationSendService.removeVendorFormPanel(clientId, invitationId).pipe(
    //   tap(result => {
    //     this.loadingforgot = false
    //     this.getCurrentVendor();
    //     this.succesmessage = result
    //     this.snackBar.open(this.succesmessage.message, '', {
    //       duration: 2000,
    //     });
    //     this.modalRef.hide()
    //   },
    //     (error: any) => {
    //       this.loadingforgot = false
    //       this.errorMessage = error.error.message;
    //       this.snackBar.open(this.errorMessage, '', {
    //         duration: 2000,
    //       });
    //       console.log(`error on retriving Available Vendor list : ${error}`);
    //     }
    //   ),
    //   finalize(() => {
    //     //this.changeDetectorRefs.detectChanges();
    //   })
    // )
    //   .subscribe(
    //   );
  }

}
