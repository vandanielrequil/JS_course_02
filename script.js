const $catalog = document.querySelector('.catalog');
const products = [
    { title: 'Business Suit', price: '$152.00', img: 'img/single_page/prod_asl_1.png' },
    { title: 'aLEXA dress', price: '$42.00', img: 'img/single_page/prod_asl_2.png' },
    { title: 'Sylva sweater', price: '$52.00', img: 'img/single_page/prod_asl_3.png' },
    { title: 'Sylva sweater', price: '$32.00', img: 'img/single_page/prod_asl_4.png' }];

const renderProduct = ({ title, price, img }) => {
    return `<div class="catalog__cell">
            <div class="catalog__img"><img src="${img}" alt="item image">
                <div class="catalog__img_overlay">
                    <button onclick="" class="addToCart">
                        <div class="addToCart__img"><img src="img/cart_white.png" alt="Cart logo"></div>
                        <div class="addToCart__text">Add to Cart</div>
                    </button>
                </div>
            </div>
            <a href="single_page.html">
                <h4 class="catalog__name f_h4">${title}</h4>
            </a>
            <div class="f_h8 f_pink">${price}</div>
        </div>`;
};

const renderCatalog = (list = products) => {
    let catalog = list.map(item => renderProduct(item));
    $catalog.insertAdjacentHTML('beforeend', catalog.join(''));
};

renderCatalog();