import { ensureElement } from '../../utils/utils';
import { IEvents } from "../base/Events";
import { Form } from './Form';
import type { TPayment } from '../../types';

interface IOrder {
    address: string;
    payment: TPayment;
}

export class Order extends Form {
    private _cardButton: HTMLButtonElement;
    private _cashButton: HTMLButtonElement;
    private _addressInput: HTMLInputElement;

    constructor(container: HTMLFormElement, private events: IEvents) {
        super(container);

        this._cardButton = ensureElement<HTMLButtonElement>('button[name="card"]', this.container);
        this._cashButton = ensureElement<HTMLButtonElement>('button[name="cash"]', this.container);
        this._addressInput = ensureElement<HTMLInputElement>('.form__input[name="address"]', this.container);

        this.container.addEventListener('submit', (event) => {
            event.preventDefault();
            this.events.emit('order:submit');
        });

        this._cardButton.addEventListener('click', () => {
            this.events.emit('order:payment', { payment: 'card' });
        });

        this._cashButton.addEventListener('click', () => {
            this.events.emit('order:payment', { payment: 'cash' });
        });

        this._addressInput.addEventListener('input', (event) => {
            const target = event.target as HTMLInputElement;
            this.events.emit('order:address', { address: target.value.trim() });
        });
    }

    set data(value: IOrder) {
        this._addressInput.value = value.address ?? '';
        this._cardButton.classList.remove('button_alt-active');
        this._cashButton.classList.remove('button_alt-active');

        if (value.payment === 'card') {
            this._cardButton.classList.add('button_alt-active');
        } else if (value.payment === 'cash') {
            this._cashButton.classList.add('button_alt-active');
        }
    }
}