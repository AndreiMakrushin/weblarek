import { ensureElement } from '../../utils/utils';
import { Component } from "../base/Component";

interface IForm {
    error: string
    email?: string
    phone?: string
    address?: string
    payment?: string
}

export class Form extends Component<IForm> {
    protected _errorElement: HTMLElement;
    protected _handleButton: HTMLButtonElement;
    protected _form: HTMLFormElement
    constructor(container: HTMLFormElement) {
        super(container);
        this._form = container
        this._errorElement = ensureElement<HTMLElement>('.form__errors', this.container);
        this._handleButton = ensureElement<HTMLButtonElement>('.button[type="submit"]', this.container);
    }

    set errors(errors: string[]) {
        this._errorElement.innerHTML = errors.join(', ')
        this._handleButton.disabled = errors.length > 0
    }
}