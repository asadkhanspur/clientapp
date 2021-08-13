import { Credential } from '../modals';


export interface UserResponse {
    data: Credential;
    message: string;
    error: boolean;
    headers: [];
}