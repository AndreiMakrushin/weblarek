# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Vite

Структура проекта:

- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:

- index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/main.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск

Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run dev
```

или

```
yarn
yarn dev
```

## Сборка

```
npm run build
```

или

```
yarn build
```

# Интернет-магазин «Web-Larёk»

«Web-Larёk» — это интернет-магазин с товарами для веб-разработчиков, где пользователи могут просматривать товары, добавлять их в корзину и оформлять заказы. Сайт предоставляет удобный интерфейс с модальными окнами для просмотра деталей товаров, управления корзиной и выбора способа оплаты, обеспечивая полный цикл покупки с отправкой заказов на сервер.

## Архитектура приложения

Код приложения разделен на слои согласно парадигме MVP (Model-View-Presenter), которая обеспечивает четкое разделение ответственности между классами слоев Model и View. Каждый слой несет свой смысл и ответственность:

Model - слой данных, отвечает за хранение и изменение данных.  
View - слой представления, отвечает за отображение данных на странице.  
Presenter - презентер содержит основную логику приложения и отвечает за связь представления и данных.

Взаимодействие между классами обеспечивается использованием событийно-ориентированного подхода. Модели и Представления генерируют события при изменении данных или взаимодействии пользователя с приложением, а Презентер обрабатывает эти события используя методы как Моделей, так и Представлений.

### Базовый код

#### Класс Component

Является базовым классом для всех компонентов интерфейса.
Класс является дженериком и принимает в переменной `T` тип данных, которые могут быть переданы в метод `render` для отображения.

Конструктор:  
`constructor(container: HTMLElement)` - принимает ссылку на DOM элемент за отображение, которого он отвечает.

Поля класса:  
`container: HTMLElement` - поле для хранения корневого DOM элемента компонента.

Методы класса:  
`render(data?: Partial<T>): HTMLElement` - Главный метод класса. Он принимает данные, которые необходимо отобразить в интерфейсе, записывает эти данные в поля класса и возвращает ссылку на DOM-элемент. Предполагается, что в классах, которые будут наследоваться от `Component` будут реализованы сеттеры для полей с данными, которые будут вызываться в момент вызова `render` и записывать данные в необходимые DOM элементы.  
`setImage(element: HTMLImageElement, src: string, alt?: string): void` - утилитарный метод для модификации DOM-элементов `<img>`

#### Класс Api

Содержит в себе базовую логику отправки запросов.

Конструктор:  
`constructor(baseUrl: string, options: RequestInit = {})` - В конструктор передается базовый адрес сервера и опциональный объект с заголовками запросов.

Поля класса:  
`baseUrl: string` - базовый адрес сервера  
`options: RequestInit` - объект с заголовками, которые будут использованы для запросов.

Методы:  
`get(uri: string): Promise<object>` - выполняет GET запрос на переданный в параметрах ендпоинт и возвращает промис с объектом, которым ответил сервер  
`post(uri: string, data: object, method: ApiPostMethods = 'POST'): Promise<object>` - принимает объект с данными, которые будут переданы в JSON в теле запроса, и отправляет эти данные на ендпоинт переданный как параметр при вызове метода. По умолчанию выполняется `POST` запрос, но метод запроса может быть переопределен заданием третьего параметра при вызове.  
`handleResponse(response: Response): Promise<object>` - защищенный метод проверяющий ответ сервера на корректность и возвращающий объект с данными полученный от сервера или отклоненный промис, в случае некорректных данных.

#### Класс EventEmitter

Брокер событий реализует паттерн "Наблюдатель", позволяющий отправлять события и подписываться на события, происходящие в системе. Класс используется для связи слоя данных и представления.

Конструктор класса не принимает параметров.

Поля класса:  
`_events: Map<string | RegExp, Set<Function>>)` - хранит коллекцию подписок на события. Ключи коллекции - названия событий или регулярное выражение, значения - коллекция функций обработчиков, которые будут вызваны при срабатывании события.

Методы класса:  
`on<T extends object>(event: EventName, callback: (data: T) => void): void` - подписка на событие, принимает название события и функцию обработчик.  
`emit<T extends object>(event: string, data?: T): void` - инициализация события. При вызове события в метод передается название события и объект с данными, который будет использован как аргумент для вызова обработчика.  
`trigger<T extends object>(event: string, context?: Partial<T>): (data: T) => void` - возвращает функцию, при вызове которой инициализируется требуемое в параметрах событие с передачей в него данных из второго параметра.

Данные:

Товар

Данный интерфейс используется для карточек товара

```typescript
interface IProduct {
  id: string;
  title: string;
  image: string;
  category: string;
  price: number | null;
  description: string;
}
```

Покупатель

Данный интерфейс используется для данных пользователя

```typescript
interface IBuyer {
  payment: "card" | "cash" | "";
  address: string;
  email: string;
  phone: string;
}
```

Модели данных:

Класс отвечает за хранение и управление данными о товарах, доступных в приложении. Обеспечивает доступ к списку всех товаров и к выбранному для просмотра товару.

```typescript
class CatalogModel {
items: IProduct[]; — массив всех товаров, доступных для покупки
selectedItem: IProduct | null; — товар, выбранный пользователем для детального просмотра

