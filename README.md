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

Класс `typescript CardGeneral `
Базовый класс для всех карточек товара. Содержит общую логику для отображения названия и цены.

Назначение: Родительский класс для всех карточек (каталог, превью, корзина).

Поля класса:

`typescript \_titleElement: HTMLElement ` — элемент для отображения названия товара

`typescript \_priceElement: HTMLElement ` — элемент для отображения цены

Сеттеры:

`typescript set data(value: ICardGeneral) ` — устанавливает название и цену товара

Класс `typescript Form `
Базовый класс для всех форм. Содержит общую логику для отображения ошибок и управления кнопкой отправки.

Назначение: Родительский класс для форм заказа и контактов.

Поля класса:

`typescript \_errorElement: HTMLElement ` — элемент для отображения ошибок

`typescript \_handleButton: HTMLButtonElement ` — кнопка отправки формы

`typescript \_form: HTMLFormElement ` — DOM-элемент формы

Сеттеры:

`typescript set errors(errors: string[]) ` — отображает ошибки и блокирует/разблокирует кнопку

Компоненты представления

Класс `typescript Header `
Отвечает за отображение шапки сайта с корзиной и счётчиком товаров.

Назначение: Управление верхней панелью навигации.

Поля класса:

`typescript basketButton: HTMLButtonElement ` — кнопка открытия корзины

`typescript counterElement: HTMLElement ` — элемент для отображения количества товаров

Сеттеры:

`typescript set counter(value: number) ` — обновляет счётчик товаров в корзине

События:

`typescript basket:open ` — генерируется при клике на кнопку корзины

Класс `typescript Gallery `
Отвечает за отображение каталога товаров на главной странице.

Назначение: Контейнер для всех карточек товаров.

Поля класса:

`typescript catalogElement: HTMLElement ` — DOM-элемент для вставки карточек

Сеттеры:

`typescript set catalog(items: HTMLElement[]) ` — заменяет содержимое галереи на переданный массив карточек

Класс `typescript CardCatalog `
Отвечает за отображение карточки товара в каталоге.

Назначение: Представление товара в списке на главной странице.

Поля класса:

`typescript \_imageElement: HTMLImageElement ` — изображение товара

`typescript \_categoryElement: HTMLElement ` — категория товара

Сеттеры:

`typescript set data(value: ICardCatalog) ` — устанавливает все данные товара

События:

`typescript catalog:setSelectedItem ` — генерируется при клике на карточку

Класс `typescript CardPreview `
Отвечает за отображение детальной карточки товара в модальном окне.

Назначение: Показ полной информации о товаре с кнопкой добавления/удаления из корзины.

Поля класса:

`typescript \_imageElement: HTMLImageElement ` — изображение товара

`typescript \_categoryElement: HTMLElement ` — категория товара

`typescript \_descriptionElement: HTMLElement ` — описание товара

`typescript \_buttonElement: HTMLButtonElement ` — кнопка "Купить"/"Удалить из корзины"

`typescript \_id: string ` — идентификатор товара

Сеттеры:

`typescript set data(value: ICardPreview) ` — устанавливает все данные и управляет состоянием кнопки

События:

`typescript card:addToBasket ` — генерируется при клике на кнопку

Класс `typescript CardBasket `
Отвечает за отображение товара в корзине.

Назначение: Представление товара в списке корзины с возможностью удаления.

Поля класса:

`typescript \_idElement: HTMLElement ` — порядковый номер товара

\_deleteButton: HTMLButtonElement — кнопка удаления

Сеттеры:

`typescript set id(value: string) ` — устанавливает порядковый номер

События:

`typescript basket:delete ` — генерируется при клике на кнопку удаления

Класс `typescript Basket `
Отвечает за отображение корзины в модальном окне.

Назначение: Список выбранных товаров с общей стоимостью и кнопкой оформления.

Поля класса:

`typescript \_listElement: HTMLUListElement ` — список товаров

`typescript \_buttonElement: HTMLButtonElement ` — кнопка "Оформить"

`typescript \_totalPriceElement: HTMLElement ` — общая стоимость

Сеттеры:

`typescript set data(value: IBasket) ` — обновляет список, стоимость и состояние кнопки

События:

`typescript order:placeAnOrder ` — генерируется при клике на кнопку "Оформить"

Класс `typescript Order `
Отвечает за форму выбора способа оплаты и ввода адреса.

Назначение: Первый шаг оформления заказа.

Поля класса:

`typescript \_cardButton: HTMLButtonElement ` — кнопка выбора оплаты картой

