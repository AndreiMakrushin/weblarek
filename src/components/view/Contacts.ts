import { ensureElement } from '../../utils/utils';
import { IEvents } from "../base/Events";
import { Form } from './Form';

interface IContactsData {
    phone: string;
    email: string;
}

export class Contacts extends Form {
    private _phoneElement: HTMLInputElement;
    private _emailElement: HTMLInputElement;

    constructor(container: HTMLFormElement, private events: IEvents) {
        super(container);

        this._phoneElement = ensureElement<HTMLInputElement>('.form__input[name="phone"]', this.container);
        this._emailElement = ensureElement<HTMLInputElement>('.form__input[name="email"]', this.container);

        this._phoneElement.addEventListener('input', (event) => {
            const target = event.target as HTMLInputElement;
            this.events.emit('contacts:phone', { phone: target.value.trim() });
        });

        this._emailElement.addEventListener('input', (event) => {
            const target = event.target as HTMLInputElement;
            this.events.emit('contacts:email', { email: target.value.trim() });
        });

        this.container.addEventListener('submit', (event) => {
            event.preventDefault();
            this.events.emit('contacts:submit');
        });
    }

    set data(value: IContactsData) {
        this._phoneElement.value = value.phone ?? '';
        this._emailElement.value = value.email ?? '';
    }
}