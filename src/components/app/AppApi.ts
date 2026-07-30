import { Api } from '../base/Api';
import { IProduct, IOrderData, IOrderResponse } from '../../types';

export class AppApi {
    private api: Api;

    constructor(api: Api) {
        this.api = api;
    }

    getProducts(): Promise<{ total: number; items: IProduct[] }> {
        return this.api.get('/product/');
    }

    postOrder(data: IOrderData): Promise<IOrderResponse> {
        return this.api.post('/order/', data, 'POST');
    }
}