import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseAPI } from 'src/app/core/services';


@Injectable({
    providedIn: 'root'
})
export class ProductManagmentService extends BaseAPI {
    private clientId = "0";

    constructor(
        protected httpClient: HttpClient
    ) {
        super(httpClient);
        this.API_URL = "/clients/" + this.clientId + "/Products";
    }


    getProductsManagmentList(clientId) {
        this.API_URL = "/clients/" + clientId + "/Products";
        return this.getAll();
    }

    putProductManagment(clientId, object) {
        debugger
        return this.putCall(`/clients/${clientId}/Products`, object);
    }

}