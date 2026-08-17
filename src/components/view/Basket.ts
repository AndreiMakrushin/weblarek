import { Component } from "../base/Component";
import { ensureElement } from '../../utils/utils';
import { IEvents } from "../base/Events";

interface IBasket {
    list: HTMLElement[]
    totalPrice: number;
    isOrderAvailable: boolean
}

export class Basket extends Component<IBasket> {
    private _listElement: HTMLUListElement;
    private _buttonElement: HTMLButtonElement;
    private _totalPriceElement: HTMLElement;
    constructor(container: HTMLElement, private events: IEvents) {
        super(container);
        this._listElement = ensureElement<HTMLUListElement>('.basket__list', this.container);
        this._buttonElement = ensureElement<HTMLButtonElement>('.basket__button', this.container);
        this._totalPriceElement = ensureElement<HTMLElement>('.basket__price', this.container);

        this._buttonElement.addEventListener('click', () => {
            this.events.emit('basket:submit')
        })
    }

    set data(value: IBasket) {
        this._listElement.replaceChildren(...value.list);
        
        this._totalPriceElement.textContent = String(value.totalPrice) + ' синапсов';
        this._buttonElement.disabled = !value.isOrderAvailable;
    }
}