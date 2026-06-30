import React from "react";
import CountDown from "./CountDown.jsx";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../../redux/actions/cart.js";

const EventCard = ({ active, data }) => {
  const dispatch = useDispatch();
  const { cart } = useSelector((state) => state.cart);

  const addToCartHandler = (data) => {
    // console.log("🚀 ~ addToCartHandler ~ data:", data._id)
    const isItemExists = cart && cart.find((i) => i._id === data?._id);
    if (isItemExists) {
      toast.error("Item already in cart!");
    } else {
      if (data.stock < 1) {
        toast.error("Product stock limited!");
      } else {
        const cartData = { ...data, qty: 1 };
        dispatch(addToCart(cartData));
        toast.success("Item added to cart successfully!");
      }
    }
  };
  const discountPercent =
    data && data.originalPrice && data.originalPrice > data.discountPrice
      ? Math.round((1 - data.discountPrice / data.originalPrice) * 100)
      : 0;

  // Check if data is defined
  return data ? (
    <div
      className={`w-full block bg-white border border-sand rounded-2xl shadow-card overflow-hidden ${
        active ? "unset" : "mb-12"
      } lg:flex`}
    >
      <div className="relative w-full lg:w-[48%]">
        <div className="aspect-[4/3] lg:aspect-auto lg:h-full bg-bone">
          <img
            src={`${data.images && data.images[0]?.url}`}
            alt={data.name}
            className="w-full h-full object-cover"
          />
        </div>
        <span className="absolute top-4 left-4 bg-brick text-white font-mono font-semibold text-[13px] px-2.5 py-1 rounded-md">
          Offer
        </span>
      </div>

      <div className="w-full lg:w-[52%] flex flex-col justify-center p-6 800px:p-8">
        <h2 className="font-display text-[24px] 800px:text-[28px] font-semibold text-espresso leading-tight">
          {data.name}
        </h2>
        <p className="text-[14px] leading-relaxed text-clay mt-2 line-clamp-3">
          {data.description}
        </p>

        <div className="flex items-end justify-between mt-4">
          <div className="flex items-baseline gap-3">
            <span className="font-mono font-semibold text-[26px] text-espresso">
              Rs {data.discountPrice}
            </span>
            {data.originalPrice ? (
              <span className="font-mono text-[16px] text-clay line-through">
                Rs {data.originalPrice}
              </span>
            ) : null}
            {discountPercent > 0 && (
              <span className="text-[13px] font-medium text-brick">
                Save {discountPercent}%
              </span>
            )}
          </div>
          <span className="font-mono text-[13px] text-clay">
            {data.sold_out} sold
          </span>
        </div>

        <div className="mt-5">
          <p className="font-mono text-[11px] uppercase tracking-[0.15em] text-marigold-dark mb-2">
            Ends in
          </p>
          <CountDown data={data} />
        </div>

        <div className="flex items-center gap-3 mt-6">
          <Link to={`/product/${data._id}?isEvent=true`}>
            <div className="inline-flex items-center justify-center h-[48px] px-6 rounded-xl border border-espresso text-espresso hover:bg-espresso hover:text-bone transition-colors font-display font-medium">
              See details
            </div>
          </Link>
          <div
            className="inline-flex items-center justify-center h-[48px] px-6 rounded-xl bg-marigold hover:bg-marigold-dark text-espresso transition-colors font-display font-medium cursor-pointer"
            onClick={() => addToCartHandler(data)}
          >
            Add to cart
          </div>
        </div>
      </div>
    </div>
  ) : (
    <div className="flex justify-center text-center text-clay font-medium text-lg py-10">
      No offers are running right now.
    </div>
  );
};

export default EventCard;
