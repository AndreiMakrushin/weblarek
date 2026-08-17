import { CardGeneral } from './CardGeneral';
import { ensureElement } from '../../utils/utils';

export class CardBasket extends CardGeneral {
    private _indexElement: HTMLElement
    private _deleteButton: HTMLButtonElement
    constructor(container: HTMLElement, onDelete: () => void) {
        super(container);
        this._indexElement = ensureElement<HTMLElement>('.basket__item-index', this.container);
        this._deleteButton = ensureElement<HTMLButtonElement>('.basket__item-delete', this.container);

        this._deleteButton.addEventListener('click', () => {
            onDelete();
        })
    }

    set index(value: number) {
        this._indexElement.textContent = String(value);
    }
}