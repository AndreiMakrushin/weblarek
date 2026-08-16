import { CardGeneral } from './CardGeneral';
import { ensureElement } from '../../utils/utils';

export class CardBasket extends CardGeneral {
    private _idElement: HTMLElement
    private _deleteButton: HTMLButtonElement
    constructor(container: HTMLElement, onDelete: () => void) {
        super(container);
        this._idElement = ensureElement<HTMLElement>('.basket__item-index', this.container);
        this._deleteButton = ensureElement<HTMLButtonElement>('.basket__item-delete', this.container);

        this._deleteButton.addEventListener('click', () => {
            onDelete();
        })
    }

    set id(value: string) {
        this._idElement.textContent = value;
    }
}