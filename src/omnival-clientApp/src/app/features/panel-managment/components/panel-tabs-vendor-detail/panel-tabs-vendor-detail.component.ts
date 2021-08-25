import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { VendorService, AvailableVendorService, PendingVendorService } from 'src/app/shared/services';
import { PanelManagmentService } from '../../service';
import { tap, finalize } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NavigationEnd, NavigationStart, Router } from '@angular/router';

@Component({
  selector: 'app-panel-tabs-vendor-detail',
  templateUrl: './panel-tabs-vendor-detail.component.html',
  styleUrls: ['./panel-tabs-vendor-detail.component.css']
})
export class PanelTabsVendorDetailComponent implements OnInit {
  @Output() openProfileVendor:EventEmitter<any>= new EventEmitter<any>();

  vendorList = [];
  gifLoader = false;
  errorMessage: any;
  term: string;

  invitationStatusId: number;
  private invitationStatus = [{
    id: 1,
    name: 'currentVendors'
  }, {
    id: 2,
    name: 'availableVendors'
  }, {
    id: 3,
    name: 'pendingVendors'
  }];


  constructor(
    private router: Router,
    public panelManagmentService: PanelManagmentService,
    private CurrentVendorService: VendorService,
    private availableVendorService: AvailableVendorService,
    public pendingVendorService: PendingVendorService,
    private snackBar: MatSnackBar) { }

  ngOnInit() {
    this.getVendorList();
    this.panelManagmentService.getPendingVendorEmitted$.subscribe((emitVendor: any) => {
      this.getPendingVendors(emitVendor);
    });
    this.panelManagmentService.resetFilterEmitted$.subscribe((emitVendor: any) => {
      if (emitVendor == null) {
        this.getVendorList(); 
      }
    });
  }

  private getVendorList() {
    const route = this.router.url.split("/").slice(-1)[0];
    if(route !=="") {
      let filterInvitationStatus = [...this.invitationStatus.filter((f) => f.name === route)];
      if (filterInvitationStatus.length > 0) {
        this.invitationStatusId = filterInvitationStatus[0].id;
        switch (this.invitationStatusId) {
            case 1:
                this.getCurrentVendors();
                break;
            case 2:
                this.getAvailableVendors();
                break;
            case 3:
                this.getPendingVendors();
                break;
            default:
              this.vendorList = [{}];
        }
      }
    } 
  }

  getCurrentVendors(filter?: any) {
    this.gifLoader = true
    this.CurrentVendorService.ClientId = localStorage.getItem("clientID");
    this.CurrentVendorService.getCurrentVendors(filter).pipe(
      tap(result => {
          this.gifLoader = false
          this.vendorList = result.data;
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
      finalize(() => {})).subscribe();
  }

  getAvailableVendors(filter?: any) {
    this.gifLoader = true;
    this.availableVendorService.ClientId = localStorage.getItem("clientID");
    this.availableVendorService.getAvailableVendors(filter).pipe(
      tap(result => {
        this.gifLoader = false;
        this.vendorList = result.data;
      },
        (error: any) => {
          this.gifLoader = false
          this.errorMessage = error.error.message;
          this.snackBar.open(this.errorMessage, '', {
            duration: 2000,
          });
          console.log(`error on retriving Available Vendor list : ${error}`);
        }
      ),
      finalize(() => { })).subscribe();
  }

  getPendingVendors(filter?: any) {
    this.gifLoader = true;
    this.pendingVendorService.ClientId = localStorage.getItem("clientID");
    this.pendingVendorService.getPendingVendors(filter).pipe(
      tap(result => {
        this.gifLoader = false;
        this.vendorList = result.data;
      },
        (error: any) => {
          this.gifLoader = false;
          this.errorMessage = error.error.message;
          this.snackBar.open(this.errorMessage, '', {
            duration: 2000,
          });
          console.log(`error on retriving Available Vendor list : ${error}`);
        }
      ),
      finalize(() => { })).subscribe();
  }

  backSideShow: any = [];
  flipped: any = [];
  flipIts(i) {
    this.backSideShow[i] = !this.backSideShow[i];
    this.flipped[i] = !this.flipped[i];
  }

  openProile(vendor) {
    this.panelManagmentService.emitVendorChange(vendor);
  }


  removeVendor(invitationId) {
    // var clientId = localStorage.getItem("clientID");
    // this.InvitationSendService.removeVendorFormPanel(clientId, invitationId).pipe(
    // tap(result => {
    // this.loadingforgot = false
    // this.getCurrentVendor();
    // this.succesmessage = result
    // this.snackBar.open(this.succesmessage.message, '', {
    // duration: 2000,
    // });
    // this.modalRef.hide()
    // },
    // (error: any) => {
    // this.loadingforgot = false
    // this.errorMessage = error.error.message;
    // this.snackBar.open(this.errorMessage, '', {
    // duration: 2000,
    // });
    // console.log(`error on retriving Available Vendor list : ${error}`);
    // }
    // ),
    // finalize(() => {
    // //this.changeDetectorRefs.detectChanges();
    // })
    // )
    // .subscribe(
    // );
  }

  deleteInvitationReq(invitationId) {
  }

  ngOnDestroy() { }
}
