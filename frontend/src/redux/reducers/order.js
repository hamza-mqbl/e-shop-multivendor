import { createReducer } from "@reduxjs/toolkit";
// import { stat } from "fs";
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
    })
    // get all order of a shop
    .addCase("getAllOrderShopRequest", (state) => {
        state.isLoading = true;
      })
      .addCase("getAllOrderShopSuccess", (state, action) => {
        state.isLoading = false;
        state.orders = action.payload;
        state.success = true;
      })
      .addCase("getAllOrderShopFail", (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.success = false;
      })
    .addCase("clearErrors",(state)=>{
        state.error=null
    })
});
