import { BaseModel } from './baseModel';


export class ClientSignup extends BaseModel {
    clientName: string;
	clientDisplayName: string;
	clientTypeId: number;
	timezone: string;
	address: string;
	city: string;
	zip: string;
	stateCode: string;
	clientEmail: string;
	clientPhone: string;
	//isUsingValueLinkProducts: boolean;
	//valueLinkProductURL: string;
	firstName: string;
	lastName: string;
	email: string;
	phone: string;
	userLogin: string;
	password: string;
}