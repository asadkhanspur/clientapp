import { BaseModel } from "../../../core/modals";

export class ClientEmailTemplate extends BaseModel {
    clientEmailTemplateId: number;
    emailTemplateName: string;
    emailTemplateSubject: string;
    documentCategoryTypeId: number;
    documentTypeId: number;
    templateTypeId: number;
    emailTypeId?: number;
    emailTemplateContent: string;
    emailTo: string;
    emailCc: string;
    emailBcc: string;
    clientDocumentManagementId: any[]
}
