import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseAPI } from 'src/app/core/services';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrderService extends BaseAPI {

  constructor(protected http: HttpClient) {
    super(http);
  }

  getSuggestedVendors(clientId, orderId) {
    return this.getCallById(`/api/clients/${clientId}/orders/${orderId}/order-suggested-vendors`);
  }

  // ************ Get Avm Types **************//
  getAvmType() {
    this.API_URL = "/api/clients/avms";
    return this.getAll();
  }
  // ************ Get Avm Types **************//



  // ************ Avm Order Post **************//
  avmOrderPost(clientId, object) {
    debugger
    return this.postCall(`/api/clients/${clientId}/avms`, object);
  }


  avmOrderPostWithLoan(clientId, loanId, object) {
    debugger
    return this.postCall(`/api/clients/${clientId}/loans/${loanId}/avms`, object);
  }
  // ************ Avm Order Post **************//


  // ************ Avm Order Payment Methods **************//
  avmOrderPayment(clientId, orderId, object) {
    debugger
    return this.postCall(`/api/clients/${clientId}/orders/${orderId}/payment-method`, object);
  }
  // ************ Avm Order Payment Methods **************//


  // ************ Additional Loan Methods **************//
  // additionalLoanPost(clientId, loanId, object) {
  //   debugger
  //   return this.putCall(`/api/clients/${clientId}/loans/${loanId}`, object);
  // }

  additionalLoanPost(clientId, loanId, object) {
    debugger
    return this.putCall(`/api/clients/${clientId}/loans/${loanId}/additional-info`, object);
  }

  // ************ Additional Loan Methods **************//



  // ************ Order Detail Methods **************//
  orderDetailPost(clientId, loanId, object) {
    debugger
    return this.postCall(`/api/clients/${clientId}/loans/${loanId}/orders`, object);
  }

  orderDetailPut(clientId, loanId, orderId, object) {
    debugger
    return this.putCall(`/api/clients/${clientId}/loans/${loanId}/orders/${orderId}`, object);
  }
  // ************ Order Detail Methods **************//



  // ************ Order Contact Methods **************//
  getContactById(orderId, contactId) {
    debugger
    this.API_URL = "/api/orders/" + orderId + "/contacts"
    return this.getById(contactId);
  }

  orderContacTEdittSubmit(orderId, contactPersonId, model): Observable<any> {
    return this.putCall("/api/orders/" + orderId + `/contacts/` + contactPersonId, model);
  }
  // ************ Order Contact Methods **************//




  // ************ Order Documents Methods **************//
  orderSupportingDocPost(clientId, orderId, object) {
    debugger
    return this.postCall("/api/clients/" + clientId + `/orders/${orderId}/documents`, object);
  }

  orderSupportingMultipleDocs(clientId, orderId, object) {
    debugger
    return this.postCall("/api/clients/" + clientId + `/orders/${orderId}/client-documents`, object);
  }
  // ************ Order Documents Methods **************//

  // ************ Order Borrower & CoBorrower Methods **************//
  orderCoBorrowerSubmit(clientId, loanid, model): Observable<any> {
    debugger
    return this.postCall("/api/clients/" + clientId + `/loans/${loanid}/loan-contacts`, model);
  }

  orderBorrowerEditSubmit(clientId, loanid, loanContactId, model): Observable<any> {
    debugger
    return this.putCall("/api/clients/" + clientId + `/loans/${loanid}/loan-contacts/${loanContactId}`, model);
  }

  orderBorrowerGet(clientId, loanid, orderId = 0) {
    this.API_URL = "/api/clients/" + clientId + `/loans/${loanid}/orders/${orderId}/borrower`;
    return this.getAll();
  }

  orderCoBorrowerGet(clientId, loanid, orderId = 0) {
    this.API_URL = "/api/clients/" + clientId + `/loans/${loanid}/orders/${orderId}/co-borrowers`;
    return this.getAll();
  }


  getBorrowersById(clientId, loanId, loanContactId) {
    debugger
    this.API_URL = "/api/clients/" + clientId + `/loans/${loanId}/loan-contacts`;
    return this.getById(loanContactId);
  }


  deleteCoBorrower(clientId, loanId, contactId): Observable<any> {
    debugger
    // this.model=false;
    this.API_URL = "/api/clients/" + clientId + `/loans/${loanId}/loan-contacts/${contactId}`;
    return this.deleteCallDoc(this.API_URL);
  }


  // ************ Order Borrower & CoBorrower Methods **************//




  // ************ Order General Methods **************//
  orderAddLoanProperty(clientId, model) {
    debugger
    return this.postCall("/api/clients/" + clientId + `/loans`, model);
  }
  // ************ Order General Methods **************//



  // ************ Order Client User Methods **************//
  orderClientUser(clientId, loanId, object) {
    debugger
    return this.postCall(`/api/clients/${clientId}/loans/${loanId}/processors`, object);
  }
  // ************ Order Client User Methods **************//


  // ************ Client Vendor Prodcts User Methods **************//
  clientVendorProdctGet(clientId, productTypeId) {
    this.API_URL = "/api/clients/" + clientId + `/product-types/${productTypeId}`;
    return this.getAll();
  }
  // ************ Client Vendor Prodcts User Methods **************//


  // ************ Order Payment Methods **************//
  orderPayment(clientId, orderId, object) {
    debugger
    return this.postCall(`/api/clients/${clientId}/orders/${orderId}/payment-method`, object);
  }
  // ************ Order Payment Methods **************//

  // ************ Order Draft Step **************//
  orderDraftStep(clientId, orderId, draftStep) {
    return this.postCall(`/api/clients/${clientId}/orders/${orderId}/${draftStep}`, null);
  }
  // ************ Order Draft Step **************//

  getFeeTurnTime(clientId, loanId, productId, vendorId) {
    return this.getCall(`/api/clients/${clientId}/loans/${loanId}/get-order-fee/${productId}/${vendorId}`);
  }



  getAvmObject(clientId, orderId) {
    return this.getCall(`/api/clients/${clientId}/orders/${orderId}/avm`);
  }







  // ******* Order Setting Service ******* //
  getOrderFieldSetting(clientId) {
    return this.getCall(`/api/clients/${clientId}/order-fields`);
  }


  orderFieldSubmit(clientId, orderFieldId,  model): Observable<any> {
    debugger
    return this.putCall("/api/clients/" + clientId + `/order-fields/${orderFieldId}`, model);
  }
  // ******* Order Setting Service ******* //

  orderReviewSettingSubmit(clientId, model): Observable<any> {
    debugger
    return this.putCall("/api/clients/" + clientId + `/review-settings`, model);
  }


}


