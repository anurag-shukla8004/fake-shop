<script lang="ts">
  console.log("hell");
  import { onMount } from "svelte";
  import { page } from "$app/stores";
  import Header from "../../../components/Header.svelte";
  import { createEventDispatcher } from "svelte";
  import { updateCartLength } from "../../../stores/cartLengthStore";
  import toast, { Toaster } from 'svelte-french-toast';

  let product: {
    id: number;
    image: string;
    title: string;
    price: number;
    description: string;
    rating: { rate: number; count: number };
  };
  let loading = true;
  $: id = $page.params.productId;
  let addingToCart = false;
  const dispatch = createEventDispatcher();


  onMount(async () => {
    try {
      if (id) {
        const response = await fetch(`https://fakestoreapi.com/products/${id}`);
        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }
        product = await response.json();
      }
    } catch (error: any) {
      toast.error(`Failed to load product: ${error.message}`);
    } finally {
      loading = false;
    }
  });

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

  function generateStars(rate: number) {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push({
        starClass: i < rate ? "text-yellow-500" : "text-gray-300",
        symbol: i < rate ? "★" : "☆"
      });
    }
    return stars;
  }
</script>

<main>
  <Toaster />
  {#if loading}
    <div class="flex justify-center items-center mt-10">
      <div class="spinner"></div>
      <p class="ml-3 text-xl text-gray-600">Loading...</p>
    </div>
  {:else}
    <Header />
    <div class="max-w-lg mx-auto bg-white p-6 rounded-lg shadow-lg fade-in">
      <div class="h-64 overflow-hidden rounded-lg mb-6">
        <img
          class="w-full h-full object-contain"
          src={product.image}
          alt={product.title}
        />
      </div>
      <div class="px-6 py-4">
        <div class="font-bold text-3xl mb-4 text-gray-900">{product.title}</div>
        <p class="text-gray-700 text-xl mb-4">${product.price}</p>
        <p class="text-gray-600 text-base leading-relaxed">
          {product.description}
        </p>
        <div class="flex items-center mt-2">
          {#each generateStars(product.rating.rate) as { starClass, symbol }}
            <span class={starClass}>{symbol}</span>
          {/each}
          <span class="text-gray-500 ml-2">{product.rating.count} reviews</span>
        </div>
      </div>
      <button
        on:click={addToCart}
        class="w-full bg-blue-500 hover:bg-blue-600 focus:bg-blue-600 text-white p-2 rounded mt-2 transition-colors duration-300 ease-in-out"
      >
        {#if addingToCart}
          Done Adding
        {:else}
          Add to Cart
        {/if}</button
      >
    </div>
  {/if}
</main>

<style>
  .fade-in {
    animation: fadeIn 0.5s ease-in-out;
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  .spinner {
    border: 4px solid rgba(0, 0, 0, 0.1);
    width: 36px;
    height: 36px;
    border-radius: 50%;
    border-left-color: #09f;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
</style>
