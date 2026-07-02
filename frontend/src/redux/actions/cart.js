// add to cart

export const addToCart = (data) => async (dispatch, getState) => {
  dispatch({
    type: "addToCart",
    payload: data,
  });
  localStorage.setItem("cartItems", JSON.stringify(getState().cart.cart));
  return data;
};

// remove from card
export const removeFromCart = (data) => async (dispatch, getState) => {
  dispatch({
    type: "removeFromCart",
    payload: data._id,
  });
  localStorage.setItem("cartItems", JSON.stringify(getState().cart.cart));
  return data;
};

// empty the cart (after a successful order)
export const clearCart = () => async (dispatch) => {
  dispatch({ type: "clearCart" });
  localStorage.setItem("cartItems", JSON.stringify([]));
};
