import OrderItem from "./order_item";

export default class Order {
    
    private _id: string;
    private _customerId: string;
    private _items: OrderItem[];
    private _total: number;

    constructor(id: string, customerId: string, items: OrderItem[]) {
        this._id = id;
        this._customerId = customerId;
        this._items = items;
        this._total = this.total();
        this.validate();
    }

    get id(): string {
        return this._id;
    }

    get customerId(): string {
        return this._customerId;
    }

    get items(): OrderItem[] {
        return this._items;
    }

    validate() {
        if (this._id.length === 0) {
            throw new Error("ID is required");
        }
        if (this._customerId.length === 0) {
            throw new Error("CustomerId is required");
        }
        if (this._items.length === 0) {
            throw new Error("Items are required");
        }
    }

    addItem(item: OrderItem) {
        this._items.push(item);
        this._total += item.orderItemTotal();
    }

    removeItem(itemId: string) {
        const index = this._items.findIndex(item => item.id === itemId);
        if (index < 0 || index === undefined) {
            throw new Error ("Item not found");
        }

        const deletedItem = this._items.splice(index, 1);
        this._total -= deletedItem[0].orderItemTotal();
        this.validate();
    }

    total(): number {
        return this._items.reduce((acc, item) => acc + item.orderItemTotal(), 0);
    }
}