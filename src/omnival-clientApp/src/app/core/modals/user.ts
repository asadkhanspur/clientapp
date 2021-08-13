export class User {
    userID: number;
    email: string;
    userLogin: string;
    firstName: string;
    lastName: string;
    shortName: string;
    isFirstLogin: boolean;
    isMasterUser: boolean;
    vendorID: number;
    clientID: number;
    userTypeID: number;
    userRoleID: number;
    isUserLoginVerified: boolean;
    accessToken: string;
    isWizardCompleted: boolean;
    // routes:[Route];
    acl:[string];
    permissions: []


    clear(): void {
        this.userID = undefined;
        this.userLogin = '';
        this.email = '';
        this.firstName = '';
        this.lastName = '';
        this.shortName = '';
        this.isFirstLogin = false;
        this.isMasterUser = false;
        this.clientID = undefined;
        this.clientID = undefined;
        this.userTypeID = undefined;
        this.userRoleID = undefined;
        this.isUserLoginVerified = false;
        this.accessToken = '';
        this.permissions = [];
    }
}