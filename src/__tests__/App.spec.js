import { render, fireEvent, waitFor } from '@testing-library/svelte';
// import App from '../App.svelte';
// import fetchMock from 'jest-fetch-mock';

fetchMock.enableMocks();

beforeEach(() => {
  fetchMock.resetMocks();
});

test('displays loading spinner initially', () => {
  fetchMock.mockResponseOnce(JSON.stringify([]));
  const { getByText } = render(App);
  expect(getByText('Loading...')).toBeInTheDocument();
});

test('displays products after loading', async () => {
  const mockProducts = [
    { id: 1, title: 'Product 1', category: 'Category 1', price: 10, rating: { count: 1 } },
    { id: 2, title: 'Product 2', category: 'Category 2', price: 20, rating: { count: 2 } },
  ];
  
  fetchMock.mockResponseOnce(JSON.stringify(mockProducts));
  const { getByText } = render(App);

  await waitFor(() => expect(getByText('Product 1')).toBeInTheDocument());
  await waitFor(() => expect(getByText('Product 2')).toBeInTheDocument());
});

test('filters products based on search query', async () => {
  const mockProducts = [
    { id: 1, title: 'Product 1', category: 'Category 1', price: 10, rating: { count: 1 } },
    { id: 2, title: 'Product 2', category: 'Category 2', price: 20, rating: { count: 2 } },
  ];

  fetchMock.mockResponseOnce(JSON.stringify(mockProducts));
  const { getByText, getByPlaceholderText } = render(App);

  await waitFor(() => expect(getByText('Product 1')).toBeInTheDocument());
  await waitFor(() => expect(getByText('Product 2')).toBeInTheDocument());

  const searchInput = getByPlaceholderText('Search...');
  await fireEvent.input(searchInput, { target: { value: 'Product 1' } });

  await waitFor(() => expect(getByText('Product 1')).toBeInTheDocument());
  expect(getByText('Product 2')).not.toBeInTheDocument();
});

test('filters products based on category', async () => {
  const mockProducts = [
    { id: 1, title: 'Product 1', category: 'Category 1', price: 10, rating: { count: 1 } },
    { id: 2, title: 'Product 2', category: 'Category 2', price: 20, rating: { count: 2 } },
  ];

  fetchMock.mockResponseOnce(JSON.stringify(mockProducts));
  const { getByText, getByLabelText } = render(App);

  await waitFor(() => expect(getByText('Product 1')).toBeInTheDocument());
  await waitFor(() => expect(getByText('Product 2')).toBeInTheDocument());

  const categorySelect = getByLabelText('Category');
  await fireEvent.change(categorySelect, { target: { value: 'Category 1' } });

  await waitFor(() => expect(getByText('Product 1')).toBeInTheDocument());
  expect(getByText('Product 2')).not.toBeInTheDocument();
});

test('displays no products found message when no products match the filters', async () => {
  const mockProducts = [
    { id: 1, title: 'Product 1', category: 'Category 1', price: 10, rating: { count: 1 } },
    { id: 2, title: 'Product 2', category: 'Category 2', price: 20, rating: { count: 2 } },
  ];

  fetchMock.mockResponseOnce(JSON.stringify(mockProducts));
  const { getByText, getByPlaceholderText } = render(App);

  await waitFor(() => expect(getByText('Product 1')).toBeInTheDocument());
  await waitFor(() => expect(getByText('Product 2')).toBeInTheDocument());

  const searchInput = getByPlaceholderText('Search...');
  await fireEvent.input(searchInput, { target: { value: 'Non-existent product' } });

  await waitFor(() => expect(getByText('No products found.')).toBeInTheDocument());
});
