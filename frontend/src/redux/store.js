import { configureStore } from "@reduxjs/toolkit";
import { userReducer } from "./reducers/user";
import { SellerReducer } from "./reducers/seller";
import { productReducer } from "./reducers/product";
import { eventReducer } from "./reducers/event";
import { cartReducer } from "./reducers/cart";
import { wishlistReducer } from "./reducers/whislist";
import { orderReducer } from "./reducers/order";
const Store = configureStore({
  reducer: {
    user: userReducer,
    seller: SellerReducer,
    products: productReducer,
    events: eventReducer,
    cart: cartReducer,
    // wishlist: wishlistReducer,
    wishlist: wishlistReducer,
    order: orderReducer,
  },
});

export default Store;
