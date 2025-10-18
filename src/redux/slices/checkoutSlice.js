import { createSlice } from "@reduxjs/toolkit";

const checkoutSlice = createSlice({
  name: "checkout",
  initialState: {
    productDetails: {},      
    checkoutDetails: {},    
  },
  reducers: {
    setProductDetails: (state, action) => {
      state.productDetails = action.payload;
    },

    setQuantity: (state, action) => {
      const quantity = Number(action.payload);
      if (!isNaN(quantity) && quantity >= 1) {
        state.productDetails.quantity = quantity;
        state.productDetails.price = quantity * state.productDetails.singlePrice;
      }
    },

    setModifiedPrice: (state, action) => {
      const quantity = Number(action.payload);
      const singlePrice = state.productDetails.singlePrice;
      if (!isNaN(singlePrice) && quantity >= 1) {
        state.productDetails.price = quantity * singlePrice;
        state.productDetails.quantity = quantity;
      }
    },

    setCheckoutDetails: (state, action) => {
      state.checkoutDetails = action.payload;
      console.log("Checkout details set successfully ", state.checkoutDetails);
    },
  },
});

export const {
  setProductDetails,
  setModifiedPrice,
  setCheckoutStatus,
  setCheckoutDetails,
  setQuantity,
} = checkoutSlice.actions;

export default checkoutSlice.reducer;
