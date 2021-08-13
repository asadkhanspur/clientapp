import { User } from '.';

export interface Credential {
    user: User;
    accessToken: string;
    session: string;
   
}