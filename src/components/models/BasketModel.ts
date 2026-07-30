import type { IProduct } from "../../types/index.ts";
export class BasketModel {
   private _items: IProduct[] = [];

    getItems(): IProduct[] {
        return this._items;
    }

    addItem(item: IProduct): void {
        this._items.push(item)
    }

    removeItem(itemId: string): void {
        this._items = this._items.filter((item) => item.id !== itemId)
    }

    clear(): void {
        this._items = []
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