// src/__tests__/App.spec.js
import '@testing-library/jest-dom';
import { render, fireEvent } from '@testing-library/svelte';
import Header from '../components/Header.svelte';
import Cart from '../components/Cart.svelte';
import ProductCart from '../components/ProductCart.svelte';
import { cartLength } from '../stores/cartLengthStore';
import { writable } from 'svelte/store';
import { updateCartLength } from '../stores/cartLengthStore';
import toast from 'svelte-french-toast';

// Mock the stores
jest.mock('../stores/cartLengthStore', () => {
  return {
    cartLength: writable(0),
    updateCartLength: jest.fn()
  };
});

// Mock the toast
jest.mock('svelte-french-toast', () => ({
  __esModule: true,
  default: {
    success: jest.fn()
  }
}));

describe('Header Component', () => {
  beforeEach(() => {
    // Reset the cartLength store before each test
    cartLength.set(0);
  });

  test('renders header and navigation links', () => {
    const { getByText, getByPlaceholderText } = render(Header);

    // Check for header text
    expect(getByText('Fake-Shop')).toBeInTheDocument();

    // Check for navigation links
    expect(getByText(/Home/i)).toBeInTheDocument();
    expect(getByText(/Cart \(0\)/i)).toBeInTheDocument();

    // Check for search input placeholder
    expect(getByPlaceholderText('Search')).toBeInTheDocument();
  });

  test('updates search input and triggers search event', async () => {
    const { getByPlaceholderText, component } = render(Header);
    const searchInput = getByPlaceholderText('Search');

    // Listen for the custom search event
    const searchHandler = jest.fn();
    component.$on('search', searchHandler);

    // Simulate user typing in the search input
    await fireEvent.input(searchInput, { target: { value: 'test query' } });

    // Check if search input value is updated
    expect(searchInput.value).toBe('test query');

    // Wait for the debounce timeout and check if search event is fired
    setTimeout(() => {
      expect(searchHandler).toHaveBeenCalledWith(expect.anything());
    }, 500);
  });

  test('updates category filter and triggers filter event', async () => {
    const { getByDisplayValue, component } = render(Header);
    const categorySelect = getByDisplayValue('All');

    // Listen for the custom filter event
    const filterHandler = jest.fn();
    component.$on('filter', filterHandler);

    // Simulate user changing the category filter
    await fireEvent.change(categorySelect, { target: { value: "men's clothing" } });

    // Check if selected category value is updated
    expect(categorySelect.value).toBe("men's clothing");

    // Check if filter event is fired
    expect(filterHandler).toHaveBeenCalledWith(expect.anything());
  });

  test('updates price range filter and triggers filterByPrice event', async () => {
    const { getByDisplayValue, component } = render(Header);
    const priceRangeSelect = getByDisplayValue('All');

    // Listen for the custom filterByPrice event
    const filterByPriceHandler = jest.fn();
    component.$on('filterByPrice', filterByPriceHandler);

    // Simulate user changing the price range filter
    await fireEvent.change(priceRangeSelect, { target: { value: '$20 - $50' } });

    // Check if selected price range value is updated
    expect(priceRangeSelect.value).toBe('$20 - $50');

    // Check if filterByPrice event is fired
    expect(filterByPriceHandler).toHaveBeenCalledWith(expect.anything());
  });

  test('updates sort option and triggers sortBy event', async () => {
    const { getByDisplayValue, component } = render(Header);
    const sortBySelect = getByDisplayValue('Price');

    // Listen for the custom sortBy event
    const sortByHandler = jest.fn();
    component.$on('sortBy', sortByHandler);

    // Simulate user changing the sort option
    await fireEvent.change(sortBySelect, { target: { value: 'Popularity' } });

    // Check if selected sort option value is updated
    expect(sortBySelect.value).toBe('Popularity');

    // Check if sortBy event is fired
    expect(sortByHandler).toHaveBeenCalledWith(expect.anything());
  });
});

describe('Cart Component', () => {
  const product = {
    quantity: 1,
    id: 1,
    title: 'Test Product',
    price: 9.99,
    description: 'This is a test product',
    category: 'Test Category',
    image: 'test.jpg'
  };

  test('renders product details correctly', () => {
    const { getByText, getByAltText } = render(Cart, { props: { product } });

    expect(getByText(product.title)).toBeInTheDocument();
    expect(getByText(`$${product.price}`)).toBeInTheDocument();
    expect(getByText(`Quantity: ${product.quantity}`)).toBeInTheDocument();
    expect(getByAltText(product.title)).toBeInTheDocument();
  });

  test('decreases quantity when decrease button is clicked', async () => {
    const { getByText, component } = render(Cart, { props: { product } });
    const decreaseButton = getByText('-');

    const decreaseHandler = jest.fn();
    component.$on('decreaseQuantity', decreaseHandler);

    await fireEvent.click(decreaseButton);
    expect(decreaseHandler).toHaveBeenCalledWith(expect.anything());
  });

  test('increases quantity when increase button is clicked', async () => {
    const { getByText, component } = render(Cart, { props: { product } });
    const increaseButton = getByText('+');

    const increaseHandler = jest.fn();
    component.$on('increaseQuantity', increaseHandler);

    await fireEvent.click(increaseButton);
    expect(increaseHandler).toHaveBeenCalledWith(expect.anything());
  });

  test('removes item when remove button is clicked', async () => {
    const { getByText, component } = render(Cart, { props: { product } });
    const removeButton = getByText('Remove');

    const removeHandler = jest.fn();
    component.$on('removeItem', removeHandler);

    await fireEvent.click(removeButton);
    expect(removeHandler).toHaveBeenCalledWith(expect.anything());
  });
});

describe('ProductCart Component', () => {
  const product = {
    id: 1,
    title: 'Test Product',
    price: 9.99,
    description: 'This is a test product',
    category: 'Test Category',
    image: 'test.jpg',
    rating: { rate: 4.5, count: 10 }
  };

  test('renders product details correctly', () => {
    const { getByText, getByAltText } = render(ProductCart, { props: { product } });

    expect(getByText(product.title)).toBeInTheDocument();
    expect(getByText(`$${product.price}`)).toBeInTheDocument();
    expect(getByText(product.description)).toBeInTheDocument();
    expect(getByAltText(product.title)).toBeInTheDocument();
  });

  test('adds product to cart when add to cart button is clicked', async () => {
    const { getByText, component } = render(ProductCart, { props: { product } });
    const addToCartButton = getByText('Add to Cart');

    const addToCartHandler = jest.fn();
    component.$on('addToCart', addToCartHandler);

    await fireEvent.click(addToCartButton);

    expect(toast.success).toHaveBeenCalledWith('Add to cart successfully');
    expect(updateCartLength).toHaveBeenCalled();
    expect(addToCartHandler).toHaveBeenCalledWith(expect.anything());
  });

  test('changes button text when adding to cart', async () => {
    const { getByText } = render(ProductCart, { props: { product } });
    const addToCartButton = getByText('Add to Cart');

    await fireEvent.click(addToCartButton);

    expect(getByText('Done Adding')).toBeInTheDocument();
  });
});
