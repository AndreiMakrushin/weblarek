import type { IProduct } from "../../types/index.ts";
export class BasketModel {
    items: IProduct[] = [];

    getItems(): IProduct[] {
        return this.items;
    }

    addItem(item: IProduct): void {
        this.items.push(item)
    }

    removeItem(itemId: string): void {
        this.items = this.items.filter((item) => item.id !== itemId)
    }

    clear(): void {
        this.items = []
    }

    getTotalPrice(): number {
        return this.items.reduce((acc, item) => acc + (item.price || 0), 0)
    }

    getCount(): number {
        return this.items.length
    }

    containsItem(itemId: string): boolean {
        return this.items.some(item => item.id === itemId)
    }

}