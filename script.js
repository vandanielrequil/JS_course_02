const $catalog = document.querySelector('.catalog'),
    $cart = document.querySelector('.cart__box');

class Product {
    constructor(title, price, img, icon, singlePage) {
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
        return `<div class="catalog__cell">
        <div class="catalog__img"><img src="${this.img}" alt="item image">
            <div class="catalog__img_overlay">
                <button onclick="" class="addToCart">
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

class CatalogList {
    constructor(product, target) {
        this.product = product;
        this.target = target;
    }
    amount() {
        let x = 0;
        this.product.forEach(element => { x += element.price });
        return x;
    }
    render() {
        let prList = this.product.map(item => item.render()).join('');
        this.target.insertAdjacentHTML('afterbegin', prList);
    }
}


class ProductInCart extends Product {
    constructor(title, price, img, icon, singlePage, quantity = 1) {
        super(title, price, img, icon, singlePage);
        this.quantity = quantity;
    }
    getPrice() { return this.price * this.quantity; }
    remove() { };
    render() {
        return `
        <div class="cart__cell">
            <div class="cart__item">
                <a href="${this.singlePage}"><img src="${this.icon}" alt="Cart item 1"></a>
                <div class="cart__product">
                    <a href="${this.singlePage}">
                        <div class="cart__name">
                            Rebox Zane </div>
                    </a>
                    <a href="#">
                        <div class="cart__amount">
                            $${this.price}
                        </div>
                    </a>
                </div>
                <a href="#">
                    <div class="cart__cross">
                        <i class="fa fa-times-circle"></i>
                    </div>
                </a>
            </div>
        </div>`;
    }
}

class CartList extends CatalogList {
    clearSelf() { };
    render() {
        let prList = this.product.map(item => item.render()).join('');
        this.target.insertAdjacentHTML('afterbegin', prList);
    }
}



cartList = new CartList(
    [
        new ProductInCart('Business Suit', 152, '', 'img/Cart1.png'),
        new ProductInCart('aLEXA dress', 42, '', 'img/Cart2.png')
    ]
    , $cart);

console.log(cartList);

catalogList = new CatalogList(
    [
        new Product('Business Suit', 152, 'img/single_page/prod_asl_1.png'),
        new Product('aLEXA dress', 42, 'img/single_page/prod_asl_2.png'),
        new Product('Sylva trousers', 52, 'img/single_page/prod_asl_3.png'),
        new Product('Sylva sweater', 32, 'img/single_page/prod_asl_4.png')
    ]
    , $catalog);


catalogList.render();
cartList.render();