    сохраняет массив товаров, полученных в параметре метода
    setItems(items: IProduct[]): void {
        this.items = items;
    }

    возвращает массив всех товаров из модели
    getItems(): IProduct[] {
        return this.items;
    }

    возвращает товар по его ID или undefined, если товар не найден
    getItemById(id: string): IProduct | undefined {
        return this.items.find(item => item.id === id);
    }

    сохраняет товар для подробного отображения
    setSelectedItem(item: IProduct): void {
        this.selectedItem = item;
    }

    возвращает товар для подробного отображения
    getSelectedItem(): IProduct | null {
        return this.selectedItem;
    }

}
```

Класс отвечает за хранение и управление товарами, которые пользователь выбрал для покупки. Предоставляет методы для добавления, удаления и получения информации о товарах в корзине.

```typescript
class BasketModel {
items: IProduct[]; — массив товаров, выбранных покупателем для покупки

    возвращает массив товаров, находящихся в корзине
    getItems(): IProduct[] {
        return this.items;
    }

    добавляет товар в массив корзины
    addItem(item: IProduct): void{
        this.items.push(item)
    }

    удаляет товар из корзины по его ID
    removeItem(itemId: string): void{
       this.items = this.items.filter((item) => item.id !== itemId)
    }

    очищает корзину (удаляет все товары)
    clear(): void{
        this.items = []
    }

    возвращает общую стоимость всех товаров в корзине (суммирует price всех товаров)
    getTotalPrice(): number{
        return this.items.reduce((acc, item) => acc + (item.price || 0), 0)
    }

    возвращает количество товаров в корзине
    getCount(): number{
        return this.items.length
    }

    проверяет наличие товара в корзине по его ID
    containsItem(itemId: string): boolean{
        return this.items.some(item => item.id === itemId)
    }

}
```

Класс отвечает за хранение и управление данными покупателя, необходимыми для оформления заказа. Обеспечивает сохранение, получение, очистку и валидацию данных.

```typescript
class BuyerModel{
payment: 'card' | 'cash' | ''; — способ оплаты
address: string; — адрес доставки
email: string; — электронная почта
phone: string; — номер телефона

    сохраняет данные покупателя
    setData(data: Partial<IBuyer>): void{
       if(data.payment !== undefined) this.payment = data.payment
       if(data.address !== undefined) this.address = data.address
       if(data.email !== undefined) this.email = data.email
       if(data.phone !== undefined) this.phone = data.phone
    }

    возвращает все данные покупателя
    getData(): IBuyer{
        return{
            payment: this.payment,
            address: this.address,
            email: this.email,
            phone: this.phone,
        }
    }

    очищает все данные покупателя
    clear(): void{
        this.payment = ''
        this.address = ''
        this.email = ''
        this.phone = ''
    }

    выполняет валидацию всех полей и возвращает объект с ошибками.
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

```

Слой коммуникации

Класс отвечает за взаимодействие с сервером. Использует композицию с классом Api для выполнения HTTP-запросов. Обеспечивает получение списка товаров и отправку данных заказа.

```typescript
class AppApi {
  private api: Api;

  constructor(api: Api) {
    this.api = api;
  }

  getProducts(): Promise<IProduct[]> {
    return this.api.get("/product/", () => []);
  }

