import './scss/styles.scss';
import { Api } from './components/base/Api';
import {API_URL} from './utils/constants';
import { AppApi } from './components/app/AppApi';
import { CatalogModel } from "./components/models/CatalogModel";

const api = new Api(API_URL);
const appApi = new AppApi(api);
const catalogModel = new CatalogModel();

appApi.getProducts()
    .then(products => {
        catalogModel.setItems(products);

        console.log('Каталог товаров:', catalogModel.getItems());
    })
    .catch(error => {
        console.error('Ошибка при получении товаров:', error);
    });
