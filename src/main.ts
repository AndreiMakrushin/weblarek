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
import type { IBuyer, IOrderData, TPayment } from './types';

const events = new EventEmitter();
const catalogModel = new CatalogModel(events);
const basketModel = new BasketModel(events);
const buyerModel = new BuyerModel();

const api = new Api(API_URL);
const appApi = new AppApi(api);

const header = new Header(ensureElement('.header'), events);
const gallery = new Gallery(ensureElement('.page__wrapper'));
const modal = new Modal(ensureElement('#modal-container'), events);

const cardPreview = new CardPreview(
    cloneTemplate(ensureElement<HTMLTemplateElement>('#card-preview')),
    events
);

const basket = new Basket(cloneTemplate(ensureElement<HTMLTemplateElement>('#basket')), events);
const success = new Success(cloneTemplate(ensureElement<HTMLTemplateElement>('#success')), events);
const order = new Order(cloneTemplate(ensureElement<HTMLTemplateElement>('#order')), events);
const contacts = new Contacts(cloneTemplate(ensureElement<HTMLTemplateElement>('#contacts')), events);


function getBasketCards(): HTMLElement[] {
    return basketModel.getItems().map((item) => {
        const card = new CardBasket(
            cloneTemplate(ensureElement<HTMLTemplateElement>('#card-basket')),
            () => events.emit('basket:delete', { id: item.id })
        );
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

events.on('catalog:setItems', () => {
    const items = catalogModel.getItems().map(item => {
        const card = new CardCatalog(
            cloneTemplate(ensureElement<HTMLTemplateElement>('#card-catalog')),
            () => events.emit('catalog:setSelectedItem', { id: item.id })
        );
        card.data = item;
        return card.render();
    });
    gallery.catalog = items;
});

events.on('catalog:setSelectedItem', ({ id }: { id: string }) => {
    const selectedItem = catalogModel.getItemById(id);
    if (selectedItem) {
        catalogModel.setSelectedItem(selectedItem);
    }
});

events.on('catalog:open', ({ id }: { id: string }) => {
    const selectedItem = catalogModel.getItemById(id);
    if (!selectedItem) {
        console.error('Товар не найден');
        return;
    }

    const inBasket = basketModel.containsItem(selectedItem.id);

    cardPreview.data = {
        ...selectedItem,
        inBasket: inBasket
    };

    modal.open(cardPreview.render());
});

events.on('basket:open', () => {
    const cards = getBasketCards();

    basket.data = {
        list: cards,
        totalPrice: basketModel.getTotalPrice(),
        state: basketModel.getCount() > 0
    };

    modal.open(basket.render());
});

events.on('basket:delete', ({ id }: { id: string }) => {
    basketModel.removeItem(id);
});

events.on('basket:change', () => {
    header.counter = basketModel.getCount();

    if (modal.isOpen()) {
        const cards = getBasketCards();
        basket.data = {
            list: cards,
            totalPrice: basketModel.getTotalPrice(),
            state: basketModel.getCount() > 0
        };

        modal.open(basket.render());
    }
});

events.on('card:addToBasket', ({ id }: { id: string }) => {
    const item = catalogModel.getItemById(id);
    if (!item) return;

    if (basketModel.containsItem(id)) {
        basketModel.removeItem(id);
    } else {
        basketModel.addItem(item);
    }

    const updatedItem = catalogModel.getItemById(id);
    if (updatedItem) {
        const inBasket = basketModel.containsItem(updatedItem.id);
        cardPreview.data = {
            ...updatedItem,
            inBasket: inBasket
        };

        modal.open(cardPreview.render());
    }
});

events.on('order:placeAnOrder', () => {
    modal.close();
    const customerData = buyerModel.getData();
    order.data = {
        address: customerData.address,
        payment: customerData.payment ?? null
    };
    modal.open(order.render());
});

events.on('customer:change', (data: Partial<IBuyer>) => {
    buyerModel.setData(data);

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
});

events.on('order:submit', () => {
    modal.close();
    modal.open(contacts.render());
});

events.on('contacts:change', (data: { phone: string; email: string }) => {
    buyerModel.setData(data);
    contacts.data = {
        phone: data.phone ?? '',
        email: data.email ?? ''
    };

    const errors = buyerModel.validate();
    const contactErrors: string[] = [];
    if (errors.phone) contactErrors.push(errors.phone);
    if (errors.email) contactErrors.push(errors.email);
    
    contacts.errors = contactErrors;
});

events.on('contacts:submit', async () => {
    modal.close();
    try {
        const orderData: IOrderData = {
            ...buyerModel.getData(),
            items: basketModel.getItems().map(item => item.id),
            total: basketModel.getTotalPrice(),
            payment: buyerModel.getData().payment as TPayment
        };

        const result = await appApi.postOrder(orderData);

        success.total = result.total;
        modal.open(success.render());

        basketModel.clear();
        buyerModel.clear();
        header.counter = 0;
    } catch (error) {
        console.error('Ошибка при оформлении заказа:', error);
    }
});

events.on('success:close', () => {
    modal.close();
});