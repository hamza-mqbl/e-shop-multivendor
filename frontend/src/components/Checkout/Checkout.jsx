import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import styles from "../../styles/styles";
import { Country, State } from "country-state-city";
import axios from "axios";
import { toast } from "react-toastify";
import { server } from "../../server";

const FREE_SHIPPING_OVER = 5000;
const FLAT_SHIPPING = 200;
const selectCls =
  "w-full mt-1 h-[44px] px-3 bg-white border border-sand focus:border-marigold rounded-lg transition-colors";
const labelCls = "block pb-1 text-[14px] font-medium text-espresso";

const Checkout = () => {
  const { user } = useSelector((state) => state.user);
  const { cart } = useSelector((state) => state.cart);
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [userInfo, setUserInfo] = useState(false);
  const [address1, setAddress1] = useState("");
  const [address2, setAddress2] = useState("");
  const [zipCode, setZipCode] = useState(null);
  const [couponCode, setCouponCode] = useState("");
  const [couponCodeData, setCouponCodeData] = useState(null);
  const [discountPrice, setDiscountPrice] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const navigate = useNavigate();

  const subTotalPrice = cart.reduce(
    (acc, item) => acc + item.qty * item.discountPrice,
    0
  );
  const shipping =
    subTotalPrice === 0 || subTotalPrice >= FREE_SHIPPING_OVER
      ? 0
      : FLAT_SHIPPING;

  const paymentSubmit = () => {
    if (
      address1 === "" ||
      address2 === "" ||
      zipCode === null ||
      country === "" ||
      city === ""
    ) {
      toast.error("Please choose your delivery address");
    } else {
      const shippingAddress = { address1, address2, country, zipCode, city };
      const orderData = {
        cart,
        totalPrice,
        discountPrice,
        shipping,
        subTotalPrice,
        shippingAddress,
        user,
      };
      localStorage.setItem("latestOrder", JSON.stringify(orderData));
      navigate("/payment");
    }
  };

  // apply coupon code
  const handleSubmit = async (e) => {
    e.preventDefault();
    const name = couponCode;
    await axios.get(`${server}/coupon/get-coupon-value/${name}`).then((res) => {
      const shopId = res.data.couponCode?.shop;
      const couponValue = res.data.couponCode?.value;
      if (res.data.couponCode !== null) {
        const isCouponValid =
          cart && cart.filter((item) => item.shopId === shopId);
        if (isCouponValid.length === 0) {
          toast.error("Coupon code is not valid for this shop");
          setCouponCode("");
        } else {
          const eligiblePrice = isCouponValid.reduce(
            (acc, item) => acc + item.qty * item.discountPrice,
            0
          );
          const discount = (eligiblePrice * couponValue) / 100;
          setDiscountPrice(discount);
          setCouponCodeData(res.data.couponCode);
        }
      }
      if (res.data.couponCode === null) {
        toast.error("Coupon code doesn't exist");
        setCouponCode("");
      }
    });
  };

  const discountPercentage = couponCodeData ? discountPrice : "";
  const totalPrice = couponCodeData
    ? (subTotalPrice + shipping - discountPercentage).toFixed(2)
    : (subTotalPrice + shipping).toFixed(2);

  return (
    <div className="w-full">
      <div className="block 800px:flex gap-6 items-start">
        <div className="w-full 800px:w-[65%]">
          <ShippingInfo
            user={user}
            country={country}
            setCountry={setCountry}
            city={city}
            setCity={setCity}
            userInfo={userInfo}
            setUserInfo={setUserInfo}
            address1={address1}
            setAddress1={setAddress1}
            address2={address2}
            setAddress2={setAddress2}
            zipCode={zipCode}
            setZipCode={setZipCode}
          />
        </div>
        <div className="w-full 800px:w-[35%] 800px:mt-0 mt-6">
          <CartData
            handleSubmit={handleSubmit}
            totalPrice={totalPrice}
            shipping={shipping}
            subTotalPrice={subTotalPrice}
            couponCode={couponCode}
            setCouponCode={setCouponCode}
            discountPercentage={discountPercentage}
          />
          <button
            type="button"
            className="w-full h-[52px] mt-4 bg-marigold hover:bg-marigold-dark text-espresso font-display font-medium rounded-xl transition-colors"
            onClick={paymentSubmit}
          >
            Go to payment
          </button>
        </div>
      </div>
    </div>
  );
};

