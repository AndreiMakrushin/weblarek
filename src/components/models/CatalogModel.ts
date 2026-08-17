import type { IProduct } from "../../types/index.ts";
import type { IEvents } from "../base/Events.ts";

export class CatalogModel {
private _items: IProduct[] = [];
private _selectedItem: IProduct | null = null;

    constructor(private events: IEvents) {}
    
    setItems(items: IProduct[]): void {
        this._items = items;
        this.events.emit('catalog:changed');
    }
    getItems(): IProduct[] {
        return this._items;
    }

    getItemById(id: string): IProduct | undefined {
        return this._items.find(item => item.id === id);
    }

    setSelectedItem(item: IProduct): void {
        this._selectedItem = item;
        this.events.emit('catalog:selected');
    }

    getSelectedItem(): IProduct | null {
        return this._selectedItem;
    }

}