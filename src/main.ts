import './scss/styles.scss';
import { Api } from './components/base/Api';
import { AppApi } from './components/app/AppApi';
import { CatalogModel } from "./components/models/CatalogModel";

const api = new Api(import.meta.env.VITE_API_ORIGIN);
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
