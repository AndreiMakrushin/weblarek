import type { IBuyer } from "../../types/index.ts";

export class BuyerModel{
payment: 'card' | 'cash' | '' = '';
address: string = '';
email: string = '';
phone: string = '';

    setData(data: Partial<IBuyer>): void{
       if(data.payment !== undefined) this.payment = data.payment
       if(data.address !== undefined) this.address = data.address
       if(data.email !== undefined) this.email = data.email
       if(data.phone !== undefined) this.phone = data.phone
    }

    getData(): IBuyer{
        return{
            payment: this.payment,
            address: this.address,
            email: this.email,
            phone: this.phone,
        }
    }

    clear(): void{
        this.payment = ''
        this.address = ''
        this.email = ''
        this.phone = ''
    }

    validate(): Partial<Record<keyof IBuyer, string>> {
        const errors: Partial<Record<keyof IBuyer, string>> = {};

        if (this.payment === '') {
            errors.payment = 'Не выбран способ оплаты';
        }
        if (this.address === '') {
            errors.address = 'Укажите адрес';
        }
        if (this.email === '') {
            errors.email = 'Укажите email';
        }
        if (this.phone === '') {
            errors.phone = 'Укажите телефон';
        }
        return errors;

    }

}
