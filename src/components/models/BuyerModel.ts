import type { IBuyer, TValidate, TPaymentModel } from "../../types/index.ts";

export class BuyerModel{
private _payment: TPaymentModel = '';
private _address: string = '';
private _email: string = '';
private _phone: string = '';

    setData(data: Partial<IBuyer>): void{
       if(data.payment !== undefined) this._payment = data.payment
       if(data.address !== undefined) this._address = data.address
       if(data.email !== undefined) this._email = data.email
       if(data.phone !== undefined) this._phone = data.phone
    }

    getData(): IBuyer{
        return{
            payment: this._payment,
            address: this._address,
            email: this._email,
            phone: this._phone,
        }
    }

    clear(): void{
        this._payment = ''
        this._address = ''
        this._email = ''
        this._phone = ''
    }

    validate(): TValidate {
        const errors: TValidate = {};

        if (this._payment === '') {
            errors.payment = 'Не выбран способ оплаты';
        }
        if (this._address === '') {
            errors.address = 'Укажите адрес';
        }
        if (this._email === '') {
            errors.email = 'Укажите email';
        }
        if (this._phone === '') {
            errors.phone = 'Укажите телефон';
        }
        return errors;

    }

}
