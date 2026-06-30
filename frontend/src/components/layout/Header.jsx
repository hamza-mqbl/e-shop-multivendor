import React, { useState } from "react";
import styles from "../../styles/styles";
import { Link } from "react-router-dom";
import { categoriesData } from "../../static/data";
import {
  AiOutlineHeart,
  AiOutlineSearch,
  AiOutlineShoppingCart,
} from "react-icons/ai";
import Cart from "../cart/Cart.jsx";
import WishList from "../wishlist/WishList.jsx";
import { CgProfile } from "react-icons/cg";
import { IoIosArrowDown } from "react-icons/io";
import { BiMenuAltLeft } from "react-icons/bi";
import DropDown from "./DropDown.jsx";
import Navbar from "./Navbar.jsx";
import { useSelector } from "react-redux";
import { RxCross1 } from "react-icons/rx";
import { FaShoePrints } from "react-icons/fa";

// Qadam wordmark — espresso for light backgrounds, bone for the dark bar
const Wordmark = ({ light }) => (
  <span className="flex items-center gap-2 select-none">
    <FaShoePrints className="text-marigold text-[22px] -rotate-12" />
    <span
      className={`font-display text-[26px] font-semibold tracking-tight leading-none ${
        light ? "text-bone" : "text-espresso"
      }`}
    >
      Qadam
    </span>
  </span>
);