const ShippingInfo = ({
  user,
  country,
  setCountry,
  city,
  setCity,
  userInfo,
  setUserInfo,
  address1,
  setAddress1,
  address2,
  setAddress2,
  zipCode,
  setZipCode,
}) => {
  return (
    <div className="w-full bg-white border border-sand shadow-card rounded-2xl p-5 800px:p-6">
      <h5 className="font-display text-[18px] font-semibold text-espresso mb-4">
        Shipping address
      </h5>
      <form>
        <div className="w-full flex gap-4 pb-3">
          <div className="w-[50%]">
            <label className={labelCls}>Full name</label>
            <input
              type="text"
              defaultValue={user && user.name}
              required
              className={styles.input}
            />
          </div>
          <div className="w-[50%]">
            <label className={labelCls}>Email address</label>
            <input
              type="email"
              defaultValue={user && user.email}
              required
              className={styles.input}
            />
          </div>
        </div>

        <div className="w-full flex gap-4 pb-3">
          <div className="w-[50%]">
            <label className={labelCls}>Phone number</label>
            <input
              type="number"
              required
              defaultValue={user && user.phoneNumber}
              className={styles.input}
            />
          </div>
          <div className="w-[50%]">
            <label className={labelCls}>Zip code</label>
            <input
              type="number"
              value={zipCode || ""}
              onChange={(e) => setZipCode(e.target.value)}
              required
              className={styles.input}
            />
          </div>
        </div>

        <div className="w-full flex gap-4 pb-3">
          <div className="w-[50%]">
            <label className={labelCls}>Country</label>
            <select
              className={selectCls}
              value={country}
              onChange={(e) => setCountry(e.target.value)}
            >
              <option value="">Choose your country</option>
              {Country &&
                Country.getAllCountries().map((item) => (
                  <option key={item.isoCode} value={item.isoCode}>
                    {item.name}
                  </option>
                ))}
            </select>
          </div>
          <div className="w-[50%]">
            <label className={labelCls}>City / region</label>
            <select
              className={selectCls}
              value={city}
              onChange={(e) => setCity(e.target.value)}
            >
              <option value="">Choose your city</option>
              {State &&
                State.getStatesOfCountry(country).map((item) => (
                  <option key={item.isoCode} value={item.isoCode}>
                    {item.name}
                  </option>
                ))}
            </select>
          </div>
        </div>

        <div className="w-full flex gap-4 pb-1">
          <div className="w-[50%]">
            <label className={labelCls}>Address line 1</label>
            <input
              type="text"
              required
              value={address1}
              onChange={(e) => setAddress1(e.target.value)}
              className={styles.input}
            />
          </div>
          <div className="w-[50%]">
            <label className={labelCls}>Address line 2</label>
            <input
              type="text"
              value={address2}
              onChange={(e) => setAddress2(e.target.value)}
              required
              className={styles.input}
            />
          </div>
        </div>
      </form>

      <hr className="seam my-5" />

      <h5
        className="text-[14px] font-medium text-marigold-dark cursor-pointer inline-block hover:text-espresso transition-colors"
        onClick={() => setUserInfo(!userInfo)}
      >
        Choose from saved addresses
      </h5>
      {userInfo && (
        <div className="mt-3 space-y-2">
          {user &&
            user.addresses.map((item, index) => (
              <label
                className="w-full flex items-center gap-3 cursor-pointer text-espresso"
                key={index}
              >
                <input
                  type="checkbox"
                  className="accent-marigold w-4 h-4"
                  value={item.addressType}
                  onClick={() =>
                    setAddress1(item.address1) ||
                    setAddress2(item.address2) ||
                    setZipCode(item.zipCode) ||
                    setCountry(item.country) ||
                    setCity(item.city)
                  }
                />
                {item.addressType}
              </label>
            ))}
        </div>
      )}
    </div>
  );
};

const CartData = ({
  handleSubmit,
  totalPrice,
  shipping,
  subTotalPrice,
  couponCode,
  setCouponCode,
  discountPercentage,
}) => {
  return (
    <div className="w-full bg-white border border-sand shadow-card rounded-2xl p-5 800px:p-6">
      <h2 className="font-display text-[18px] font-semibold text-espresso mb-4">
        Order summary
      </h2>
      <div className="flex justify-between py-1.5 text-[14px]">
        <span className="text-clay">Subtotal</span>
        <span className="font-mono text-espresso">Rs {subTotalPrice}</span>
      </div>
      <div className="flex justify-between py-1.5 text-[14px]">
        <span className="text-clay">Shipping</span>
        <span className="font-mono text-espresso">
          {shipping === 0 ? "Free" : `Rs ${shipping}`}
        </span>
      </div>
      <div className="flex justify-between py-1.5 text-[14px] border-b border-sand pb-3">
        <span className="text-clay">Discount</span>
        <span className="font-mono text-espresso">
          {discountPercentage ? "− Rs " + discountPercentage.toString() : "—"}
        </span>
      </div>
      <div className="flex justify-between items-baseline pt-3 mb-4">
        <span className="font-medium text-espresso">Total</span>
        <span className="font-mono font-semibold text-[20px] text-espresso">
          Rs {totalPrice}
        </span>
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          className="flex-1 min-w-0 h-[44px] px-3 bg-bone border border-sand focus:border-marigold rounded-lg transition-colors"
          placeholder="Coupon code"
          value={couponCode}
          onChange={(e) => setCouponCode(e.target.value)}
          required
        />
        <input
          className="px-4 h-[44px] rounded-lg border border-espresso text-espresso hover:bg-espresso hover:text-bone transition-colors cursor-pointer text-[14px] shrink-0"
          required
          value="Apply"
          type="submit"
        />
      </form>
    </div>
  );
};
export default Checkout;
