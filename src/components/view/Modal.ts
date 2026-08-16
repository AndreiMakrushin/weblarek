import { ensureElement } from '../../utils/utils';
import { Component } from "../base/Component";
import { IEvents } from "../base/Events";

interface IModal{
    content: HTMLElement;
}

export class Modal extends Component<IModal> {
    private _closeButton: HTMLButtonElement;
    private _modalContent: HTMLElement;
    private _isOpen: boolean = false;

    constructor(container: HTMLElement, private events: IEvents) {
        super(container)
        this._closeButton = ensureElement<HTMLButtonElement>('.modal__close', this.container);
        this._modalContent = ensureElement<HTMLElement>('.modal__content', this.container);

        this._closeButton.addEventListener('click', () => {
            this.close();
        })

        this.container.addEventListener('click', (event) => {
            if (event.target === this.container) {
                this.close();
            }
        })
    }


    close() {
        if (!this._isOpen) return
        this._isOpen = false
        this.container.classList.remove('modal_active');
        this._modalContent.innerHTML = '';
        this.events.emit('modal:close');
    }

    open(content: HTMLElement) {
        if (this._isOpen) return
        this._isOpen = true
        this.container.classList.add('modal_active');
        this._modalContent.appendChild(content);
        this.events.emit('modal:open');
    }
    isOpen(): boolean {
        return this._isOpen;
    }
}