import { EventEmitter, Injectable } from '@angular/core';
import { Subscription } from 'rxjs';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PanelManagmentService {
  // Apply filter on vendor list
  searchFilter: string = '';

  // For toggle Filter box which is present in panel tab filter component. 
  isCollapsed = true;
  toggleFilterBox() {
    this.isCollapsed = !this.isCollapsed;
  }

  // Observable string sources
  private emitVendorChangeSource = new Subject();
  // Observable string streams
  vendorChangeEmitted$ = this.emitVendorChangeSource.asObservable();
  // Service message commands
  emitVendorChange(change: any) {
      this.emitVendorChangeSource.next(change);
  }

  // Observable string sources
  private emitGetPendingVendorChangeSource = new Subject();
  // Observable string streams
  getPendingVendorEmitted$ = this.emitGetPendingVendorChangeSource.asObservable();
  // Service message commands
  emitGetPendingVendors(change: any) {
      this.emitGetPendingVendorChangeSource.next(change);
  }


  // Observable string sources
  private emitResetFilterSource = new Subject();
  // Observable string streams
  resetFilterEmitted$ = this.emitResetFilterSource.asObservable();
  // Service message commands
  emiResetFilter(change: any) {
      this.emitResetFilterSource.next(change);
  }

}