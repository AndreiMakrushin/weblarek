import './scss/styles.scss';
import { Api } from './components/base/Api';
import { API_URL } from './utils/constants';
import { AppApi } from './components/app/AppApi';
import { CatalogModel } from "./components/models/CatalogModel";
import { BasketModel } from "./components/models/BasketModel";
import { BuyerModel } from "./components/models/BuyerModel";

const catalogModel = new CatalogModel();
const basketModel = new BasketModel();
const buyerModel = new BuyerModel();

const api = new Api(API_URL);
const appApi = new AppApi(api);

appApi.getProducts()
    .then(products => {
        catalogModel.setItems(products.items); 
        
        console.log('=== Каталог товаров с сервера ===');
        console.log('Все товары:', catalogModel.getItems());
        console.log('Количество товаров:', catalogModel.getItems().length);

        const firstProduct = catalogModel.getItems()[0];
        const secondProduct = catalogModel.getItems()[1];
        
        console.log('\n=== Тестирование CatalogModel с реальными данными ===');
        catalogModel.setSelectedItem(firstProduct);
        console.log('Выбранный товар:', catalogModel.getSelectedItem());
        console.log('Поиск товара по id:', catalogModel.getItemById(firstProduct.id));
        console.log('\n=== Тестирование BasketModel с реальными данными ===');
        basketModel.addItem(firstProduct);
        basketModel.addItem(secondProduct);
        console.log('Товары в корзине:', basketModel.getItems());
        console.log('Количество товаров в корзине:', basketModel.getCount());
        console.log('Общая стоимость корзины:', basketModel.getTotalPrice());
        console.log('Есть ли товар в корзине?', basketModel.containsItem(firstProduct.id));
        
        basketModel.removeItem(firstProduct.id);
        console.log('После удаления первого товара:', basketModel.getItems());
        console.log('\n=== Тестирование BuyerModel ===');
        buyerModel.setData({ email: 'test@mail.ru', phone: '+79991234567' });
        console.log('Данные покупателя (частично):', buyerModel.getData());
        console.log('Валидация (должна показать ошибки payment и address):', buyerModel.validate());
        
        buyerModel.setData({ payment: 'card', address: 'ул. Пушкина, д. 1' });
        console.log('Данные покупателя (полные):', buyerModel.getData());
        console.log('Валидация (должна быть пустой):', buyerModel.validate());
        
        buyerModel.clear();
        console.log('После очистки данных покупателя:', buyerModel.getData());
        basketModel.clear();
        console.log('\n=== Корзина очищена ===');
        console.log('Товаров в корзине:', basketModel.getCount());
        
    })
    .catch(error => {
        console.error('Ошибка при получении товаров:', error);
    });