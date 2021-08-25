import { Component, OnInit, TemplateRef } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { finalize, tap } from 'rxjs/operators';
import * as $ from 'jquery';
import { InvitationSendService, ProfileVendorService } from 'src/app/shared/services';
import { PanelManagmentService } from '../../service';

@Component({
  selector: 'app-vendor-detail-slider',
  templateUrl: './vendor-detail-slider.component.html',
  styleUrls: ['./vendor-detail-slider.component.css']
})
export class VendorDetailSliderComponent implements OnInit {
  currentVendorView: any = {};
  errorMessage: string;
  modalRef: BsModalRef;
  vendor: any = {};
  loadingforgot = false;
  gifLoader = false;
  tabListSource;

  constructor(
              public panelManagmentService: PanelManagmentService,
              private profileVendorService: ProfileVendorService,
              private invitationSendService: InvitationSendService,
              private modalService: BsModalService,
              private snackBar: MatSnackBar) { 
                this.tabListSource = [
                  { title: "Products", alias:"products" },
                  { title: "States", alias:"states" },
                  { title: "Contacts", alias:"contacts" },
                  { title: "Documents", alias:"documents" },
                ];
              }

  ngOnInit(): void {
    this.panelManagmentService.vendorChangeEmitted$.subscribe((emitVendor: any) => {
      this.vendor = emitVendor;
      this.getCurrentVendorVeiwProfile(this.vendor.vendorId);
    });
  }

  getCurrentVendorVeiwProfile(vendorId) {
    this.profileVendorService.VendorId = vendorId;
    this.profileVendorService.getCurrentVendorViewProfile().pipe(
      tap(result => {
        this.gifLoader = false;
        this.currentVendorView = result.data;
        $(".detail-slider-wrapper").addClass("opened");
      },
        (error: any) => {
          this.errorMessage = error.error.message;
          this.snackBar.open(this.errorMessage, '', {
            duration: 2000,
          });
          console.log(`error on retriving Vendor View : ${error}`);
        }
      ),
      finalize(() => {})).subscribe();
  }

  removeVendorInerButton(invitationStatusId) {
    this.invitationSendService.ClientId = localStorage.getItem("clientID");
    this.invitationSendService.removeVendorFormPanel(invitationStatusId).pipe(
      tap((result: any) => {
        // this.getCurrentVendor();
        $(".detail-slider-wrapper").removeClass("opened");
        this.snackBar.open(result, '', {
          duration: 2000,
        });
        this.modalRef.hide()
      },
        (error: any) => {
          this.errorMessage = error.error.message;
          this.snackBar.open(this.errorMessage, '', {
            duration: 2000,
          });
          console.log(`error on retriving Available Vendor list : ${error}`);
        }
      ),
      finalize(() => { })
    ).subscribe();
  }

  openModalWithClass(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(
      template,
      Object.assign({}, { class: 'deletepopup' })
    );
  }

  deleteInvitationReq(invitationStatusId) {
    // this.PendingVendorsService.ClientId = localStorage.getItem("clientID");
    // this.PendingVendorsService.cancelInvitation(invitationId).pipe(
    //   tap((result: any) => {
    //     // this.getPendingVendor();
    //     // this.getAvailableVendor();

    //     this.snackBar.open(result, '', {
    //       duration: 2000,
    //     });
    //     $(".detail-slider-wrapper").removeClass("opened");
    //   },
    //     (error: any) => {
    //       this.errorMessage = error.error.message;
    //       this.snackBar.open(this.errorMessage, '', {
    //         duration: 2000,
    //       });
    //       console.log(`error on retriving Available Vendor list : ${error}`);
    //     }
    //   ),
    //   finalize(() => { })
    // ).subscribe();
  }

  closeProfile(){
    $(".detail-slider-wrapper").removeClass("opened");
  }

  InnerInviteSend() {
    // Need to implement
  }

  changeOrderValue(event, number) {
    // Need to implement
  }

}
