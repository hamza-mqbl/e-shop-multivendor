import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import styles from "../../../styles/styles";
import {
  AiFillHeart,
  AiFillStar,
  AiOutlineEye,
  AiOutlineHeart,
  AiOutlineShoppingCart,
  AiOutlineStar,
} from "react-icons/ai";
import ProductDetailsCard from "../ProductDetailCard/ProductDetailsCard.jsx";
import * as WishlistActions from "../../../redux/actions/wishlist";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { addToCart } from "../../../redux/actions/cart.js";
import Rating from "../../Products/Rating.jsx";

const ProductCard = ({ data,isEvent }) => {
  const dispatch = useDispatch();

  const { wishlist } = useSelector((state) => state.wishlist);
  const { cart } = useSelector((state) => state.cart);

  // console.log("Images:", data.images[0].url);

  const [click, setClick] = useState(false);
  const [open, setOpen] = useState(false);

  const d = data.name;
  const product_name = d.replace(/\s+/g, "-");
  useEffect(() => {
    if (wishlist && wishlist.find((i) => i._id === data._id)) {
      setClick(true);
    } else {
      setClick(false);
    }
  }, [wishlist]);
  const removeFromWishlistHandler = (data) => {
    setClick(!click);
    dispatch(WishlistActions.removeFromWishList(data));
  };

  const addToWishlistHandler = (data) => {
    setClick(!click);
    dispatch(WishlistActions.addToWishList(data));
  };
  const addToCartHandler = (id) => {
    const isItemExists = cart && cart.find((i) => i._id === id);
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

  const detailUrl =
    isEvent === true
      ? `/product/${data._id}?isEvent=true`
      : `/product/${data._id}`;
  const discountPercent =
    data.originalPrice && data.originalPrice > data.discountPrice
      ? Math.round((1 - data.discountPrice / data.originalPrice) * 100)
      : 0;

  return (
    <div className="group relative h-full flex flex-col bg-white border border-sand rounded-xl shadow-card hover:shadow-cardHover hover:-translate-y-1 transition-all duration-200 overflow-hidden">
      {/* image — uniform frame for every card */}
      <Link to={detailUrl} className="block relative">
        <div className="h-[210px] w-full bg-bone overflow-hidden">
          <img
            src={`${data.images && data.images[0]?.url}`}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            alt={data.name}
          />
        </div>
        {discountPercent > 0 && (
          <span className="absolute top-3 left-3 bg-brick text-white font-mono font-semibold text-[12px] px-2 py-0.5 rounded-md">
            -{discountPercent}%
          </span>
        )}
      </Link>

      {/* quick actions */}
      <div className="absolute top-3 right-3 flex flex-col gap-2">
        <button
          type="button"
          onClick={() =>
            click ? removeFromWishlistHandler(data) : addToWishlistHandler(data)
          }
          title={click ? "Remove from wishlist" : "Add to wishlist"}
          className="w-9 h-9 rounded-full bg-white/95 shadow-card flex items-center justify-center hover:bg-marigold transition-colors"
        >
          {click ? (
            <AiFillHeart size={18} color="#B5462B" />
          ) : (
            <AiOutlineHeart size={18} color="#241A14" />
          )}
        </button>
        <button
          type="button"
          onClick={() => setOpen(!open)}
          title="Quick view"
          className="w-9 h-9 rounded-full bg-white/95 shadow-card flex items-center justify-center hover:bg-marigold transition-colors"
        >
          <AiOutlineEye size={18} color="#241A14" />
        </button>
        <button
          type="button"
          onClick={() => addToCartHandler(data._id)}
          title="Add to cart"
          className="w-9 h-9 rounded-full bg-white/95 shadow-card flex items-center justify-center hover:bg-marigold transition-colors"
        >
          <AiOutlineShoppingCart size={18} color="#241A14" />
        </button>
      </div>

      {/* body */}
      <div className="flex flex-col flex-1 p-4">
        <Link to="/" className="text-[13px] font-medium text-marigold-dark">
          {data.shop.name}
        </Link>
        <Link to={detailUrl}>
          <h4 className="mt-1 font-display font-medium text-espresso text-[15px] leading-snug line-clamp-2 min-h-[42px]">
            {data.name}
          </h4>
        </Link>
        <div className="flex items-center mt-2">
          <Rating ratings={data.ratings} />
        </div>
        <div className="mt-auto pt-3 flex items-end justify-between">
          <div className="flex items-baseline gap-2">
            <span className="font-mono font-semibold text-[17px] text-espresso">
              Rs {data.discountPrice}
            </span>
            {data.originalPrice ? (
              <span className="font-mono text-[13px] text-clay line-through">
                Rs {data.originalPrice}
              </span>
            ) : null}
          </div>
          <span className="font-mono text-[12px] text-clay whitespace-nowrap">
            {data?.sold_out} sold
          </span>
        </div>
      </div>
      {open ? <ProductDetailsCard setOpen={setOpen} data={data} /> : null}
    </div>
  );
};

export default ProductCard;
