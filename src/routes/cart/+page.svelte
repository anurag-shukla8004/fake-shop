<script lang="ts">
  import { onMount } from "svelte";
  import Header from "../../components/Header.svelte";
  import Cart from "../../components/Cart.svelte";
  import { updateCartLength } from "../../stores/cartLengthStore";
  import toast, { Toaster } from "svelte-french-toast";

  let cart = [];
  let groupedCart = [];

  onMount(() => {
    if (typeof window !== "undefined") {
      loadCart();
    }
  });

  function loadCart() {
    if (typeof window !== "undefined") {
      cart = JSON.parse(localStorage.getItem("cart") || "[]");
      groupCartItems();
    }
  }

  function groupCartItems() {
    let grouped = {};
    cart.forEach((product) => {
      if (!grouped[product.id]) {
        grouped[product.id] = { ...product, quantity: 1 };
      } else {
        grouped[product.id].quantity += 1;
      }
    });
    groupedCart = Object.values(grouped);
  }

  function updateCart() {
    cart = [];
    groupedCart.forEach((product) => {
      for (let i = 0; i < product.quantity; i++) {
        cart.push(product);
      }
    });
    if (typeof window !== "undefined") {
      localStorage.setItem("cart", JSON.stringify(cart));
      loadCart();
      updateCartLength();
    }
  }

  function handleDecreaseQuantity(productId) {
    const product = groupedCart.find((p) => p.id === productId);
    if (product && product.quantity > 1) {
      product.quantity -= 1;
      updateCart();
    }
  }

  function handleIncreaseQuantity(productId) {
    const product = groupedCart.find((p) => p.id === productId);
    if (product) {
      product.quantity += 1;
      updateCart();
    }
  }

  function handleRemoveItem(productId) {
    groupedCart = groupedCart.filter((p) => p.id !== productId);
    updateCart();
    toast("Remove to cart", {
      icon: "💥",
    });
  }
</script>

<main class="bg-gray-100 min-h-screen">
  <Toaster/>
  <Header />
  <div class="max-w-2xl mx-auto p-5 bg-white p-8 rounded-lg shadow-md">
    <h1 class="text-3xl font-bold mb-4 text-gray-800">Your Cart</h1>
    {#if groupedCart.length === 0}
      <p class="text-lg text-gray-600">Your cart is empty.</p>
    {:else}
      {#each groupedCart as product (product.id)}
        <Cart
          {product}
          on:decreaseQuantity={() => handleDecreaseQuantity(product.id)}
          on:increaseQuantity={() => handleIncreaseQuantity(product.id)}
          on:removeItem={() => handleRemoveItem(product.id)}
        />
      {/each}
    {/if}
  </div>
</main>
