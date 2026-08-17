import './scss/styles.scss';
import { Api } from './components/base/Api';
import { API_URL } from './utils/constants';
import { AppApi } from './components/app/AppApi';
import { CatalogModel } from "./components/models/CatalogModel";
import { BasketModel } from "./components/models/BasketModel";
import { BuyerModel } from "./components/models/BuyerModel";
import { Header } from './components/view/Header';
import { EventEmitter } from './components/base/Events';
import { ensureElement, cloneTemplate } from './utils/utils';
import { Gallery } from './components/view/Gallery';
import { CardCatalog } from './components/view/CardCatalog';
import { Modal } from './components/view/Modal';
import { CardPreview } from './components/view/CardPreview';
import { Basket } from './components/view/Basket';
import { Success } from './components/view/Success';
import { Order } from './components/view/Order';
import { Contacts } from './components/view/Contacts';
import { CardBasket } from './components/view/CardBasket';
import type { IOrderData, TPayment } from './types';

const events = new EventEmitter();
const catalogModel = new CatalogModel(events);
const basketModel = new BasketModel(events);
const buyerModel = new BuyerModel(events);

const api = new Api(API_URL);
const appApi = new AppApi(api);

const header = new Header(ensureElement('.header'), events);
const gallery = new Gallery(ensureElement('.gallery'));
const modal = new Modal(ensureElement('#modal-container'));

const cardPreview = new CardPreview(
    cloneTemplate(ensureElement<HTMLTemplateElement>('#card-preview')),
    events
);

const basket = new Basket(cloneTemplate(ensureElement<HTMLTemplateElement>('#basket')), events);
const success = new Success(cloneTemplate(ensureElement<HTMLTemplateElement>('#success')), events);
const order = new Order(cloneTemplate(ensureElement<HTMLTemplateElement>('#order')), events);
const contacts = new Contacts(cloneTemplate(ensureElement<HTMLTemplateElement>('#contacts')), events);

function getBasketCards(): HTMLElement[] {
    return basketModel.getItems().map((item, index) => {
        const card = new CardBasket(
            cloneTemplate(ensureElement<HTMLTemplateElement>('#card-basket')),
            () => events.emit('basket:delete', { id: item.id })
        );
        card.index = index + 1;
        card.data = item;
        return card.render();
    });
}

appApi.getProducts()
    .then(allProducts => {
        catalogModel.setItems(allProducts.items);
    })
    .catch(error => {
        console.error('Ошибка при получении товаров:', error);
    });

events.on('catalog:changed', () => {
    const items = catalogModel.getItems().map(item => {
        const card = new CardCatalog(
            cloneTemplate(ensureElement<HTMLTemplateElement>('#card-catalog')),
            () => events.emit('card:selected', { id: item.id })
        );
        card.data = item;
        return card.render();
    });
    gallery.catalog = items;
});

events.on('card:selected', ({ id }: { id: string }) => {
    const selectedItem = catalogModel.getItemById(id);
    if (selectedItem) {
        catalogModel.setSelectedItem(selectedItem);
    }
});

events.on('catalog:selected', () => {
    const selectedItem = catalogModel.getSelectedItem();
    if (!selectedItem) return;

    const inBasket = basketModel.containsItem(selectedItem.id);
    cardPreview.data = {
        ...selectedItem,
        inBasket: inBasket
    };

    modal.open(cardPreview.render());
});

events.on('preview:submit', () => {
    const selectedItem = catalogModel.getSelectedItem();
    if (!selectedItem) return;

    if (basketModel.containsItem(selectedItem.id)) {
        basketModel.removeItem(selectedItem.id);
    } else {
        basketModel.addItem(selectedItem);
    }

    modal.close();
});

events.on('basket:open', () => {
    modal.open(basket.render());
});

events.on('basket:delete', ({ id }: { id: string }) => {
    basketModel.removeItem(id);
});

events.on('basket:changed', () => {
    header.counter = basketModel.getCount();

    const cards = getBasketCards();
    basket.data = {
        list: cards,
        totalPrice: basketModel.getTotalPrice(),
        isOrderAvailable: basketModel.getCount() > 0
    };
});

events.on('basket:submit', () => {
    modal.close();
    const customerData = buyerModel.getData();
    order.data = {
        address: customerData.address,
        payment: customerData.payment as TPayment
    };
    modal.open(order.render());
});

events.on('customer:changed', () => {
    const customerData = buyerModel.getData();
    
    order.data = {
        address: customerData.address,
        payment: customerData.payment as TPayment
    };

    const errors = buyerModel.validate();
    const orderErrors: string[] = [];
    if (errors.payment) orderErrors.push(errors.payment);
    if (errors.address) orderErrors.push(errors.address);
    order.errors = orderErrors;

    contacts.data = {
        phone: customerData.phone,
        email: customerData.email
    };

    const contactErrors: string[] = [];
    if (errors.phone) contactErrors.push(errors.phone);
    if (errors.email) contactErrors.push(errors.email);
    contacts.errors = contactErrors;
});

events.on('order:payment', (data: { payment: TPayment }) => {
    buyerModel.setData({ payment: data.payment });
});

events.on('order:address', (data: { address: string }) => {
    buyerModel.setData({ address: data.address });
});

events.on('contacts:phone', (data: { phone: string }) => {
    buyerModel.setData({ phone: data.phone });
});

events.on('contacts:email', (data: { email: string }) => {
    buyerModel.setData({ email: data.email });
});

events.on('order:submit', () => {
    modal.close();
    modal.open(contacts.render());
});

events.on('contacts:submit', async () => {
    modal.close();
    try {
        const customerData = buyerModel.getData();
        const orderData: IOrderData = {
            payment: customerData.payment as TPayment,
            email: customerData.email,
            phone: customerData.phone,
            address: customerData.address,
            items: basketModel.getItems().map(item => item.id),
            total: basketModel.getTotalPrice()
        };

        const result = await appApi.postOrder(orderData);

        success.total = result.total;
        modal.open(success.render());

        basketModel.clear();
        buyerModel.clear();
    } catch (error) {
        console.error('Ошибка при оформлении заказа:', error);
    }
});

events.on('success:close', () => {
    modal.close();
});