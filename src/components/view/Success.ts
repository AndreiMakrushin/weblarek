import { ensureElement } from '../../utils/utils';
import { Component } from "../base/Component";
import { IEvents } from "../base/Events";

interface ISuccess {
    total: number
}

export class Success extends Component<ISuccess> {
    private _totalElement: HTMLElement
    private _closeButton: HTMLButtonElement

    constructor(container: HTMLElement, private events: IEvents) {
        super(container);
        this._totalElement = ensureElement<HTMLElement>('.order-success__description', this.container);
        this._closeButton = ensureElement<HTMLButtonElement>('.order-success__close', this.container);

        this._closeButton.addEventListener('click', () => {
            this.events.emit('success:close')
        })
    }

    set total(value: number) {
        this._totalElement.textContent = `Списано ${value} синапсов`;
    }
}