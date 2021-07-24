const $catalogDOM = document.querySelector('.catalog'),
    $cartItemsDOM = document.querySelector('.cart__items'),
    $cartClearDOM = document.querySelector('.cart__clear'),
    $cartTotalDOM = document.querySelector('.cart__total_price'),
    $cartAmountDOM = document.querySelector('.cart__amount'),
    $searchFormDOM = document.querySelector('.search__form'),
    $searchInputDOM = document.querySelector('.search__input');


//Фетчу json католог товаров, на воходе получаю промис с массивом объектов продуктов  $productArray.then(r => console.log(r));
const $productArray = fetch('src/products.json').then(r => r.json()).then((r) => {
    for (i = 0; i < r.length; i++) {
        let row1 = r[i];
        ({ id, title, price, img, icon, singlePage } = row1);
        r[i] = new Product(id, title, price, img, icon, singlePage);
    }
    return r;
});

class Product {
    constructor(id, title, price, img, icon, singlePage) {
        this.id = id;
        this.title = title;
        this.price = price;
        this.img = img;
        this.icon = icon;
        this.singlePage = singlePage;
    }
    getPrice() {
        return this.price;
    }
    render() {
        return `<div class="catalog__cell" id='${this.id}_product'>
        <div class="catalog__img"><img src="${this.img}" alt="item image">
            <div class="catalog__img_overlay">
                <button id='${this.id}_productButton' value='${this.id}' class="addToCart">
                    <div class="addToCart__img"><img src="img/cart_white.png" alt="Cart logo"></div>
                    <div class="addToCart__text">Add to Cart</div>
                </button>
            </div>
        </div>
        <a href="single_page.html">
            <h4 class="catalog__name f_h4">${this.title}</h4>
        </a>
        <div class="f_h8 f_pink">$${this.price}.00</div>
       </div>`;
    }
}
class ProductInCart extends Product {
    constructor(productObj, elemClass = 'cart__cell', crossClass = 'cart__cross') {
        super();
        Object.assign(this, productObj);
        this.quantity = 1;
        this.elemClass = elemClass;
        this.crossClass = crossClass;
    }
    getPrice() { return this.price * this.quantity; }
    render() {
        return `
        <div class="${this.elemClass}" value='${this.id}'>
            <div class="cart__item">
                <img src="${this.icon}" alt="Cart item">
                <div class="cart__product">               
                    <div class="cart__name">Rebox Zane </div>
                    <div class="cart__purchase">${this.quantity} x $${this.price}.00</div>
                </div>
                <a href="#">
                    <button class="${this.crossClass}" value='${this.id}'>
                        <i class="fa fa-times-circle" ></i>
                    </button>
                </a>
            </div>
        </div>`;
    }
}
class CatalogList {
    constructor(product, target, cartList, filter = '.*') { //массив продуктов, место куда рендерить, массив корзины
        filter = new RegExp(filter, 'i');
        this.product = product.sort((f, s) => f.id - s.id).filter(e => filter.test(e.title));
        this.target = target;
        this.cartList = cartList;
    }
    total() {
        let x = 0;
        this.product.forEach(e => { x += e.price });
        return x;
    }
    clearSelf() {
        this.target.innerHTML = '';
        this.product.length = 0;
    };
    render() {
        let prList = this.product.map(item => item.render()).join('');
        this.target.insertAdjacentHTML('afterbegin', prList);
        document.addEventListener('click', e => this.addToCart(e));
    }
    addToCart(e) {
        if (e.target.className === 'addToCart' || (e.target.closest('button') && e.target.closest('button').className === 'addToCart')) { //Ищу класс кнопки
            let prId = e.target.closest('button').value; //айди самого продукта внутри привязанной кнопки
            let cartPrId = this.cartList.product.findIndex(i => i.id == prId); //ищу индекс в массиве корзины
            if (cartPrId == -1) { //проверяю, нет ли его в корзине
                this.cartList.product.push(new ProductInCart(this.product[prId - 1])); //добавляю в массив корзины новый объект ПродуктКорзины, 
                //использую prId-1 так как точно известно, что во входящем массиве id продуктов начинается с 1 и он сортирован
                this.cartList.render();
                cartPrId++; //теперь это первый эдемент, индекс ноль
            }
            else if (cartPrId >= 0) {
                this.cartList.product[cartPrId].quantity++; //Если он уже есть в корзине - увеличиваю его количество
                this.cartList.render();
            }
            this.cartList.renderTotal();
            this.cartList.renderAmount();
            return;
        }
    };
}
class CartList extends CatalogList {
    total() {
        let x = 0;
        this.product.forEach(e => { x += e.price * e.quantity });
        return x;
    }
    renderTotal() {
        $cartTotalDOM.innerHTML = `$${this.total()}.00`;
    }
    amount() {
        let x = 0;
        this.product.forEach(e => { x += e.quantity });
        return x;
    }
    renderAmount() {
        let x = this.amount();
        x == 0 ? $cartAmountDOM.innerHTML = '' : $cartAmountDOM.innerHTML = `&nbsp&nbsp${x}&nbsp&nbsp`;
    }
    clearSelf() {
        this.target.innerHTML = '';
        this.product.length = 0;
        this.renderTotal();
        this.renderAmount();
    };
    removeProduct(e) {
        let arrayInd = this.product.findIndex(i => i.id == e.target.closest('button').value); //нахожу индекс в массиве корзины удаляемого продукта
        e.target.closest(`.${this.product[0].elemClass}`).remove(); // нахожу родительский элемент и удаляю его через имя класса первого продукта в корзине 
        this.product.splice(arrayInd, 1); //удаляю из массива
        this.renderTotal();
        this.renderAmount();
    };
    render() {
        this.target.innerHTML = ''; //зачитска корзины
        let prList = this.product.map(item => item.render()).join(''); //рендер продуктов
        this.target.insertAdjacentHTML('afterbegin', prList); //рендер продуктов в корзину
        let cross = document.querySelectorAll(`.${this.product[0].crossClass}`);
        cross.forEach(i => i.addEventListener('click', e => { this.removeProduct(e) }));//листенер на кнопку удаления каждого продукта

    }

}
function executeSearch(e) {  //выполнение поиска товара
    e.preventDefault();
    let seReg = new RegExp($searchInputDOM.value);
    console.log(seReg);
    catalogList.then(r => r.clearSelf());
    catalogList = $productArray.then(r => { return r = new CatalogList(r, $catalogDOM, cartList, seReg) });
    catalogList.then(r => r.render());
}

//Создаю список корзины
let cartList = new CartList([], $cartItemsDOM);
//Создаю список католога и рендерю продукты
let catalogList = $productArray.then(r => { return r = new CatalogList(r, $catalogDOM, cartList) });
catalogList.then(r => r.render());
//добавляю событие на кнопку очищения корзины 
$cartClearDOM.onclick = function () { cartList.clearSelf() };
//Событие на кнопку поиска
$searchFormDOM.addEventListener('submit', e => executeSearch(e));

