import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { HiPlus, HiOutlineMinus } from "react-icons/hi";
import { AiOutlineHeart, AiOutlineDelete } from "react-icons/ai";
import { IoBagHandleOutline } from "react-icons/io5";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import styles from "../styles/styles";
import { addToCart, removeFromCart } from "../redux/actions/cart";
import { addToWishList } from "../redux/actions/wishlist";

const FREE_SHIPPING_OVER = 5000;
const FLAT_SHIPPING = 200;

const CartPage = () => {
  const { cart } = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const [voucher, setVoucher] = useState("");

  const removeFromCartHandler = (data) => dispatch(removeFromCart(data));
  const quantityChangeHandler = (data) => dispatch(addToCart(data));
  const addToWishlistHandler = (data) => {
    dispatch(addToWishList(data));
    dispatch(removeFromCart(data));
    toast.success("Moved to wishlist");
  };
  const clearCart = () => cart.forEach((i) => dispatch(removeFromCart(i)));

  const subtotal = cart.reduce(
    (acc, item) => acc + item.qty * item.discountPrice,
    0
  );
  const shipping =
    subtotal === 0 || subtotal >= FREE_SHIPPING_OVER ? 0 : FLAT_SHIPPING;
  const total = subtotal + shipping;

  const applyVoucher = () => {
    if (!voucher.trim()) {
      toast.error("Enter a voucher code");
      return;
    }
    toast.success("You can apply your voucher at checkout.");
  };

  return (
    <div className="bg-bone min-h-screen">
      <Header />
      <div className={`${styles.section} py-8 800px:py-12`}>
        <h1 className="font-display text-[28px] font-semibold text-espresso mb-6">
          Your cart
        </h1>

        {cart.length === 0 ? (
          <div className="bg-white border border-sand rounded-2xl shadow-card py-20 flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-bone flex items-center justify-center mb-4">
              <IoBagHandleOutline size={30} className="text-clay" />
            </div>
            <p className="text-espresso font-display font-medium text-[18px]">
              Your cart is empty
            </p>
            <p className="text-clay text-[14px] mt-1 mb-6">
              Find your next favourite pair.
            </p>
            <Link to="/products">
              <span className="inline-flex items-center justify-center h-[48px] px-7 rounded-xl bg-espresso hover:bg-coffee text-bone font-display font-medium transition-colors">
                Shop the collection
              </span>
            </Link>
          </div>
        ) : (
          <div className="block lg:flex gap-6 items-start">
            {/* items */}
            <div className="flex-1 min-w-0">
              <div className="bg-white border border-sand rounded-2xl shadow-card overflow-hidden">
                <div className="flex items-center justify-between px-5 py-4 border-b border-sand">
                  <span className="font-display font-medium text-espresso">
                    {cart.length} {cart.length === 1 ? "item" : "items"}
                  </span>
                  <button
                    type="button"
                    onClick={clearCart}
                    className="text-[13px] text-clay hover:text-brick transition-colors"
                  >
                    Clear cart
                  </button>
                </div>
                {cart.map((item, index) => (
                  <CartRow
                    key={index}
                    data={item}
                    quantityChangeHandler={quantityChangeHandler}
                    removeFromCartHandler={removeFromCartHandler}
                    addToWishlistHandler={addToWishlistHandler}
                  />
                ))}
              </div>
              <Link
                to="/products"
                className="inline-block mt-4 text-[14px] text-marigold-dark hover:text-espresso transition-colors"
              >
                ← Continue shopping
              </Link>
            </div>

            {/* summary */}
            <div className="w-full lg:w-[360px] shrink-0 mt-6 lg:mt-0">
              <div className="bg-white border border-sand rounded-2xl shadow-card p-5">
                <h2 className="font-display text-[18px] font-semibold text-espresso mb-4">
                  Order summary
                </h2>
                <div className="flex justify-between py-1.5 text-[14px]">
                  <span className="text-clay">
                    Subtotal ({cart.length}{" "}
                    {cart.length === 1 ? "item" : "items"})
                  </span>
                  <span className="font-mono text-espresso">Rs {subtotal}</span>
                </div>
                <div className="flex justify-between py-1.5 text-[14px]">
                  <span className="text-clay">Shipping</span>
                  <span className="font-mono text-espresso">
                    {shipping === 0 ? "Free" : `Rs ${shipping}`}
                  </span>
                </div>
                {shipping > 0 && (
                  <p className="text-[12px] text-marigold-dark mt-1">
                    Add Rs {FREE_SHIPPING_OVER - subtotal} more for free delivery.
                  </p>
                )}

                <hr className="seam my-4" />

                <div className="flex gap-2 mb-4">
                  <input
                    type="text"
                    value={voucher}
                    onChange={(e) => setVoucher(e.target.value)}
                    placeholder="Voucher code"
                    className="flex-1 min-w-0 h-[44px] px-3 bg-bone border border-sand focus:border-marigold rounded-lg transition-colors"
                  />
                  <button
                    type="button"
                    onClick={applyVoucher}
                    className="px-4 h-[44px] rounded-lg border border-espresso text-espresso hover:bg-espresso hover:text-bone transition-colors text-[14px] shrink-0"
                  >
                    Apply
                  </button>
                </div>

                <div className="flex justify-between items-baseline mb-5">
                  <span className="font-medium text-espresso">Total</span>
                  <span className="font-mono font-semibold text-[22px] text-espresso">
                    Rs {total}
                  </span>
                </div>

                <Link to="/checkout">
                  <button className="w-full h-[52px] bg-marigold hover:bg-marigold-dark text-espresso font-display font-medium rounded-xl transition-colors">
                    Proceed to checkout
                  </button>
                </Link>
                <div className="flex flex-wrap gap-x-4 gap-y-1 justify-center mt-4 text-[12px] text-clay">
                  <span>Cash on delivery</span>
                  <span>·</span>
                  <span>7-day exchange</span>
                  <span>·</span>
                  <span>Secure checkout</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

const CartRow = ({
  data,
  quantityChangeHandler,
  removeFromCartHandler,
  addToWishlistHandler,
}) => {
  const [value, setValue] = useState(data.qty);
  const lineTotal = data.discountPrice * value;

  const increment = () => {
    if (value >= data.stock) {
      toast.error("Reached available stock");
      return;
    }
    const next = value + 1;
    setValue(next);
    quantityChangeHandler({ ...data, qty: next });
  };
  const decrement = () => {
    const next = value === 1 ? 1 : value - 1;
    setValue(next);
    quantityChangeHandler({ ...data, qty: next });
  };

  return (
    <div className="flex gap-4 p-4 800px:p-5 border-b border-sand last:border-0">
      <Link to={`/product/${data._id}`} className="shrink-0">
        <img
          src={data.images && data.images[0]?.url}
          alt={data.name}
          className="w-[84px] h-[84px] 800px:w-[96px] 800px:h-[96px] rounded-lg object-cover bg-bone"
        />
      </Link>

      <div className="flex-1 min-w-0">
        <Link to={`/product/${data._id}`}>
          <h3 className="font-medium text-espresso leading-snug line-clamp-2">
            {data.name}
          </h3>
        </Link>
        {data.selectedSize && (
          <span className="inline-block mt-1 font-mono text-[11px] text-espresso bg-bone border border-sand rounded px-2 py-0.5">
            Size {data.selectedSize}
          </span>
        )}
        <div className="flex items-baseline gap-2 mt-1.5">
          <span className="font-mono font-semibold text-espresso">
            Rs {data.discountPrice}
          </span>
          {data.originalPrice ? (
            <span className="font-mono text-[12px] text-clay line-through">
              Rs {data.originalPrice}
            </span>
          ) : null}
        </div>
        <div className="flex items-center gap-4 mt-3 text-clay">
          <button
            type="button"
            onClick={() => addToWishlistHandler(data)}
            className="flex items-center gap-1 text-[13px] hover:text-marigold-dark transition-colors"
            title="Move to wishlist"
          >
            <AiOutlineHeart size={18} /> Save
          </button>
          <button
            type="button"
            onClick={() => removeFromCartHandler(data)}
            className="flex items-center gap-1 text-[13px] hover:text-brick transition-colors"
            title="Remove"
          >
            <AiOutlineDelete size={18} /> Remove
          </button>
        </div>
      </div>

      <div className="flex flex-col items-end justify-between shrink-0">
        <span className="font-mono font-semibold text-espresso">
          Rs {lineTotal}
        </span>
        <div className="flex items-center border border-sand rounded-lg overflow-hidden bg-white">
          <button
            type="button"
            onClick={decrement}
            className="w-8 h-9 flex items-center justify-center text-espresso hover:bg-bone transition-colors"
          >
            <HiOutlineMinus size={14} />
          </button>
          <span className="w-9 text-center font-mono text-espresso text-[14px]">
            {value}
          </span>
          <button
            type="button"
            onClick={increment}
            className="w-8 h-9 flex items-center justify-center text-espresso hover:bg-bone transition-colors"
          >
            <HiPlus size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
