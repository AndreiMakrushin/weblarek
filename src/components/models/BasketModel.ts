import type { IProduct } from "../../types/index.ts";
import type { IEvents } from "../base/Events.ts";
export class BasketModel {
   private _items: IProduct[] = [];

   constructor(private events: IEvents) {}

    getItems(): IProduct[] {
        return this._items;
    }

    addItem(item: IProduct): void {
        this._items.push(item)
        this.events.emit('basket:changed')
    }

    removeItem(itemId: string): void {
    this._items = this._items.filter((item) => item.id !== itemId);
    this.events.emit('basket:changed');
}

    clear(): void {
        this._items = []
        this.events.emit('basket:changed')
    }

    getTotalPrice(): number {
        return this._items.reduce((acc, item) => acc + (item.price || 0), 0)
    }

    getCount(): number {
        return this._items.length
    }

    containsItem(itemId: string): boolean {
        return this._items.some(item => item.id === itemId)
    }

}