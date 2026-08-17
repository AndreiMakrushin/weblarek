import { ensureElement } from '../../utils/utils';
import { Component } from "../base/Component";

interface IModal {
    content: HTMLElement;
}

export class Modal extends Component<IModal> {
    private _closeButton: HTMLButtonElement;
    private _modalContent: HTMLElement;

    constructor(container: HTMLElement) {
        super(container);
        this._closeButton = ensureElement<HTMLButtonElement>('.modal__close', this.container);
        this._modalContent = ensureElement<HTMLElement>('.modal__content', this.container);

        this._closeButton.addEventListener('click', () => {
            this.close();
        });

        this.container.addEventListener('click', (event) => {
            if (event.target === this.container) {
                this.close();
            }
        });
    }

    open(content: HTMLElement) {
        this._modalContent.replaceChildren(content);
        this.container.classList.add('modal_active');
    }

    close() {
        this.container.classList.remove('modal_active');
        this._modalContent.innerHTML = '';
    }
}