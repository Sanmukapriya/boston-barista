import reducer, { setProductDetails, setQuantity, setModifiedPrice, setCheckoutDetails } from '../src/redux/slices/checkoutSlice';

describe('checkoutSlice reducers', () => {
  it('should return initial state when passed an empty action', () => {
    const state = reducer(undefined, { type: '@@INIT' });
    expect(state).toEqual({ productDetails: {}, checkoutDetails: {} });
  });

  it('should set product details', () => {
    const initial = { productDetails: {}, checkoutDetails: {} };
    const product = { name: 'beans', singlePrice: 5 };
    const state = reducer(initial, setProductDetails(product));
    expect(state.productDetails).toEqual(product);
  });

  it('should set quantity and update price when valid', () => {
    const initial = { productDetails: { singlePrice: 10 }, checkoutDetails: {} };
    const state = reducer(initial, setQuantity(3));
    expect(state.productDetails.quantity).toBe(3);
    expect(state.productDetails.price).toBe(30);
  });

  it('should set modified price based on quantity and singlePrice', () => {
    const initial = { productDetails: { singlePrice: 12 }, checkoutDetails: {} };
    const state = reducer(initial, setModifiedPrice(2));
    expect(state.productDetails.quantity).toBe(2);
    expect(state.productDetails.price).toBe(24);
  });

  it('should set checkout details', () => {
    const details = { customerName: 'Alice' };
    const state = reducer(undefined, setCheckoutDetails(details));
    expect(state.checkoutDetails).toEqual(details);
  });
});
