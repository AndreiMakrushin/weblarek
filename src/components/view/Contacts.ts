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

        const onChange = () => {
            this.events.emit('contacts:change', this._getFormData());
        };

        this._phoneElement.addEventListener('input', onChange);
        this._emailElement.addEventListener('input', onChange);

        this._handleButton.disabled = true

        this.container.addEventListener('submit', (event) => {
            event.preventDefault();
            this.events.emit('contacts:submit', this._getFormData());
        });
    }

    protected _getFormData(): IContactsData {
        return {
            phone: this._phoneElement.value,
            email: this._emailElement.value
        };
    }

    set data(value: IContactsData) {
        this._phoneElement.value = value.phone;
        this._emailElement.value = value.email;
    }
}