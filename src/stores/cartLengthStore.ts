import { writable } from 'svelte/store';

let initialCartLength = 0;
if (typeof window !== 'undefined') {
  const initialCart = JSON.parse(localStorage.getItem('cart') || '[]');
  initialCartLength = initialCart.length || 0;
}

export const cartLength = writable(initialCartLength);

export function updateCartLength() {
  if (typeof window !== 'undefined') {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const cartLengthValue = cart.length || 0;
    cartLength.set(cartLengthValue);
  }
}
