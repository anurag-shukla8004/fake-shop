import { writable } from 'svelte/store';

const isBrowser = typeof window !== 'undefined';

const storedCart = isBrowser ? JSON.parse(localStorage.getItem('cart') || '[]') : [];
export const cartStore = writable(storedCart);

if (isBrowser) {
  cartStore.subscribe((value) => {
    localStorage.setItem('cart', JSON.stringify(value));
  });
}

export function addToCart(product: { id: number; }) {
  cartStore.update(cart => {
    const existingProduct = cart.find((item: { id: number; }) => item?.id === product?.id);
    if (existingProduct) { 
      existingProduct.quantity += 1;
    } else {
      cart.push({ ...product, quantity: 1 });
    }
    return cart;
  });
}

export function removeFromCart(productId: number) {
  cartStore.update(cart => cart.filter((item: { id: number; }) => item?.id !== productId));
}

export function updateQuantity(productId: number, quantity: number) {
  cartStore.update(cart => {
    const product = cart.find((item: { id: number; }) => item?.id === productId);
    if (product) {
      product.quantity = quantity;
    }
    return cart;
  });
}
