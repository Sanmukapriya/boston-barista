import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import checkoutReducer from '../src/redux/slices/checkoutSlice';
import CheckoutForm from '../src/components/Checkout Form/CheckoutForm.jsx';

// Mock react-router hooks used by the component
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLocation: () => ({ search: '' }),
}));

// Mock emailjs
jest.mock('emailjs-com', () => ({
  __esModule: true,
  default: { send: jest.fn().mockResolvedValue({ status: 200 }) },
}));

// Simplify antd Select to native select for predictable behavior in tests
jest.mock('antd', () => {
  const actual = jest.requireActual('antd');
  const Select = ({ onChange, children, ...props }) => (
    <select onChange={(e) => onChange?.(e.target.value)} {...props}>
      {children}
    </select>
  );
  // Attach Option as a child wrapper producing <option>
  // eslint-disable-next-line react/display-name
  Select.Option = ({ value, children }) => <option value={value}>{children}</option>;
  return { ...actual, Select };
});

beforeEach(() => {
  // Mock fetch for Stripe session
  global.fetch = jest.fn().mockResolvedValue({
    json: async () => ({ url: 'https://stripe.test/session' }),
  });
});

afterEach(() => {
  jest.resetAllMocks();
});

function renderWithStore(ui, { preloadedState } = {}) {
  const store = configureStore({ reducer: { checkout: checkoutReducer }, preloadedState });
  return render(<Provider store={store}>{ui}</Provider>);
}

describe('CheckoutForm', () => {
  it('renders form fields and price calculated from quantity', () => {
    const preloadedState = {
      checkout: {
        productDetails: { name: 'beans', singlePrice: 10, quantity: 1, price: 10 },
        checkoutDetails: {},
      },
    };

    renderWithStore(<CheckoutForm />, { preloadedState });

    expect(screen.getByPlaceholderText('Product')).toHaveValue('Beans');
    expect(screen.getByPlaceholderText('Quantity')).toHaveValue('1');
    expect(screen.getByPlaceholderText('Price')).toHaveValue('$ 10.00');
  });

  it('updates price when quantity changes', () => {
    const preloadedState = {
      checkout: {
        productDetails: { name: 'beans', singlePrice: 5, quantity: 1, price: 5 },
        checkoutDetails: {},
      },
    };

    renderWithStore(<CheckoutForm />, { preloadedState });

    const quantityInput = screen.getByPlaceholderText('Quantity');
    fireEvent.change(quantityInput, { target: { value: '3' } });

    expect(screen.getByPlaceholderText('Price')).toHaveValue('$ 15.00');
  });

  it('submits form, sends email, and initiates Stripe session request', async () => {
    const preloadedState = {
      checkout: {
        productDetails: { name: 'beans', singlePrice: 7, quantity: 1, price: 7 },
        checkoutDetails: {},
      },
    };

    renderWithStore(<CheckoutForm />, { preloadedState });

    fireEvent.change(screen.getByPlaceholderText('Your Name'), { target: { value: 'Alice' } });
    fireEvent.change(screen.getByPlaceholderText('Email Address'), { target: { value: 'a@b.com' } });
    fireEvent.change(screen.getByPlaceholderText('Phone Number'), { target: { value: '1234567890' } });
    fireEvent.change(screen.getByPlaceholderText('Address'), { target: { value: '123 Street' } });

    // Set payment method using mocked native <select>
    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'UPI' } });

    fireEvent.click(screen.getByRole('button', { name: /Place Order/i }));

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        'http://localhost:5000/create-checkout-session',
        expect.objectContaining({ method: 'POST' })
      );
    });
  });
});
