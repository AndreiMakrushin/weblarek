import { Component } from "../base/Component";
import { ensureElement } from '../../utils/utils';

interface IGalleryData{
    catalog: HTMLElement[]
}

export class Gallery extends Component<IGalleryData> {
    private catalogElement: HTMLElement;

    constructor(container: HTMLElement) {
        super(container)
        this.catalogElement = ensureElement<HTMLElement>('.gallery', this.container);
    }


    set catalog(value: HTMLElement[]) {
        this.catalogElement.innerHTML = ''
        value.forEach(item => this.catalogElement.appendChild(item))
    }

}