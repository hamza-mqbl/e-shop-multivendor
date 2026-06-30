import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { AiOutlineHeart, AiOutlineDelete } from "react-icons/ai";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import Seo from "../components/Seo.jsx";
import styles from "../styles/styles";
import { addToCart } from "../redux/actions/cart";
import { removeFromWishList } from "../redux/actions/wishlist";

const WishlistPage = () => {
  const { wishlist } = useSelector((state) => state.wishlist);
  const { cart } = useSelector((state) => state.cart);
  const dispatch = useDispatch();

  const removeHandler = (data) => dispatch(removeFromWishList(data));

  const addToCartHandler = (data) => {
    const exists = cart && cart.find((i) => i._id === data._id);
    if (exists) {
      toast.error("Already in cart");
    } else if (data.stock < 1) {
      toast.error("Out of stock");
    } else {
      dispatch(addToCart({ ...data, qty: 1 }));
      toast.success("Added to cart");
    }
  };

  const addAllToCart = () => {
    let added = 0;
    wishlist.forEach((data) => {
      const exists = cart && cart.find((i) => i._id === data._id);
      if (!exists && data.stock >= 1) {
        dispatch(addToCart({ ...data, qty: 1 }));
        added += 1;
      }
    });
    if (added > 0) toast.success(`Added ${added} to cart`);
    else toast.error("Nothing new to add");
  };

  return (
    <div className="bg-bone min-h-screen">
      <Seo title="Your wishlist" path="/wishlist" noIndex />
      <Header />
      <div className={`${styles.section} py-8 800px:py-12`}>
        <h1 className="font-display text-[28px] font-semibold text-espresso mb-6">
          Your wishlist
        </h1>

        {wishlist.length === 0 ? (
          <div className="bg-white border border-sand rounded-2xl shadow-card py-20 flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-bone flex items-center justify-center mb-4">
              <AiOutlineHeart size={28} className="text-clay" />
            </div>
            <p className="text-espresso font-display font-medium text-[18px]">
              Your wishlist is empty
            </p>
            <p className="text-clay text-[14px] mt-1 mb-6">
              Tap the heart on any shoe to save it for later.
            </p>
            <Link to="/products">
              <span className="inline-flex items-center justify-center h-[48px] px-7 rounded-xl bg-espresso hover:bg-coffee text-bone font-display font-medium transition-colors">
                Shop the collection
              </span>
            </Link>
          </div>
        ) : (
          <div className="bg-white border border-sand rounded-2xl shadow-card overflow-hidden max-w-[920px]">
            <div className="flex items-center justify-between px-5 py-4 border-b border-sand">
              <span className="font-display font-medium text-espresso">
                {wishlist.length}{" "}
                {wishlist.length === 1 ? "saved item" : "saved items"}
              </span>
              <button
                type="button"
                onClick={addAllToCart}
                className="text-[14px] font-medium text-marigold-dark hover:text-espresso transition-colors"
              >
                Add all to cart
              </button>
            </div>

            {wishlist.map((item, index) => (
              <div
                key={index}
                className="flex flex-col 800px:flex-row 800px:items-center gap-4 p-4 800px:p-5 border-b border-sand last:border-0"
              >
                <Link to={`/product/${item._id}`} className="shrink-0">
                  <img
                    src={item.images && item.images[0]?.url}
                    alt={item.name}
                    className="w-[84px] h-[84px] 800px:w-[96px] 800px:h-[96px] rounded-lg object-cover bg-bone"
                  />
                </Link>

                <div className="flex-1 min-w-0">
                  <Link to={`/product/${item._id}`}>
                    <h3 className="font-medium text-espresso leading-snug line-clamp-2">
                      {item.name}
                    </h3>
                  </Link>
                  {item.category && (
                    <p className="text-[12px] text-clay mt-0.5">
                      {item.category}
                    </p>
                  )}
                  <div className="flex items-baseline gap-2 mt-1.5">
                    <span className="font-mono font-semibold text-espresso">
                      Rs {item.discountPrice}
                    </span>
                    {item.originalPrice ? (
                      <span className="font-mono text-[12px] text-clay line-through">
                        Rs {item.originalPrice}
                      </span>
                    ) : null}
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <button
                    type="button"
                    onClick={() => addToCartHandler(item)}
                    className="h-[42px] px-5 rounded-xl bg-marigold hover:bg-marigold-dark text-espresso font-display font-medium transition-colors"
                  >
                    Add to cart
                  </button>
                  <button
                    type="button"
                    onClick={() => removeHandler(item)}
                    title="Remove"
                    className="w-[42px] h-[42px] rounded-xl border border-sand flex items-center justify-center text-clay hover:text-brick hover:border-brick transition-colors"
                  >
                    <AiOutlineDelete size={20} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default WishlistPage;
