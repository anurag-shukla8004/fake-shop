<script lang="ts">
  import { createEventDispatcher, onMount } from "svelte";
  import { cartLength } from "../stores/cartLengthStore";
  import { page } from "$app/stores";

  const dispatch = createEventDispatcher();
  let searchQuery = "";
  let categories = [
    "All",
    "men's clothing",
    "women's clothing",
    "jewelery",
    "electronics",
  ];
  let selectedCategory = "All";
  let priceRanges = ["All", "$0 - $20", "$20 - $50", "$50 - $100", "$100+"];
  let selectedPriceRange = "All";
  let sortByOptions = ["Price", "Popularity"];
  let selectedSortByOption = "Price";
  let cart = []; 
  let cartCount = 0;

  cartLength.subscribe((value) => {
    cartCount = value;
  });

  onMount(() => {
    loadCart();
  });

  function loadCart() {
    cart = JSON.parse(localStorage.getItem("cart") || "[]");
    console.log(cart);
  }

  function debounce(
    func: { (query: any): void; apply?: any },
    wait: number | undefined
  ) {
    let timeout: number | undefined;
    return function (...args: any) {
      const context = this;
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(context, args), wait);
    };
  }

  const debouncedSearch = debounce((query) => {
    searchQuery = query;
    dispatch("search", searchQuery);
  }, 500);

  function handleSearch(event: { target: { value: string } }) {
    const query = event.target.value;
    debouncedSearch(query);
  }

  function filterByCategory() {
    dispatch("filter", selectedCategory);
  }

  function filterByPriceRange() {
    dispatch("filterByPrice", selectedPriceRange);
  }

  function sortByOption() {
    dispatch("sortBy", selectedSortByOption);
  }
</script>

<header class="bg-gray-800 text-white p-4 flex justify-between items-center">
  <a href="/"><div class="text-2xl font-bold cursor-default">Fake-Shop</div></a>
  <nav>
    <ul class="flex space-x-4">
      <li>
        <a
          href="/"
          class="flex items-center hover:underline {$page?.url?.pathname === '/'
            ? 'underline'
            : ''}"
        >
          <i class="fas fa-home mr-1"></i> Home
        </a>
      </li>
      <li>
        <a
          href="/cart"
          class="flex items-center hover:underline {$page?.url?.pathname ===
          '/cart'
            ? 'underline'
            : ''}"
        >
          <i class="fas fa-shopping-cart mr-1"></i> Cart ({cartCount})
        </a>
      </li>
    </ul>
  </nav>
  <div>
    <input
      type="text"
      placeholder="Search"
      bind:value={searchQuery}
      on:input={handleSearch}
      class="px-4 py-1 rounded text-black w-72"
    />
  </div>
  <div>
    <select
      bind:value={selectedCategory}
      on:change={filterByCategory}
      class="p-2 mr-1 rounded text-black"
    >
      {#each categories as category}
        <option value={category}>{category}</option>
      {/each}
    </select>
    <select
      bind:value={selectedPriceRange}
      on:change={filterByPriceRange}
      class="p-2 mr-1 rounded text-black"
    >
      {#each priceRanges as range}
        <option value={range}>{range}</option>
      {/each}
    </select>
    <select
      bind:value={selectedSortByOption}
      on:change={sortByOption}
      class="p-2 mr-1 rounded text-black"
    >
      {#each sortByOptions as option}
        <option value={option}>{option}</option>
      {/each}
    </select>
  </div>
</header>
