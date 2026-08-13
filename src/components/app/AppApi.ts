import { IOrderData, IOrderResponse, IProductsResponse, IApi } from '../../types';

export class AppApi {
    private api: IApi;

    constructor(api: IApi) {
        this.api = api;
    }

   async getProducts(): Promise<IProductsResponse> {
        try{
            return await this.api.get('/product/');
        }catch(error){
            console.error('Ошибка при получении товаров:', error);
            throw error
        }
    }

   async postOrder(data: IOrderData): Promise<IOrderResponse> {
        try{
            return this.api.post('/order/', data, 'POST');
        }catch(error){
            console.error('Ошибка при отправке заказа:', error);
            throw error
        }
    }
}