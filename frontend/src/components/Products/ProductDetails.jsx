import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "../../styles/styles";
import {
  AiFillHeart,
  AiOutlineHeart,
  AiOutlineMessage,
  AiOutlineShoppingCart,
} from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import * as WishlistActions from "../../redux/actions/wishlist";
import { toast } from "react-toastify";
import { addToCart } from "../../redux/actions/cart";
import { backend_url, server } from "../../server";
import Rating from "./Rating";
import { getAllProductsShop } from "../../redux/actions/product";
import axios from "axios";
import InnerImageZoom from "react-inner-image-zoom";
import "react-inner-image-zoom/lib/styles.min.css";

// Request a higher-resolution Unsplash variant for the zoom overlay
const hiRes = (url) => (url ? url.replace(/w=\d+/, "w=1600") : url);

// Small presentational helpers used in the buy box
const MetaChip = ({ label, value }) => (
  <span className="font-mono text-[12px] text-espresso bg-bone border border-sand rounded-full px-3 py-1">
    <span className="text-clay">{label}:</span> {value}
  </span>
);

const TrustBadge = ({ title, sub }) => (
  <div className="bg-bone border border-sand rounded-lg py-2 px-2">
    <p className="text-[12px] font-medium text-espresso leading-tight">{title}</p>
    <p className="text-[10px] text-clay leading-tight">{sub}</p>
  </div>
);

