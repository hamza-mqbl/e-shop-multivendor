import { createReducer } from "@reduxjs/toolkit";
const initialState = {
  isLoading: true,
};
export const orderReducer = createReducer(initialState, (builder) => {
  builder
    // get all product of a shop
    .addCase("getAllOrderUserRequest", (state) => {
      state.isLoading = true;
    })
    .addCase("getAllOrderUserSuccess", (state, action) => {
      state.isLoading = false;
      state.orders = action.payload;
      state.success = true;
    })
    .addCase("getAllOrderUserFail", (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
      state.success = false;
    });
});
