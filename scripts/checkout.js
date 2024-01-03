import {cart, removeFromCart, calculateCartQuantity, updateQuantity} from "../data/cart.js";
import {products} from "../data/products.js";
import {formatCurrency} from "./utils/money.js";

let cartSummaryHTML = '';

cart.forEach(cartItem => {
  const productId = cartItem.productId;

  let matchingProduct;

  products.forEach((product) => {
    if (product.id === productId) {
      matchingProduct = product; 
    }
  });

  cartSummaryHTML += 
  `
    <div class="cart-item-container js-cart-item-container-${matchingProduct.id}">
      <div class="delivery-date">
        Delivery date: Tuesday, June 21
      </div>

      <div class="cart-item-details-grid">
        <img class="product-image"
          src="${matchingProduct.image}">

        <div class="cart-item-details">
          <div class="product-name">
            ${matchingProduct.name}
          </div>
          <div class="product-price">
            $${formatCurrency(matchingProduct.priceCents)}
          </div>
          <div class="product-quantity">
            <span>
              Quantity: <span class="js-quantity-label-${matchingProduct.id} quantity-label" data-product-id="${matchingProduct.id}">${cartItem.quantity}</span>
            </span>
            <span class="js-update-quantity-link update-quantity-link link-primary" data-product-id="${matchingProduct.id}">
              Update
            </span>
            <input class="js-quantity-input-${matchingProduct.id} quantity-input">
            <span class="js-save-quantity-link save-quantity-link link-primary" data-product-id="${matchingProduct.id}">Save</span>
            <span class="js-delete-link delete-quantity-link link-primary" data-product-id="${matchingProduct.id}">
              Delete
            </span>
          </div>
        </div>

        <div class="delivery-options">
          <div class="delivery-options-title">
            Choose a delivery option:
          </div>
          <div class="delivery-option">
            <input type="radio" checked
              class="delivery-option-input"
              name="delivery-option-${matchingProduct.id}">
            <div>
              <div class="delivery-option-date">
                Tuesday, June 21
              </div>
              <div class="delivery-option-price">
                FREE Shipping
              </div>
            </div>
          </div>
          <div class="delivery-option">
            <input type="radio"
              class="delivery-option-input"
              name="delivery-option-${matchingProduct.id}">
            <div>
              <div class="delivery-option-date">
                Wednesday, June 15
              </div>
              <div class="delivery-option-price">
                $4.99 - Shipping
              </div>
            </div>
          </div>
          <div class="delivery-option">
            <input type="radio"
              class="delivery-option-input"
              name="delivery-option-${matchingProduct.id}">
            <div>
              <div class="delivery-option-date">
                Monday, June 13
              </div>
              <div class="delivery-option-price">
                $9.99 - Shipping
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
});

document.querySelector('.js-order-summary')
  .innerHTML = cartSummaryHTML;

document.querySelectorAll('.js-delete-link')
  .forEach(link => {
    link.addEventListener('click', () => {
      const productId = link.dataset.productId; // so somehow data-product-id is identified as dataset.productId, they automaticly convert it.
      removeFromCart(productId);

      const container = document.querySelector(
        `.js-cart-item-container-${productId}`
      );
      
      container.remove();

      calculateCartQuantity('.js-return-to-home-link');
      addCheckoutItemString();
    });
  });


calculateCartQuantity('.js-return-to-home-link');

function addCheckoutItemString() {
  let string = ' item';
  if (cart.length > 1) string = ' items';

  document.querySelector('.js-return-to-home-link')
    .innerHTML += string;
}

addCheckoutItemString();

let updateHTML = '';

document.querySelectorAll('.js-update-quantity-link')
  .forEach(updateLink => {
    updateLink.addEventListener('click', (() => {
      const productId = updateLink.dataset.productId;

      const container = document.querySelector(`.js-cart-item-container-${productId}`);

      container.classList.add('is-editing-quantity');
    }));
  });

document.querySelectorAll('.js-save-quantity-link')
  .forEach(saveLink => {
    saveLink.addEventListener('click', () => {
      const productId = saveLink.dataset.productId;
      const inputValue = document.querySelector(`.js-quantity-input-${productId}`).value;
      
      if (inputValue > 0 && inputValue < 1000) {
        const container = document.querySelector(`
          .js-cart-item-container-${productId}
        `);

        container.classList.remove('is-editing-quantity');

        updateQuantity(productId, inputValue);

        calculateCartQuantity('.js-return-to-home-link');
        addCheckoutItemString();

        updateQuantityLabel(productId);
      }
    });
  });

function updateQuantityLabel(productId) {
  const quantityLabelElement = document.querySelector(`
    .js-quantity-label-${productId}
  `);

  let matchingProduct;

  cart.forEach(cartItem => {
    if (cartItem.productId === productId) matchingProduct = cartItem;
  });

  quantityLabelElement.innerHTML = matchingProduct.quantity;
}