const Header = ({ activeHeading }) => {
  const { allProducts } = useSelector((state) => state.products);
  const { cart } = useSelector((state) => state.cart);
  const { wishlist } = useSelector((state) => state.wishlist);
  const { isAuthenticated, user } = useSelector((state) => state.user);

  const [searchTerm, setSearchTerm] = useState("");
  const [searchData, setSearchData] = useState(null);
  const [active, setActive] = useState(false);
  const [dropDown, setDropDown] = useState(false);
  const [openSearch, setOpenSearch] = useState(false);
  const [openCart, setOpenCart] = useState(false);
  const [openWishList, setOpenWishList] = useState(false);
  const [open, setOpen] = useState(false);

  const handleSearchChange = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    const filteredProducts =
      allProducts &&
      allProducts.filter((product) =>
        product.name.toLowerCase().includes(term.toLowerCase())
      );
    setSearchData(filteredProducts);
  };

  window.addEventListener("scroll", () => {
    setActive(window.scrollY > 70);
  });

  // shared icon-button style for the dark bar
  const iconBtn =
    "relative text-bone/85 hover:text-marigold transition-colors cursor-pointer";
  const badge =
    "absolute -right-2 -top-2 rounded-full bg-brick w-[18px] h-[18px] flex items-center justify-center text-white font-mono text-[11px]";

  return (
    <>
      {/* ── desktop header: one clean espresso bar ── */}
      <div className="hidden 800px:block sticky top-0 z-30">
        <div className="w-full bg-espresso h-[72px] shadow-sm">
          <div
            className={`${styles.section} h-full flex items-center justify-between relative`}
          >
            {/* left: wordmark */}
            <Link to="/">
              <Wordmark light />
            </Link>

            {/* center: nav */}
            <div className="absolute left-1/2 -translate-x-1/2">
              <Navbar active={activeHeading} />
            </div>

            {/* right: actions */}
            <div className="flex items-center gap-6">
              {/* categories */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => {
                    setDropDown(!dropDown);
                    setOpenSearch(false);
                  }}
                  className="flex items-center gap-1.5 text-bone/85 hover:text-marigold transition-colors"
                >
                  <BiMenuAltLeft size={22} />
                  <span className="hidden 1100px:inline font-medium">
                    Categories
                  </span>
                  <IoIosArrowDown
                    size={15}
                    className={`transition-transform ${
                      dropDown ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {dropDown && (
                  <DropDown
                    categoriesData={categoriesData}
                    setDropDown={setDropDown}
                  />
                )}
              </div>

              {/* search */}
              <button
                type="button"
                onClick={() => {
                  setOpenSearch(!openSearch);
                  setDropDown(false);
                }}
                className={iconBtn}
                title="Search"
              >
                <AiOutlineSearch size={24} />
              </button>

              {/* wishlist */}
              <button
                type="button"
                onClick={() => setOpenWishList(true)}
                className={iconBtn}
                title="Wishlist"
              >
                <AiOutlineHeart size={24} />
                <span className={badge}>{wishlist && wishlist.length}</span>
              </button>

              {/* cart */}
              <button
                type="button"
                onClick={() => setOpenCart(true)}
                className={iconBtn}
                title="Cart"
              >
                <AiOutlineShoppingCart size={24} />
                <span className={badge}>{cart && cart.length}</span>
              </button>

              {/* account */}
              {isAuthenticated ? (
                <Link to="/profile">
                  <img
                    src={`${user.avatar?.url}`}
                    alt="Account"
                    className="w-[38px] h-[38px] rounded-full object-cover border-2 border-marigold"
                  />
                </Link>
              ) : (
                <Link to="/login" className={iconBtn} title="Login">
                  <CgProfile size={26} />
                </Link>
              )}
            </div>
          </div>

          {/* search panel */}
          {openSearch && (
            <div className="absolute left-0 top-full w-full bg-white border-b border-sand shadow-card">
              <div className={`${styles.section} py-4`}>
                <div className="relative">
                  <AiOutlineSearch
                    size={22}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-clay"
                  />
                  <input
                    autoFocus
                    type="text"
                    placeholder="Search shoes…"
                    value={searchTerm}
                    onChange={handleSearchChange}
                    className="w-full h-[48px] pl-11 pr-10 bg-bone border border-sand focus:border-marigold rounded-xl transition-colors"
                  />
                  <RxCross1
                    size={18}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-clay cursor-pointer"
                    onClick={() => setOpenSearch(false)}
                  />
                </div>
                {searchData && searchData.length > 0 && (
                  <div className="mt-3 max-h-[50vh] overflow-y-auto">
                    {searchData.map((i, index) => (
                      <Link
                        to={`/product/${i._id}`}
                        key={index}
                        onClick={() => setOpenSearch(false)}
                      >
                        <div className="flex items-center gap-3 py-2 px-2 rounded-lg hover:bg-bone transition-colors">
                          <img
                            src={i.images && i.images[0]?.url}
                            alt=""
                            className="w-10 h-10 rounded object-cover bg-bone"
                          />
                          <span className="text-espresso">{i.name}</span>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
                {searchData && searchData.length === 0 && searchTerm && (
                  <p className="mt-3 text-clay text-sm px-2">
                    No shoes match “{searchTerm}”.
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* popups */}
        {openCart ? <Cart setOpenCart={setOpenCart} /> : null}
        {openWishList ? <WishList setOpenWishList={setOpenWishList} /> : null}
      </div>

      {/* ── mobile header ── */}
      <div
        className={`${
          active === true ? "shadow-sm fixed top-0 left-0 z-10" : null
        } w-full h-[60px] bg-white z-50 top-0 left-0 shadow-sm 800px:hidden`}
      >
        <div className="w-full flex items-center justify-between">
          <div>
            <BiMenuAltLeft
              size={36}
              className="ml-4 text-espresso"
              onClick={() => setOpen(true)}
            />
          </div>
          <div>
            <Link to="/" className="mt-2 inline-block">
              <Wordmark />
            </Link>
          </div>
          <div>
            <div
              className="relative mr-[20px]"
              onClick={() => setOpenCart(true)}
            >
              <AiOutlineShoppingCart size={28} className="text-espresso" />
              <span className="absolute -right-2 -top-2 rounded-full bg-brick w-[18px] h-[18px] flex items-center justify-center text-white font-mono text-[11px]">
                {cart && cart.length}
              </span>
            </div>
          </div>
          {openCart ? <Cart setOpenCart={setOpenCart} /> : null}
          {openWishList ? <WishList setOpenWishList={setOpenWishList} /> : null}
        </div>

        {/* mobile drawer */}
        {open && (
          <div className="fixed w-full bg-[#0000005f] z-20 h-full top-0 left-0">
            <div className="fixed w-[72%] bg-white h-screen top-0 left-0 z-10 overflow-y-scroll">
              <div className="w-full justify-between flex pr-3">
                <div>
                  <div
                    className="relative mr-[15px]"
                    onClick={() => setOpenWishList(true)}
                  >
                    <AiOutlineHeart size={28} className="mt-5 ml-3 text-espresso" />
                    <span className="absolute right-0 top-3 rounded-full bg-brick w-[18px] h-[18px] flex items-center justify-center text-white font-mono text-[11px]">
                      {wishlist && wishlist.length}
                    </span>
                  </div>
                </div>
                <RxCross1
                  size={28}
                  className="ml-4 mt-5 text-espresso"
                  onClick={() => setOpen(false)}
                />
              </div>

              <div className="my-8 w-[92%] m-auto relative">
                <input
                  type="search"
                  placeholder="Search shoes…"
                  className="h-[44px] w-full px-3 bg-bone border border-sand focus:border-marigold rounded-lg transition-colors"
                  value={searchTerm}
                  onChange={handleSearchChange}
                />
                {searchData && searchData.length > 0 && (
                  <div className="absolute bg-white border border-sand z-10 shadow-card w-full left-0 p-2 rounded-lg">
                    {searchData.map((i, index) => (
                      <Link
                        to={`/product/${i._id}`}
                        key={index}
                        onClick={() => setOpen(false)}
                      >
                        <div className="flex items-center gap-2 py-2">
                          <img
                            src={i.images[0]?.url}
                            alt=""
                            className="w-10 h-10 rounded object-cover bg-bone"
                          />
                          <h5 className="text-espresso">{i.name}</h5>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              <Navbar active={activeHeading} />
              <br />
              <br />

              <div className="flex w-full justify-center">
                {isAuthenticated ? (
                  <Link to="/profile">
                    <img
                      src={`${user.avatar?.url}`}
                      alt=""
                      className="w-[60px] h-[60px] rounded-full border-2 border-marigold object-cover"
                    />
                  </Link>
                ) : (
                  <>
                    <Link
                      to="/login"
                      className="text-[18px] pr-[10px] text-espresso"
                    >
                      Login /
                    </Link>
                    <Link to="/sign-up" className="text-[18px] text-espresso">
                      Sign up
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Header;
