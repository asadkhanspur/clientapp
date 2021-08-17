  export interface Notification {
    clientId : number;
    vendorId : number;
    orderId : number;
    userId : number;
    isPageReLoad : false;
    content : string;
    notificationCategory : number
  }
  
  export interface RefreshData {
    refeshDataOf: number;
    forUserType: number;
    isPageReLoad: boolean;
    userId: number;
    clientId: number;
    vendorId: number;
    loanId: number;
    orderId: number;
  }