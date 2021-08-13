import { BaseModel } from '../../../core/modals';

export class ProductManagment extends BaseModel{
    clientProductId: number
    productId: number
    vendorId: number
    isSystemProduct: boolean
    isFrequentlyUsed: boolean
    isUADReportNeeded: boolean
    isAutoAssignmentEnable: boolean
    active: boolean
}
