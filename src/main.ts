import './scss/styles.scss';
import { Api } from './components/base/Api';
import { API_URL } from './utils/constants';
import { AppApi } from './components/app/AppApi';
import { CatalogModel } from "./components/models/CatalogModel";
import { BasketModel } from "./components/models/BasketModel";
import { BuyerModel } from "./components/models/BuyerModel";
import { Header } from './components/view/Header';
import { EventEmitter } from './components/base/Events';
import { ensureElement, cloneTemplate } from './utils/utils'
import { Gallery } from './components/view/Gallery';
import type { IProduct } from './types/index'
import { CardCatalog } from './components/view/CardCatalog'


const events = new EventEmitter();
const catalogModel = new CatalogModel(events);
const basketModel = new BasketModel();
const buyerModel = new BuyerModel();

const api = new Api(API_URL);
const appApi = new AppApi(api);


const header = new Header(ensureElement('.header'), events)
const gallery = new Gallery(ensureElement('.page__wrapper'));



(function () {
    events.on('catalog:setItems', () => {
        const items = catalogModel.getItems().map(item => {
            const card = new CardCatalog(cloneTemplate(ensureElement<HTMLTemplateElement>('#card-catalog')), () => {
                events.emit('catalog:setSelectedItem', { id: item.id });
            })

            card.data = item;
            return card.render(item);
        });

        gallery.render({ catalog: items });
    })





    appApi.getProducts()
        .then(Allproducts => {
            catalogModel.setItems(Allproducts.items);
        })
        .catch(error => {
            console.error('Ошибка при получении товаров:', error);
        });
})()






/* events.on('basket:open', () => {
    header.counter = 3000;
    const modal = ensureElement('.modal')
    if (modal) {
       // modal.style.display = 'block'
    }
}) */




