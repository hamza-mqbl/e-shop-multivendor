import { createReducer } from "@reduxjs/toolkit";
const initialState = {
  isLoading: true,
  event: null,
  events: [],
  success: null,
  error: null,
};

export const eventReducer = createReducer(initialState, (builder) => {
  builder
    .addCase("eventCreateRequest", (state) => {
      state.isLoading = true;
    })
    .addCase("eventCreateSuccess", (state, action) => {
      state.isLoading = false;
      state.event = action.payload;
      state.success = true;
    })
    .addCase("eventCreateFail", (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
      state.success = false;
    })
    // get all event
    .addCase("getAlleventsShopRequest", (state) => {
      state.isLoading = true;
    })
    .addCase("getAlleventsShopSuccess", (state, action) => {
      state.isLoading = false;
      state.events = action.payload;
      state.success = true;
    })
    .addCase("getAlleventsShopFail", (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
      state.success = false;
    })
    // delte event of a shop
    .addCase("deleteeventRequest", (state) => {
      state.isLoading = true;
    })
    .addCase("deleteeventSuccess", (state, action) => {
      state.isLoading = false;
      state.message = action.payload;
      state.success = true;
    })
    .addCase("deleteeventFail", (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
      state.success = false;
    })

    // get all event
    .addCase("getAllEventRequest", (state) => {
      state.isLoading = true;
    })
    .addCase("getAllEventSuccess", (state, action) => {
      state.isLoading = false;
      state.allEvents = action.payload;
      state.success = true;
    })
    .addCase("getAllEventFailed", (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
      state.success = false;
    })

    .addCase("clearErrors", (state) => {
      state.error = null;
    });
});
