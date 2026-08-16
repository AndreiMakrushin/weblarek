import { categoryMap, CDN_URL } from "../../utils/constants";
import { ensureElement } from '../../utils/utils';
import { CardGeneral } from "./CardGeneral";
import type { ICardPreview } from "../../types/index";
import { IEvents } from "../base/Events";

type CategoryKey = keyof typeof categoryMap;

export class CardPreview extends CardGeneral {
    private _imageElement: HTMLImageElement;
    private _categoryElement: HTMLElement;
    private _descriptionElement: HTMLElement;
    private _buttonElement: HTMLButtonElement;
    private _id: string = '';

    constructor(container: HTMLElement, private events: IEvents) {
        super(container);
        this._imageElement = ensureElement<HTMLImageElement>('.card__image', this.container);
        this._categoryElement = ensureElement<HTMLElement>('.card__category', this.container);
        this._descriptionElement = ensureElement<HTMLElement>('.card__text', this.container);
        this._buttonElement = ensureElement<HTMLButtonElement>('.card__button', this.container);

        this._buttonElement.addEventListener('click', (e) => {
            e.stopPropagation();
            if (this._id) {
                this.events.emit('card:addToBasket', { id: this._id });
            }
        });
    }

    set data(value: ICardPreview) {
        super.data = value;
        this._id = value.id;
        
        this.setImage(this._imageElement, `${CDN_URL}/${value.image}`);
        this._categoryElement.textContent = value.category;
        this._categoryElement.className = `card__category ${categoryMap[value.category as CategoryKey]}`;
        this._descriptionElement.textContent = value.description ?? 'Описание отсутствует';

        if (value.price === null) {
            this._buttonElement.disabled = true;
            this._buttonElement.textContent = 'Недоступно';
            return;
        }

        const buttonText = value.inBasket ? 'Удалить из корзины' : 'В корзину';
        this._buttonElement.textContent = buttonText;
        this._buttonElement.disabled = false;
    }
}