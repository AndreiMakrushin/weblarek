import { categoryMap, CDN_URL } from "../../utils/constants"
import { CardGeneral } from "./CardGeneral";
import { ensureElement } from '../../utils/utils';

type CategoryKey = keyof typeof categoryMap;

export class CardCatalog extends CardGeneral{
    private _imageElement: HTMLImageElement;
    private _categoryElement: HTMLElement;

    constructor(container: HTMLElement, onAction: () => void) {
        super(container);
        this._categoryElement = ensureElement<HTMLElement>('.card__category', this.container);
        this._imageElement = ensureElement<HTMLImageElement>('.card__image', this.container);

        this.container.addEventListener('click', () => {
            onAction();
        });
    }

    set image(value: string) {
        this.setImage(this._imageElement, `${CDN_URL}/${value}`);
    }

    set category(value: string) {
        this._categoryElement.textContent = value;
        this._categoryElement.classList.add(categoryMap[value as CategoryKey]);
    }
}