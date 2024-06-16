<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import { updateCartLength } from "../stores/cartLengthStore";
  import toast, { Toaster } from 'svelte-french-toast';

  export let product: {
    id: number;
    title: string;
    price: number;
    description: string;
    category: string;
    image: string; 
    rating: { rate: number; count: number };
  };

  let addingToCart = false;
  const dispatch = createEventDispatcher();

  function addToCart() {
    toast.success("Add to cart successfully");
    if (addingToCart) return; 
    addingToCart = true;
    let cart = JSON.parse(localStorage.getItem("cart") || "[]");

    const existingProductIndex = cart?.findIndex(
      (item: { id: number }) => item?.id === product?.id
    );

    if (existingProductIndex !== -1) {
      cart[existingProductIndex].quantity += 1;
    } else {
      cart.push({ ...product, quantity: 1 });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartLength();
    dispatch("addToCart", cart?.length);

    setTimeout(() => {
      addingToCart = false; 
    }, 1000);
  }
</script>

<main>
  <Toaster />
  <div class="max-w-sm rounded overflow-hidden shadow-lg bg-white my-2">
    <a href={`/products/${product?.id}`} class="text-blue-500 block mt-2">
      <img
        class="w-full h-64 object-contain transform hover:scale-110 transition-transform duration-300"
        src={product?.image}
        alt={product?.title}
      />
    </a>
    <div class="px-6 py-4">
      <div class="font-bold text-xl mb-2 line-clamp-1">{product?.title}</div>
      <p class="text-xl font-semibold text-red-700">${product?.price}</p>
      <p class="text-gray-700 text-base line-clamp-1">{product?.description}</p>
      <div class="flex justify-between items-center">
        <button
          on:click={addToCart}
          class="bg-blue-500 hover:bg-blue-600 focus:bg-blue-600 text-white p-2 rounded mt-2 transition-colors duration-300 ease-in-out"
        >
          {#if addingToCart}
            Done Adding
          {:else}
            Add to Cart
          {/if}</button
        >
        <a href={`/products/${product?.id}`} class="text-blue-500 block mt-2">
          <button
            class="bg-blue-500 hover:bg-blue-600 focus:bg-blue-600 text-white p-2 rounded mt-2 transition-colors duration-300 ease-in-out"
            >View details</button
          >
        </a>
      </div>
    </div>
  </div>
</main>