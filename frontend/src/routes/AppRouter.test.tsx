import React, { Suspense } from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import AppRouter from './AppRouter';

// Mocks para los componentes lazy y Header
jest.mock('../features/products/ProductList', () => () => <div>Mocked ProductList</div>);
jest.mock('../features/checkout/CheckoutFlow', () => () => <div>Mocked CheckoutFlow</div>);
jest.mock('../components/Header', () => () => <header>Mocked Header</header>);

describe('AppRouter', () => {
  const renderWithRoute = (route: string) =>
    render(
      <MemoryRouter initialEntries={[route]}>
        <Suspense fallback={<div>Loading...</div>}>
          <AppRouter />
        </Suspense>
      </MemoryRouter>
    );

  it('renders Header and ProductList at default route "/"', async () => {
    renderWithRoute('/');
    // Header
    expect(screen.getByText('Mocked Header')).toBeInTheDocument();
    // ProductList
    expect(await screen.findByText('Mocked ProductList')).toBeInTheDocument();
  });

  it('renders CheckoutFlow at route "/checkout"', async () => {
    renderWithRoute('/checkout');
    expect(screen.getByText('Mocked Header')).toBeInTheDocument();
    expect(await screen.findByText('Mocked CheckoutFlow')).toBeInTheDocument();
  });

  it('redirects unknown routes to "/" and shows ProductList', async () => {
    renderWithRoute('/some/unknown/path');
    expect(screen.getByText('Mocked Header')).toBeInTheDocument();
    expect(await screen.findByText('Mocked ProductList')).toBeInTheDocument();
  });
});
