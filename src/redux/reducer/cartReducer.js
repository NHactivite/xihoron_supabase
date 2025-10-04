import { getCharges } from "@/action";
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  loading: false,
  cartItems: [],
  subtotal: 0,
  total: 0,
  shippingCharges:0,
  shippingInfo: {
    address: "",
    pinCode: "",
    city: "",
    state: "",
    country: "",
  },
};
export const cartReducer = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      state.loading = true;
      const index = state.cartItems.findIndex(
        (i) => i.productId === action.payload.productId
      );
      if (index !== -1) {
        state.cartItems[index] = action.payload;
      } else {
        state.cartItems.push(action.payload);
      }
      state.loading = false;
    },
    removeCartItem: (state, action) => {
      (state.loading = true),
        (state.cartItems = state.cartItems.filter(
          (i) => i.productId != action.payload
        ));
      state.loading = false;
    },
   
    calculatePrice: (state,action) => {
      const subtotal = state.cartItems.reduce(
        (total, item) => total + item.price * item.quantity,
        0
      );

      state.subtotal = subtotal;
      console.log("chargingggg",action)
      
      state.shippingCharges =
        state.subtotal < action.payload.data.limit && state.subtotal > 0
          ? action.payload.data.charge
          : 0;
      // // state.tax=Math.round(state.subtotal * 0.05);
      // state.tax=Math.round(state.subtotal * 0);
      state.total = state.subtotal + state.shippingCharges;
      // state.total=price>=100?price:state.subtotal+state.shippingCharges;
    },

    discountApplied: (state, action) => {
      state.discount = action.payload;
    },
    saveShippingInfo: (state, action) => {
      state.shippingInfo = action.payload;
    },
    resetCart: () => initialState,
  },
});

export const {
  addToCart,
  removeCartItem,
  calculatePrice,
  discountApplied,
  saveShippingInfo,
  resetCart,
} = cartReducer.actions;
