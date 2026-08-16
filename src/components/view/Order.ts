import { ensureElement } from '../../utils/utils';
import { IEvents } from "../base/Events";
import { Form } from './Form';
import type { TPaymentModel } from '../../types';

interface IOrder{
    address: string
    payment: TPaymentModel
}

export class Order extends Form {
    private _cardButton: HTMLButtonElement
    private _cashButton: HTMLButtonElement
    private _adressInput: HTMLInputElement
    constructor(container: HTMLFormElement, private events: IEvents) {
        super(container);


        this._cardButton = ensureElement<HTMLButtonElement>('button[name="card"]', this.container);
        this._cashButton = ensureElement<HTMLButtonElement>('button[name="cash"]', this.container);
        this._adressInput = ensureElement<HTMLInputElement>('.form__input[name="address"]', this.container);

        this.container.addEventListener('submit', (event) => {
            event.preventDefault();
            this.events.emit('order:submit');
        })

        this._handleButton.disabled = true

        this._cardButton.addEventListener('click', () => {
            this.events.emit('customer:change', { payment: this._cardButton.getAttribute('name') })
        })

        this._cashButton.addEventListener('click', () => {
            this.events.emit('customer:change', { payment: this._cashButton.getAttribute('name') })
        })

        this._adressInput.addEventListener('input', (event) => {
            const target = event.target as HTMLInputElement;
            this.events.emit('customer:change', { address: target.value.trim() })
        })
    }

    set data(value: IOrder) {
        if(value.address) {
            this._adressInput.value = value.address ?? '';
        }
        if(value.payment){
            if(value.payment === 'card') {
            this._cashButton.classList.remove('button_alt-active');
            this._cardButton.classList.add('button_alt-active');
        } else {
            this._cashButton.classList.add('button_alt-active');
            this._cardButton.classList.remove('button_alt-active');
        }
        }
    }

}