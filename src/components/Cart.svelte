<script lang="ts">
  import { createEventDispatcher } from "svelte";

  export let product: {
    quantity: number;
    id: number;
    title: string;
    price: number;
    description: string;
    category: string;
    image: string; 
  };

  const dispatch = createEventDispatcher();

  function decreaseQuantity() {
    dispatch("decreaseQuantity", product.id);
  }

  function increaseQuantity() {
    dispatch("increaseQuantity", product.id);
  }

  function removeItem() {
    dispatch("removeItem", product.id);
  }
</script>

<main>
  <div
    class="flex justify-between items-center mb-2.5 p-2.5 border border-gray-300 shadow-md rounded-md hover:shadow-lg transition-shadow duration-300 ease-in-out"
  >
    <img
      class="w-12 h-12 object-cover"
      src={product.image}
      alt={product?.title}
    />
    <div class="flex-1 ml-5">
      <h2 class="font-bold">{product?.title}</h2>
      <p class="text-red-700 font-semibold">${product?.price}</p>
      <p class="font-semibold text-gray-500">Quantity: {product?.quantity}</p>
    </div>
    <div class="flex items-center space-x-2">
      <button
        class="bg-gray-200 p-2 rounded text-lg hover:bg-gray-300"
        on:click={decreaseQuantity}>-</button
      >
      <button
        class="bg-gray-200 p-2 rounded text-lg hover:bg-gray-300"
        on:click={increaseQuantity}>+</button
      >
      <button
        class="bg-red-500 text-white p-1 rounded hover:bg-red-600"
        on:click={removeItem}>Remove</button
      >
    </div>
  </div>
</main>