const ProductDetails = ({ data }) => {
  const navigate = useNavigate();
  const { wishlist } = useSelector((state) => state.wishlist);
  const { user, isAuthenticated } = useSelector((state) => state.user);
  const { cart } = useSelector((state) => state.cart);
  const { products } = useSelector((state) => state.products);
  const [count, setCount] = useState(1);
  const [click, setClick] = useState(false);
  const [select, setSelect] = useState(0);
  const [selectedSize, setSelectedSize] = useState(null);

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getAllProductsShop(data && data?.shop._id));
    if (wishlist && wishlist.find((i) => i._id === data?._id)) {
      setClick(true);
    } else {
      setClick(false);
    }
  }, [data, wishlist]);

  const incrementCount = () => {
    setCount(count + 1);
  };
  const decrementCount = () => {
    if (count > 1) {
      setCount(count - 1);
    }
  };

  const handleMessageSubmit = async () => {
    if (isAuthenticated) {
      const groupTitle = data._id + user._id;
      const userId = user._id;
      const sellerId = data.shop._id;
      await axios
        .post(`${server}/conversation/create-new-conversation`, {
          groupTitle,
          userId,
          sellerId,
        })
        .then((res) => {
          navigate(`/conversation/${res.data.conversation._id}`);
        })
        .catch((error) => {
          toast.error(error.response.data.message);
        });
    } else {
      toast.error("Please login to create a conversation");
    }
  };
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
    const hasSizes = data.sizes && data.sizes.length > 0;
    if (isItemExists) {
      toast.error("item already in cart");
    } else if (hasSizes && !selectedSize) {
      toast.error("Please select a size first");
    } else if (data.stock < count) {
      toast.error("product stock limited!");
    } else {
      const cartData = { ...data, qty: count, selectedSize };
      dispatch(addToCart(cartData));
      toast.success("item added to cart successfully");
    }
  };
  const totalReviewsLength =
    products &&
    products.reduce((acc, product) => acc + product.reviews.length, 0);

  const totalRatings =
    products &&
    products.reduce(
      (acc, product) =>
        acc + product.reviews.reduce((sum, review) => sum + review.rating, 0),
      0
    );

  const avg = totalRatings / totalReviewsLength || 0;

  // Check if the average rating is an integer
  const averageRating = Number.isInteger(avg) ? avg.toFixed(0) : avg.toFixed(2);

  const discountPercent =
    data && data.originalPrice && data.originalPrice > data.discountPrice
      ? Math.round((1 - data.discountPrice / data.originalPrice) * 100)
      : 0;

  return (
    <div className="bg-bone">
      {data ? (
        <div className={`${styles.section} w-[90%] 800px:w-[80%]`}>
          {/* breadcrumb */}
          <nav className="flex items-center gap-2 text-[13px] text-clay py-5">
            <Link to="/" className="hover:text-espresso">
              Home
            </Link>
            <span>/</span>
            <Link
              to={`/products?category=${data.category}`}
              className="hover:text-espresso"
            >
              {data.category}
            </Link>
            <span>/</span>
            <span className="text-espresso truncate max-w-[220px]">
              {data.name}
            </span>
          </nav>

          <div className="block w-full 800px:flex 800px:gap-10 pb-12">
            {/* ── gallery ── */}
            <div className="w-full 800px:w-[48%]">
              <div>
                <div className="relative w-full aspect-square bg-white border border-sand rounded-2xl overflow-hidden">
                  <InnerImageZoom
                    key={select}
                    src={data.images[select]?.url}
                    zoomSrc={hiRes(data.images[select]?.url)}
                    zoomType="hover"
                    hideHint
                    fullscreenOnMobile
                    className="iiz-frame"
                    imgAttributes={{ alt: data.name }}
                  />
                  {discountPercent > 0 && (
                    <span className="absolute top-4 left-4 bg-brick text-white font-mono font-semibold text-[13px] px-2.5 py-1 rounded-md">
                      -{discountPercent}%
                    </span>
                  )}
                </div>
                {data.images.length > 1 && (
                  <div className="flex gap-3 mt-4">
                    {data.images.map((img, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => setSelect(index)}
                        className={`w-[78px] h-[78px] rounded-xl overflow-hidden border-2 transition-colors ${
                          select === index
                            ? "border-marigold"
                            : "border-sand hover:border-clay"
                        }`}
                      >
                        <img
                          src={img.url}
                          className="w-full h-full object-cover"
                          alt=""
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* ── buy box ── */}
            <div className="w-full 800px:w-[52%] pt-8 800px:pt-0">
              <Link
                to={`/shop/preview/${data.shop._id}`}
                className="text-[14px] font-medium text-marigold-dark"
              >
                {data.shop.name}
              </Link>
              <h1 className="font-display text-[28px] 800px:text-[34px] font-semibold text-espresso leading-tight mt-1">
                {data.name}
              </h1>

              <div className="flex items-center gap-3 mt-3">
                <Rating ratings={data.ratings} />
                <span className="text-[13px] text-clay">
                  {data.sold_out} sold
                </span>
              </div>

              {/* price */}
              <div className="flex items-baseline flex-wrap gap-x-3 gap-y-1 mt-5">
                <span className="font-mono font-semibold text-[30px] text-espresso">
                  Rs {data.discountPrice}
                </span>
                {data.originalPrice ? (
                  <span className="font-mono text-[18px] text-clay line-through">
                    Rs {data.originalPrice}
                  </span>
                ) : null}
                {discountPercent > 0 && (
                  <span className="text-[13px] font-medium text-brick">
                    Save {discountPercent}%
                  </span>
                )}
              </div>

              <hr className="seam my-6" />

              {/* meta chips */}
              {(data.brand || data.gender || data.material) && (
                <div className="flex flex-wrap gap-2 mb-5">
                  {data.brand && <MetaChip label="Brand" value={data.brand} />}
                  {data.gender && <MetaChip label="For" value={data.gender} />}
                  {data.material && (
                    <MetaChip label="Material" value={data.material} />
                  )}
                </div>
              )}

              {/* colours */}
              {data.colors && data.colors.length > 0 && (
                <div className="mb-5 text-[14px]">
                  <span className="text-clay">Colours: </span>
                  <span className="text-espresso font-medium">
                    {data.colors.join(", ")}
                  </span>
                </div>
              )}

              {/* size selector */}
              {data.sizes && data.sizes.length > 0 && (
                <div className="mb-6">
                  <div className="flex items-center justify-between">
                    <h4 className="font-display font-medium text-espresso">
                      Select size{" "}
                      <span className="font-sans text-[12px] text-clay">
                        (UK)
                      </span>
                    </h4>
                    <button
                      type="button"
                      className="text-[13px] text-marigold-dark hover:text-espresso transition-colors"
                    >
                      Size guide
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {data.sizes.map((size) => (
                      <button
                        key={size}
                        type="button"
                        onClick={() => setSelectedSize(size)}
                        className={`min-w-[48px] h-[48px] px-2 rounded-lg border font-mono text-[15px] transition-colors ${
                          selectedSize === size
                            ? "bg-espresso text-bone border-espresso"
                            : "bg-white text-espresso border-sand hover:border-marigold"
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* quantity */}
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center border border-sand rounded-xl overflow-hidden bg-white">
                  <button
                    type="button"
                    onClick={decrementCount}
                    className="w-11 h-12 text-espresso text-[20px] hover:bg-bone transition-colors"
                  >
                    −
                  </button>
                  <span className="w-12 text-center font-mono text-espresso">
                    {count}
                  </span>
                  <button
                    type="button"
                    onClick={incrementCount}
                    className="w-11 h-12 text-espresso text-[20px] hover:bg-bone transition-colors"
                  >
                    +
                  </button>
                </div>
                <span className="text-[13px] text-clay">
                  {data.stock > 0 ? `${data.stock} in stock` : "Out of stock"}
                </span>
              </div>

              {/* actions */}
              <div className="flex items-stretch gap-3">
                <button
                  type="button"
                  onClick={() => addToCartHandler(data._id)}
                  className="flex-1 h-[52px] bg-marigold hover:bg-marigold-dark text-espresso font-display font-medium rounded-xl flex items-center justify-center gap-2 transition-colors"
                >
                  Add to cart <AiOutlineShoppingCart size={20} />
                </button>
                <button
                  type="button"
                  onClick={() =>
                    click
                      ? removeFromWishlistHandler(data)
                      : addToWishlistHandler(data)
                  }
                  title={click ? "Remove from wishlist" : "Add to wishlist"}
                  className="w-[52px] h-[52px] rounded-xl border border-sand flex items-center justify-center hover:border-marigold transition-colors"
                >
                  {click ? (
                    <AiFillHeart size={22} color="#B5462B" />
                  ) : (
                    <AiOutlineHeart size={22} color="#241A14" />
                  )}
                </button>
              </div>

              {/* trust badges */}
              <div className="grid grid-cols-3 gap-2 mt-6 text-center">
                <TrustBadge title="Free delivery" sub="over Rs 5,000" />
                <TrustBadge title="7-day exchange" sub="wrong size? swap" />
                <TrustBadge title="Cash on delivery" sub="pay at door" />
              </div>

              {/* seller card */}
              <div className="flex items-center gap-3 mt-6 p-4 bg-white border border-sand rounded-xl">
                <Link to={`/shop/preview/${data.shop._id}`}>
                  <img
                    src={`${data.shop.avatar && data.shop.avatar?.url}`}
                    className="w-[48px] h-[48px] rounded-full border-2 border-marigold object-cover"
                    alt=""
                  />
                </Link>
                <div className="flex-1">
                  <Link to={`/shop/preview/${data.shop._id}`}>
                    <h3 className="font-display font-medium text-espresso">
                      {data.shop.name}
                    </h3>
                  </Link>
                  <h5 className="text-[13px] text-clay">
                    ({averageRating}/5) Ratings
                  </h5>
                </div>
                <button
                  type="button"
                  onClick={handleMessageSubmit}
                  className="h-[42px] px-4 rounded-lg border border-espresso text-espresso hover:bg-espresso hover:text-bone transition-colors flex items-center gap-1 text-[14px]"
                >
                  Message <AiOutlineMessage size={18} />
                </button>
              </div>
            </div>
          </div>

          <ProductDetailsInfo
            data={data}
            products={products}
            totalReviewsLength={totalReviewsLength}
            averageRating={averageRating}
          />
        </div>
      ) : (
        <div className="h-[40vh] flex items-center justify-center text-clay">
          Loading product…
        </div>
      )}
    </div>
  );
};

const ProductDetailsInfo = ({
  data,
  products,
  totalReviewsLength,
  averageRating,
}) => {
  const [active, setActive] = useState(1);

  const Tab = ({ id, children }) => (
    <div className="relative">
      <h5
        className={`px-1 leading-5 font-display font-semibold cursor-pointer text-[16px] 800px:text-[18px] transition-colors ${
          active === id ? "text-espresso" : "text-clay hover:text-espresso"
        }`}
        onClick={() => setActive(id)}
      >
        {children}
      </h5>
      {active === id ? <div className={`${styles.active_indicator}`} /> : null}
    </div>
  );

  return (
    <div className="bg-white border border-sand rounded-2xl px-5 800px:px-10 py-6 mb-14">
      <div className="w-full flex justify-between border-b border-sand pb-3">
        <Tab id={1}>Product details</Tab>
        <Tab id={2}>Reviews</Tab>
        <Tab id={3}>Seller</Tab>
      </div>

      {active === 1 ? (
        <div className="py-5">
          <p className="text-[15px] leading-8 text-espresso/80 whitespace-pre-line">
            {data.description}
          </p>
          <h4 className="font-display font-semibold text-espresso text-[18px] mt-8 mb-2">
            Specifications
          </h4>
          <div className="grid grid-cols-1 800px:grid-cols-2 gap-x-12 max-w-[820px]">
            {[
              ["Brand", data.brand],
              ["For", data.gender],
              ["Material", data.material],
              ["Category", data.category],
              ["Available sizes (UK)", data.sizes && data.sizes.join(", ")],
              ["Colours", data.colors && data.colors.join(", ")],
            ]
              .filter(([, v]) => v && String(v).length > 0)
              .map(([k, v]) => (
                <div
                  key={k}
                  className="flex justify-between gap-4 py-3 border-b border-sand text-[14px]"
                >
                  <span className="text-clay">{k}</span>
                  <span className="text-espresso font-medium text-right">
                    {v}
                  </span>
                </div>
              ))}
          </div>
        </div>
      ) : null}

      {active === 2 ? (
        <div className="w-full min-h-[30vh] py-5">
          {/* ratings summary */}
          <div className="flex items-center gap-6 pb-6 border-b border-sand">
            <div className="text-center shrink-0">
              <p className="font-display text-[42px] font-semibold text-espresso leading-none">
                {Number(data.ratings || 0).toFixed(1)}
              </p>
              <div className="flex justify-center mt-1">
                <Rating ratings={data.ratings} />
              </div>
              <p className="text-[12px] text-clay mt-1">
                {data.reviews.length}{" "}
                {data.reviews.length === 1 ? "review" : "reviews"}
              </p>
            </div>
            <p className="text-[14px] text-clay leading-relaxed">
              What customers are saying about the {data.name}. Verified buyers
              can leave a review from their orders after delivery.
            </p>
          </div>

          {/* review list */}
          <div className="mt-6 flex flex-col gap-6">
            {data &&
              data.reviews.map((item, index) => (
                <div className="flex gap-3" key={index}>
                  <img
                    src={`${backend_url}/${item.user.avatar}`}
                    className="w-[44px] h-[44px] rounded-full object-cover"
                    alt=""
                  />
                  <div>
                    <div className="flex items-center gap-3">
                      <h1 className="font-[600] text-espresso">
                        {item.user.name}
                      </h1>
                      <Rating ratings={item.rating} />
                    </div>
                    <p className="text-clay mt-1">{item.comment}</p>
                  </div>
                </div>
              ))}
            {data && data.reviews.length === 0 && (
              <div className="text-center py-10">
                <p className="text-espresso font-medium">No reviews yet</p>
                <p className="text-clay text-[14px] mt-1">
                  Be the first to review this product after your purchase.
                </p>
              </div>
            )}
          </div>
        </div>
      ) : null}

      {active === 3 ? (
        <div className="w-full block 800px:flex p-2 800px:p-5 gap-8">
          <div className="w-full 800px:w-[50%]">
            <Link to={`/shop/preview/${data.shop._id}`}>
              <div className="flex items-center">
                <img
                  src={`${data.shop.avatar && data.shop.avatar?.url}`}
                  className="w-[50px] h-[50px] rounded-full border-2 border-marigold object-cover"
                  alt=""
                />
                <div className="pl-3">
                  <h3 className="font-display font-medium text-espresso">
                    {data.shop.name}
                  </h3>
                  <h5 className="text-[13px] text-clay">
                    ({averageRating}/5) Ratings
                  </h5>
                </div>
              </div>
            </Link>
            <p className="pt-3 text-[15px] leading-7 text-espresso/80">
              {data.shop.description}
            </p>
          </div>
          <div className="w-full 800px:w-[50%] mt-5 800px:mt-0 800px:flex flex-col items-end">
            <div className="text-left">
              <h5 className="font-[600] text-espresso">
                Joined on:{" "}
                <span className="font-[400] text-clay">
                  {data?.createdAt?.slice(0, 10)}
                </span>
              </h5>
              <h5 className="font-[600] text-espresso pt-3">
                Total products:{" "}
                <span className="font-[400] text-clay">
                  {products && products.length}
                </span>
              </h5>
              <h5 className="font-[600] text-espresso pt-3">
                Total reviews:{" "}
                <span className="font-[400] text-clay">
                  {totalReviewsLength}
                </span>
              </h5>
              <Link to={`/shop/preview/${data.shop._id}`}>
                <div className="inline-flex items-center justify-center h-[44px] px-6 mt-4 rounded-xl bg-espresso hover:bg-coffee transition-colors">
                  <span className="text-bone font-display font-medium">
                    Visit shop
                  </span>
                </div>
              </Link>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};
export default ProductDetails;
