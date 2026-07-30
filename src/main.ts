import './scss/styles.scss';
import { Api } from './components/base/Api';
import { API_URL } from './utils/constants';
import { AppApi } from './components/app/AppApi';
import { CatalogModel } from "./components/models/CatalogModel";
import { BasketModel } from "./components/models/BasketModel";
import { BuyerModel } from "./components/models/BuyerModel";
import { apiProducts } from './utils/data';

const catalogModel = new CatalogModel();
const basketModel = new BasketModel();
const buyerModel = new BuyerModel();


console.log('=== Тестирование CatalogModel ===');
catalogModel.setItems(apiProducts.items);
console.log('Все товары:', catalogModel.getItems());
console.log('Товар по id "854cef69-976d-4c2a-a18c-2aa45046c390":', catalogModel.getItemById('854cef69-976d-4c2a-a18c-2aa45046c390'));
catalogModel.setSelectedItem(apiProducts.items[0]);
console.log('Выбранный товар:', catalogModel.getSelectedItem());


console.log('=== Тестирование BasketModel ===');
basketModel.addItem(apiProducts.items[0]);
basketModel.addItem(apiProducts.items[1]);
console.log('Товары в корзине:', basketModel.getItems());
console.log('Количество товаров:', basketModel.getCount());
console.log('Общая стоимость:', basketModel.getTotalPrice());
console.log('Есть ли товар с id "854cef69-976d-4c2a-a18c-2aa45046c390"?', basketModel.containsItem('854cef69-976d-4c2a-a18c-2aa45046c390'));
basketModel.removeItem('854cef69-976d-4c2a-a18c-2aa45046c390');
console.log('После удаления товара id "854cef69-976d-4c2a-a18c-2aa45046c390":', basketModel.getItems());
basketModel.clear();
console.log('После очистки корзины:', basketModel.getItems());


console.log('=== Тестирование BuyerModel ===');
buyerModel.setData({ email: 'test@mail.ru', phone: '+79991234567' });
console.log('Данные покупателя:', buyerModel.getData());
console.log('Валидация (должна показать ошибки payment и address):', buyerModel.validate());
buyerModel.setData({ payment: 'card', address: 'ул. Пушкина, д. 1' });
console.log('Все данные заполнены:', buyerModel.getData());
console.log('Валидация (должна быть пустой):', buyerModel.validate());
buyerModel.clear();
console.log('После очистки:', buyerModel.getData());

const api = new Api(API_URL);
const appApi = new AppApi(api);

appApi.getProducts()
    .then(products => {
        catalogModel.setItems(products);
        console.log('Каталог товаров с сервера:', catalogModel.getItems());
    })
    .catch(error => {
        console.error('Ошибка при получении товаров:', error);
    });