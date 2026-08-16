import { Component } from "../base/Component";
import { ensureElement } from '../../utils/utils';
import type { ICardGeneral } from "../../types/index"

export class CardGeneral extends Component<ICardGeneral> {
    private _titleElement: HTMLElement;
    private _priceElement: HTMLElement;
    constructor(container: HTMLElement) {
        super(container)
        this._titleElement = ensureElement<HTMLElement>('.card__title', this.container);
        this._priceElement = ensureElement<HTMLElement>('.card__price', this.container);
    }


    set data(value: ICardGeneral) {
        this._titleElement.textContent = value.title ?? 'Нет названия';
        this._priceElement.textContent = value.price ? `${value.price} синапсов` : 'Недоступно';
    }
}