  postOrder(data: IOrderData): Promise<IOrderResponse> {
    return this.api.post("/order/", data, () => ({}) as IOrderResponse);
  }
}
```

```typescript
interface IOrderData {
  items: string[];
  payment: "card" | "cash";
  email: string;
  phone: string;
  address: string;
  total: number;
}
```

```typescript
export interface IOrderResponse {
  id: string;
  total: number;
}
```

Слой представления (View)

Слой представления отвечает за отображение данных и взаимодействие с пользователем. Все классы представления наследуются от базового класса Component и используют шаблоны из HTML для генерации DOM-элементов.

Базовые классы
Класс `CardGeneral `
Базовый класс для всех карточек товара. Содержит общую логику для отображения названия и цены.

Назначение: Родительский класс для всех карточек (каталог, превью, корзина).

Поля класса:

`\_titleElement: HTMLElement ` — элемент для отображения названия товара

`\_priceElement: HTMLElement ` — элемент для отображения цены

Сеттеры:

`set data(value: ICardGeneral) ` — устанавливает название и цену товара

Класс `Form `
Базовый класс для всех форм. Содержит общую логику для отображения ошибок и управления кнопкой отправки.

Назначение: Родительский класс для форм заказа и контактов.

Поля класса:

`\_errorElement: HTMLElement `— элемент для отображения ошибок

`\_handleButton: HTMLButtonElement `— кнопка отправки формы

`\_form: HTMLFormElement `— DOM-элемент формы

Сеттеры:

`set errors(errors: string[]) `— отображает ошибки и блокирует/разблокирует кнопку

Компоненты представления
Класс `Header `
Отвечает за отображение шапки сайта с корзиной и счётчиком товаров.

Назначение: Управление верхней панелью навигации.

Поля класса:

`basketButton: HTMLButtonElement `— кнопка открытия корзины

`counterElement: HTMLElement `— элемент для отображения количества товаров

Сеттеры:

`set counter(value: number) `— обновляет счётчик товаров в корзине

События:

`basket:open `— генерируется при клике на кнопку корзины

Класс `Gallery `
Отвечает за отображение каталога товаров на главной странице.

Назначение: Контейнер для всех карточек товаров.

Поля класса:

`catalogElement: HTMLElement `— DOM-элемент для вставки карточек

Сеттеры:

`set catalog(items: HTMLElement[]) `— заменяет содержимое галереи на переданный массив карточек

Класс `CardCatalog `
Отвечает за отображение карточки товара в каталоге.

Назначение: Представление товара в списке на главной странице.

Поля класса:

`\_imageElement: HTMLImageElement `— изображение товара

`\_categoryElement: HTMLElement `— категория товара

Сеттеры:

`set data(value: ICardCatalog) `— устанавливает все данные товара

События:

`card:selected `— генерируется при клике на карточку

Класс `CardPreview `
Отвечает за отображение детальной карточки товара в модальном окне.

Назначение: Показ полной информации о товаре с кнопкой добавления/удаления из корзины.

Поля класса:

`\_imageElement: HTMLImageElement `— изображение товара

`\_categoryElement: HTMLElement `— категория товара

`\_descriptionElement: HTMLElement `— описание товара

`\_buttonElement: HTMLButtonElement `— кнопка "Купить"/"Удалить из корзины"

Сеттеры:

`set data(value: ICardPreview) `— устанавливает все данные и управляет состоянием кнопки

События:

`preview:submit `— генерируется при клике на кнопку

Класс `CardBasket `
Отвечает за отображение товара в корзине.

Назначение: Представление товара в списке корзины с возможностью удаления.

Поля класса:

`\_indexElement: HTMLElement `— порядковый номер товара

`\_deleteButton: HTMLButtonElement `— кнопка удаления

Сеттеры:

`set index(value: number) `— устанавливает порядковый номер

События:

`basket:delete `— генерируется при клике на кнопку удаления

Класс `Basket `
Отвечает за отображение корзины в модальном окне.

Назначение: Список выбранных товаров с общей стоимостью и кнопкой оформления.

Поля класса:

`\_listElement: HTMLUListElement `— список товаров

`\_buttonElement: HTMLButtonElement `— кнопка "Оформить"

`\_totalPriceElement: HTMLElement `— общая стоимость

Сеттеры:

`set data(value: IBasket) `— обновляет список, стоимость и состояние кнопки

События:

`basket:submit `— генерируется при клике на кнопку "Оформить"

Класс `Order `
Отвечает за форму выбора способа оплаты и ввода адреса.

Назначение: Первый шаг оформления заказа.

Поля класса:

`\_cardButton: HTMLButtonElement `— кнопка выбора оплаты картой

`\_cashButton: HTMLButtonElement `— кнопка выбора оплаты наличными

`\_addressInput: HTMLInputElement `— поле ввода адреса

Сеттеры:

`set data(value: IOrder) `— устанавливает способ оплаты и адрес

События:

`order:payment `— генерируется при выборе способа оплаты

`order:address `— генерируется при вводе адреса

`order:submit `— генерируется при отправке формы

Класс `Contacts `
Отвечает за форму ввода контактных данных.

Назначение: Второй шаг оформления заказа (email и телефон).

Поля класса:

`\_phoneElement: HTMLInputElement `— поле ввода телефона

`\_emailElement: HTMLInputElement `— поле ввода email

Сеттеры:

`set data(value: IContactsData) `— устанавливает телефон и email

События:

`contacts:phone `— генерируется при вводе телефона

`contacts:email `— генерируется при вводе email

`contacts:submit `— генерируется при отправке формы

Класс `Success `
Отвечает за отображение сообщения об успешном оформлении заказа.

Назначение: Подтверждение успешной оплаты с указанием списанной суммы.

Поля класса:

`\_totalElement: HTMLElement `— элемент с суммой списания

`\_closeButton: HTMLButtonElement `— кнопка закрытия

Сеттеры:

`set total(value: number) `— устанавливает сумму списания

События:

`success:close `— генерируется при клике на кнопку закрытия

Класс `Modal `
Отвечает за отображение модального окна.

Назначение: Управление открытием и закрытием модальных окон.

Поля класса:

`\_closeButton: HTMLButtonElement `— кнопка закрытия

`\_modalContent: HTMLElement `— контейнер для контента

Методы:

`open(content: HTMLElement): void `— открывает модальное окно с переданным контентом

`close(): void `— закрывает модальное окно

События приложения
Все события, используемые в приложении для взаимодействия между слоями:

Событие Источник Описание
`catalog:changed CatalogModel `Каталог товаров обновлён
`catalog:selected CatalogModel `Выбранный товар изменился
`card:selected CardCatalog `Пользователь выбрал карточку
`preview:submit CardPreview `Нажата кнопка в карточке товара
`basket:open Header `Открытие корзины
`basket:delete CardBasket `Удаление товара из корзины
`basket:changed BasketModel `Корзина изменилась
`basket:submit Basket `Оформление заказа
`order:payment Order `Выбран способ оплаты
`order:address Order `Введён адрес доставки
`order:submit Order `Переход к контактам
`contacts:phone Contacts `Введён телефон
`contacts:email Contacts `Введён email
`contacts:submit Contacts `Отправка заказа
`customer:changed BuyerModel `Данные покупателя изменились
`success:close Success `Закрытие окна успеха
Презентер (Presenter)
Презентер реализован в файле src/main.ts и содержит всю логику приложения. Он связывает модели данных и представления через обработку событий.

Ответственность презентера:

Инициализация — создание экземпляров всех компонентов (моделей, представлений, API)

Обработка событий — подписка на все события и выполнение соответствующих действий

Координация — связывание моделей и представлений, обновление данных и отображения

Основные сценарии:

Загрузка товаров:

Запрос к серверу через `AppApi.getProducts()`

Сохранение в `CatalogModel.setItems()`

Генерация события `catalog:changed`

Отрисовка галереи через `Gallery.catalog`

Открытие карточки товара:

Клик на карточку в каталоге > `card:selected`

Получение товара по ID через `CatalogModel.getItemById()`

Сохранение выбранного товара > `catalog:selected`

Создание `CardPreview` с данными товара и состоянием в корзине

Открытие модального окна с карточкой

Работа с корзиной:

Добавление/удаление товара через `preview:submit`

Обновление `BasketModel`

Генерация `basket:changed`

Обновление `счётчика в Header`

Обновление корзины

Оформление заказа:

Открытие корзины > `basket:open`

Переход к заказу > `basket:submit`

Заполнение формы заказа (Order)

Переход к контактам > `order:submit`

Заполнение формы контактов (Contacts)

Отправка заказа на сервер > `contacts:submit`

Получение ответа > показ `Success`

Очистка корзины и данных покупателя

Ключевые переменные:

events — экземпляр EventEmitter для всех событий

`catalogModel `— модель каталога

`basketModel `— модель корзины

`buyerModel `— модель покупателя

`appApi `— коммуникационный слой

Все компоненты представления (Header, Gallery, Modal, Basket, Order, Contacts, Success)
