import { Component, OnInit, Input } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { finalize, tap } from 'rxjs/operators';
import { VendorLookupService } from 'src/app/shared/services';

@Component({
  selector: 'vendor-detail-slider-tab',
  templateUrl: './vendor-detail-slider-tab.component.html',
  styleUrls: ['./vendor-detail-slider-tab.component.css']
})
export class VendorDetailSliderTabComponent implements OnInit {
  @Input() vendorId;
  currentVendorProducts: any = {};
  currentVendorStateCoverages: any = {};
  currentVendorContacts: any = {};
  currentVendorSupportingDocuments: any = {};
  errorMessage: string;

  constructor(private snackBar: MatSnackBar,
    private vendorLookupService: VendorLookupService) { }

  ngOnInit(): void {
    this.vendorLookupService.VendorId = this.vendorId;
    this.getCurrentVendorProduct()
    this.getCurrentVendorStateCoverages()
    this.getCurrentVendorContact()
    this.getCurrentVendorSupportingDocument()
  }

  getCurrentVendorProduct() {
    this.vendorLookupService.getCurrentVendorProducts().pipe(
      tap(result => {
        this.currentVendorProducts = result.data.vendorProducts;
      },
        (error: any) => {
          this.errorMessage = error.error.message;
          this.snackBar.open(this.errorMessage, '', {
            duration: 2000,
          });
          console.log(`error on retriving Current Vendor Product : ${error}`);
        }
      ),
      finalize(() => { })).subscribe();
  }

  getCurrentVendorStateCoverages() {
    this.vendorLookupService.getCurrentVendorStateCoverages().pipe(
      tap(result => {
        this.currentVendorStateCoverages = result.data.vendorStateCoverages;
        this.currentVendorStateCoverages = this.currentVendorStateCoverages.filter(x => x.isServiceProvided === true);
      },
        (error: any) => {
          this.errorMessage = error.error.message;
          this.snackBar.open(this.errorMessage, '', {
            duration: 2000,
          });
          console.log(`error on retriving Current Vendor State : ${error}`);
        }
      ),
      finalize(() => { })).subscribe();
  }

  getCurrentVendorContact() {
    this.vendorLookupService.getCurrentVendorUsers().pipe(
      tap(result => {
        this.currentVendorContacts = result.data.vendorUsers;
      },
        (error: any) => {
          this.errorMessage = error.error.message;
          this.snackBar.open(this.errorMessage, '', {
            duration: 2000,
          });
          console.log(`error on retriving Current Vendor Contact : ${error}`);
        }
      ),
      finalize(() => { })).subscribe();
  }

  getCurrentVendorSupportingDocument() {
    this.vendorLookupService.getCurrentVendorDocument().pipe(
      tap(result => {
        this.currentVendorSupportingDocuments = result.data.vendorSupportingDocuments;
      },
        (error: any) => {
          this.errorMessage = error.error.message;
          this.snackBar.open(this.errorMessage, '', {
            duration: 2000,
          });
          console.log(`error on retriving Current Vendor Document : ${error}`);
        }
      ),
      finalize(() => { })).subscribe();
  }
}