import { cart } from "../../data/cart.js";

export function updateCartQuantity(HTMLElement) {
  let cartQuantity = 0;

  cart.forEach((cartItem) => {
    cartQuantity += cartItem.quantity;
  });

  document.querySelector(HTMLElement)
    .innerHTML = cartQuantity;
}