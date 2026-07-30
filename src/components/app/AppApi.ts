import { IOrderData, IOrderResponse, IProductsResponse, IApi } from '../../types';

export class AppApi {
    private api: IApi;

    constructor(api: IApi) {
        this.api = api;
    }

    getProducts(): Promise<IProductsResponse> {
        return this.api.get('/product/');
    }

    postOrder(data: IOrderData): Promise<IOrderResponse> {
        return this.api.post('/order/', data, 'POST');
    }
}