`typescript \_cashButton: HTMLButtonElement ` — кнопка выбора оплаты наличными

`typescript \_addressInput: HTMLInputElement ` — поле ввода адреса

Сеттеры:

`typescript set data(value: IOrder) ` — устанавливает способ оплаты и адрес

События:

`typescript customer:change ` — генерируется при изменении способа оплаты или адреса

`typescript order:submit ` — генерируется при отправке формы

Класс `typescript Contacts `
Отвечает за форму ввода контактных данных.

Назначение: Второй шаг оформления заказа (email и телефон).

Поля класса:

`typescript \_phoneElement: HTMLInputElement ` — поле ввода телефона

`typescript \_emailElement: HTMLInputElement ` — поле ввода email

Сеттеры:

`typescript set data(value: IContactsData) ` — устанавливает телефон и email

События:

`typescript contacts:change ` — генерируется при изменении данных в полях

`typescript contacts:submit ` — генерируется при отправке формы

Класс `typescript Success `
Отвечает за отображение сообщения об успешном оформлении заказа.

Назначение: Подтверждение успешной оплаты с указанием списанной суммы.

Поля класса:

`typescript \_totalElement: HTMLElement ` — элемент с суммой списания

`typescript \_closeButton: HTMLButtonElement ` — кнопка закрытия

Сеттеры:

`typescript set total(value: number) ` — устанавливает сумму списания

События:

`typescript success:close ` — генерируется при клике на кнопку закрытия

Класс `typescript Modal `
Отвечает за отображение модального окна.

Назначение: Управление открытием и закрытием модальных окон.

Поля класса:

`typescript \_closeButton: HTMLButtonElement ` — кнопка закрытия

`typescript \_modalContent: HTMLElement ` — контейнер для контента

`typescript \_isOpen: boolean ` — флаг состояния окна

Методы:

`typescript open(content: HTMLElement): void ` — открывает модальное окно с переданным контентом

`typescript close(): void ` — закрывает модальное окно

`typescript isOpen(): boolean ` — возвращает текущее состояние окна

События:

`typescript modal:open ` — генерируется при открытии

`typescript modal:close ` — генерируется при закрытии

События приложения

Все события, используемые в приложении для взаимодействия между слоями:

<!--  -->

Презентер (Presenter)

Презентер реализован в файле src/main.ts и содержит всю логику приложения. Он связывает модели данных и представления через обработку событий.

Ответственность презентера

1. Инициализация — создание экземпляров всех компонентов (моделей, представлений, API)

2. Обработка событий — подписка на все события и выполнение соответствующих действий

3. Координация — связывание моделей и представлений, обновление данных и отображения

Основные сценарии

Загрузка товаров

1. Запрос к серверу через AppApi.getProducts()

2. Сохранение в CatalogModel.setItems()

3. Генерация события catalog:setItems

4. Отрисовка галереи через Gallery.catalog

Открытие карточки товара

1. Клик на карточку в каталоге > catalog:setSelectedItem

2. Получение товара по ID через CatalogModel.getItemById()

3. Сохранение выбранного товара > catalog:open

4. Создание CardPreview с данными товара и состоянием в корзине

5. Открытие модального окна с карточкой

Работа с корзиной

1. Добавление/удаление товара через card:addToBasket

2. Обновление BasketModel

3. Генерация basket:change

4. Обновление счётчика в Header

5. Обновление корзины в модалке (если она открыта)

Оформление заказа

1. Открытие корзины > basket:open

2. Переход к заказу > order:placeAnOrder

3. Заполнение формы заказа (Order)

4. Переход к контактам > order:submit

5. Заполнение формы контактов (Contacts)

6. Отправка заказа на сервер > contacts:submit

7. Получение ответа > показ Success

8. Очистка корзины и данных покупателя

Ключевые переменные

1. events — экземпляр EventEmitter для всех событий

2. catalogModel — модель каталога

3. basketModel — модель корзины

4. buyerModel — модель покупателя

5. appApi — коммуникационный слой

Все компоненты представления (Header, Gallery, Modal, Basket, Order, Contacts, Success)

```typescript
// Данные для заказа
export interface IOrderData {
  items: string[];
  payment: TPayment;
  email: string;
  phone: string;
  address: string;
  total: number;
}

// Ответ сервера после заказа
export interface IOrderResponse {
  id: string;
  total: number;
}

// Ответ сервера с товарами
export interface IProductsResponse {
  total: number;
  items: IProduct[];
}
```
