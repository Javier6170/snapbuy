// src/features/checkout/CheckoutFlow.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import CheckoutFlow from './CheckoutFlow';
import * as redux from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setCheckoutStep } from './checkoutSlice';
import { clearCart } from '../cart/cartSlice';

// Mock child components
jest.mock('../../components/Stepper', () => () => <div data-testid="stepper">Stepper</div>);
jest.mock('../products/ProductDetailModal', () => ({ product, onClose }: any) => (
  <div data-testid="detail-modal">
    Detail: {product.id}
    <button onClick={onClose}>Close</button>
  </div>
));
jest.mock('../cart/CartSummary', () => ({ onNext }: any) => (
  <div data-testid="cart-summary">
    <button onClick={() => onNext()}>Next</button>
  </div>
));
jest.mock('../customer/DeliveryForm', () => ({ onBack, onNext }: any) => (
  <div data-testid="delivery-form">
    <button onClick={() => onBack()}>Back</button>
    <button onClick={() => onNext()}>Next to Pay</button>
  </div>
));
jest.mock('../../components/PaymentModal', () => ({ onBack, onNext }: any) => (
  <div data-testid="payment-modal">
    <button onClick={() => onBack()}>Back to Delivery</button>
    <button onClick={() => onNext()}>Show Result</button>
  </div>
));
jest.mock('../transaction/TransactionResult', () => ({ onRestart }: any) => (
  <div data-testid="transaction-result">
    <button onClick={() => onRestart()}>Restart</button>
  </div>
));

describe('CheckoutFlow', () => {
  const mockDispatch = jest.fn();
  const mockNavigate = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (redux.useDispatch as any) = jest.fn(() => mockDispatch);
    (useNavigate as any) = jest.fn(() => mockNavigate);
  });

  function mockState(state: any) {
    (redux.useSelector as any) = jest.fn(selector => selector(state));
  }

  it('returns null when cart is empty', () => {
    mockState({ checkout: { step: 1 }, cart: { items: [] }, products: { items: [] } });
    const { container } = render(<CheckoutFlow />);
    expect(container).toBeEmptyDOMElement();
  });

  it('renders step 1 layout and opens detail modal', () => {
    const product = { id: 'p1', price: 100, imageUrl: 'url', name: 'Prod1' };
    mockState({
      checkout: { step: 1 },
      cart: { items: [{ productId: 'p1', quantity: 1 }] },
      products: { items: [product] },
    });
    render(<CheckoutFlow />);

    expect(screen.getByTestId('stepper')).toBeInTheDocument();
    expect(screen.getByRole('img', { name: 'Prod1' })).toBeInTheDocument();
    // open detail
    fireEvent.click(screen.getByRole('img', { name: 'Prod1' }));
    expect(screen.getByTestId('detail-modal')).toHaveTextContent('Detail: p1');
    // close detail
    fireEvent.click(screen.getByText('Close'));
    expect(screen.queryByTestId('detail-modal')).toBeNull();
    // mobile summary next
    fireEvent.click(screen.getByText('Next'));
    expect(mockDispatch).toHaveBeenCalledWith(setCheckoutStep(2));
  });

  it('navigates away if cart becomes empty and step>1', () => {
    // initial non-empty to mount effect
    mockState({
      checkout: { step: 3 },
      cart: { items: [{ productId: 'p1', quantity: 1 }] },
      products: { items: [{ id: 'p1', price: 50, imageUrl: '', name: 'P' }] },
    });
    const { rerender } = render(<CheckoutFlow />);
    // now cart empty & step>1 triggers useEffect
    mockState({
      checkout: { step: 3 },
      cart: { items: [] },
      products: { items: [] },
    });
    rerender(<CheckoutFlow />);
    expect(mockDispatch).toHaveBeenCalledWith(setCheckoutStep(1));
    expect(mockNavigate).toHaveBeenCalledWith('/', { replace: true });
  });

  it('steps through delivery, payment and result', () => {
    const product = { id: 'p1', price: 100, imageUrl: '', name: 'Prod1' };
    // Step 2: DeliveryForm
    mockState({
      checkout: { step: 2 },
      cart: { items: [{ productId: 'p1', quantity: 1 }] },
      products: { items: [product] },
    });
    render(<CheckoutFlow />);
    // eslint-disable-next-line testing-library/no-node-access
    fireEvent.click(screen.getByTestId('delivery-form').querySelector('button')!); // Back
    expect(mockDispatch).toHaveBeenCalledWith(setCheckoutStep(1));
    fireEvent.click(screen.getByText('Next to Pay'));
    expect(mockDispatch).toHaveBeenCalledWith(setCheckoutStep(3));

    // Step 3: PaymentModal
    mockState({
      checkout: { step: 3 },
      cart: { items: [{ productId: 'p1', quantity: 1 }] },
      products: { items: [product] },
    });
    render(<CheckoutFlow />);
    fireEvent.click(screen.getByText('Back to Delivery'));
    expect(mockDispatch).toHaveBeenCalledWith(setCheckoutStep(2));
    fireEvent.click(screen.getByText('Show Result'));
    expect(mockDispatch).toHaveBeenCalledWith(setCheckoutStep(4));

    // Step 4: TransactionResult
    mockState({
      checkout: { step: 4 },
      cart: { items: [{ productId: 'p1', quantity: 1 }] },
      products: { items: [product] },
    });
    render(<CheckoutFlow />);
    fireEvent.click(screen.getByText('Restart'));
    expect(mockDispatch).toHaveBeenCalledWith(clearCart());
    expect(mockDispatch).toHaveBeenCalledWith(setCheckoutStep(1));
    expect(mockNavigate).toHaveBeenCalledWith('/', { replace: true });
  });
});
