// add to wishlist
export const addToWishList = (data) => async (dispatch, getState) => {
  dispatch({
    type: "addToWishlist",
    payload: data,
  });

  localStorage.setItem("wishlistItems", JSON.stringify(getState().wishlist.wishlist));
  return data;
};

// remove from wishlist
export const removeFromWishList = (data) => async (dispatch, getState) => {
  dispatch({
    type: "removeFromWishlist",
    payload: data._id,
  });
  localStorage.setItem("wishlistItems", JSON.stringify(getState().wishlist.wishlist));
  return data;
};
