<script lang="ts">
	import { onMount } from "svelte";
	import ProductCard from "../components/ProductCard.svelte";
	import Header from "../components/Header.svelte";
	import { navigate } from "svelte-routing";
	import toast, { Toaster } from 'svelte-french-toast';
  
	let products: string | any[] = [];
	let allProducts: any[] = [];
	let searchQuery = "";
	let categoryFilter = "All";
	let priceRangeFilter = "All";
	let sortByOption = "Price";
	let currentPage = 1;
	let itemsPerPage = 10;
	let isLoading = true;
  
   
	onMount(async () => {
	  try {
		const response = await fetch("https://fakestoreapi.com/products");
		if (!response.ok) {
		  throw new Error(`Error: ${response.statusText}`);
		}
		allProducts = await response.json();
		filterProducts();
	  } catch (error: any) {
		toast.error(`Failed to load products: ${error.message}`);
	  } finally {
		isLoading = false;
	  }
	});
  
	function handleSearch(event: { detail: string }) {
	  searchQuery = event.detail;
	  currentPage = 1;
	  filterProducts();
	}
  
	function handleFilter(event: { detail: string }) {
	  categoryFilter = event.detail;
	  currentPage = 1;
	  filterProducts();
	}
  
	function handlePriceFilter(event: { detail: string }) {
	  priceRangeFilter = event.detail;
	  currentPage = 1;
	  filterProducts();
	}
  
	function handleSortBy(event: { detail: string }) {
	  sortByOption = event.detail;
	  currentPage = 1;
	  filterProducts();
	}
  
	function filterProducts() {
	  let filteredProducts = allProducts.filter(
		(product) =>
		  (categoryFilter === "All" || product.category === categoryFilter) &&
		  (priceRangeFilter === "All" ||
			(priceRangeFilter === "$0 - $20" && product.price <= 20) ||
			(priceRangeFilter === "$20 - $50" &&
			  product.price > 20 &&
			  product.price <= 50) ||
			(priceRangeFilter === "$50 - $100" &&
			  product.price > 50 &&
			  product.price <= 100) ||
			(priceRangeFilter === "$100+" && product.price > 100)) &&
		  (product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
			product.description.toLowerCase().includes(searchQuery.toLowerCase()))
	  );
  
	  filteredProducts.sort((a, b) => {
		if (sortByOption === "Price") {
		  return a.price - b.price;
		} else if (sortByOption === "Popularity") {
		  return b.rating.count - a.rating.count;
		}
		return a.price - b.price;
	  });
  
	  let startIndex = (currentPage - 1) * itemsPerPage;
	  let endIndex = startIndex + itemsPerPage;
	  products = filteredProducts.slice(startIndex, endIndex);
	}
  
	function goToProductDetails(productId: number) {
	  navigate(`/product/${productId}`);
	}
  
	function goToPage(page: number) {
	  currentPage = page;
	  filterProducts();
	}
  </script>
  
  <Header
	on:search={handleSearch}
	on:filter={handleFilter}
	on:filterByPrice={handlePriceFilter}
	on:sortBy={handleSortBy}
  />
  
  <!-- Loading Spinner -->
	{#if isLoading}
	  <div class="flex justify-center items-center h-screen">
		<div class="spinner"></div>
	  </div>
	{:else}
	<!-- Product listing -->
	{#if products.length > 0}
	  <div class="container mx-auto flex flex-wrap justify-center gap-8 bg-gray-100 p-4">
		{#each products as product}
		  <ProductCard
			{product}
			on:viewDetails={() => goToProductDetails(product.id)}
		  />
		{/each}
	  </div>
	{:else}
	  <div class="flex justify-center items-center h-screen">
		<p class="text-xl">No products found.</p>
	  </div>
	{/if}
  
	<!-- Pagination -->
	{#if products.length >= itemsPerPage}
	  <div class="pagination text-center my-4 bg-gray-300 p-4">
		Page
		{#each Array.from( { length: Math.ceil(allProducts.length / itemsPerPage) } ) as _, i}
		  <button
			class="px-3 py-1 mr-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
			on:click={() => goToPage(i + 1)}
		  >
			{i + 1}
		  </button>
		{/each}
	  </div>
	{/if}
  {/if}
  
  <style>
	.spinner {
	  border: 4px solid rgba(0, 0, 0, 0.1);
	  border-top: 4px solid #3498db;
	  border-radius: 50%;
	  width: 36px;
	  height: 36px;
	  animation: spin 1s linear infinite;
	}
  
	@keyframes spin {
	  0% {
		transform: rotate(0deg);
	  }
	  100% {
		transform: rotate(360deg);
	  }
	}
  </style>
  