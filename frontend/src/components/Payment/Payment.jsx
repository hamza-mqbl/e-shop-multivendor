import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { server } from "../../server";
import { toast } from "react-toastify";

const Payment = () => {
  const { user } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [orderData, setOrderData] = useState(null);

  useEffect(() => {
    setOrderData(JSON.parse(localStorage.getItem("latestOrder")));
  }, []);

  // surface a failed/invalid JazzCash return
  useEffect(() => {
    const status = new URLSearchParams(window.location.search).get("status");
    if (status === "failed")
      toast.error("Payment wasn't completed. Please try again.");
    else if (status === "invalid")
      toast.error("We couldn't verify that payment. Please try again.");
  }, []);

  // ── JazzCash: ask the server for a signed field set, then POST to the
  //    hosted payment page (we never handle card/wallet details ourselves).
  const jazzcashHandler = async () => {
    try {
      const { data } = await axios.post(
        `${server}/jazzcash/initiate`,
        {
          cart: orderData?.cart,
          shippingAddress: orderData?.shippingAddress,
          user,
        },
        { withCredentials: true }
      );
      const form = document.createElement("form");
      form.method = "POST";
      form.action = data.url;
      Object.entries(data.params).forEach(([name, value]) => {
        const input = document.createElement("input");
        input.type = "hidden";
        input.name = name;
        input.value = value ?? "";
        form.appendChild(input);
      });
      document.body.appendChild(form);
      form.submit();
    } catch (err) {
      toast.error(
        err?.response?.data?.message || "Couldn't start the JazzCash payment"
      );
    }
  };

  // ── Cash on delivery: create the order straight away.
  const cashOnDeliveryHandler = async (e) => {
    e.preventDefault();
    const order = {
      cart: orderData?.cart,
      shippingAddress: orderData?.shippingAddress,
      user,
      totalPrice: orderData?.totalPrice,
      paymentInfo: { type: "Cash on Delivery" },
    };
    try {
      await axios.post(`${server}/order/create-order`, order, {
        headers: { "Content-Type": "application/json" },
      });
      navigate("/order/success");
      toast.success("Order placed successfully!");
      localStorage.setItem("cartItems", JSON.stringify([]));
      localStorage.setItem("latestOrder", JSON.stringify([]));
    } catch (err) {
      toast.error(err?.response?.data?.message || "Could not place the order");
    }
  };

  return (
    <div className="w-full block 800px:flex gap-6 items-start">
      <div className="flex-1 min-w-0">
        <PaymentInfo
          jazzcashHandler={jazzcashHandler}
          cashOnDeliveryHandler={cashOnDeliveryHandler}
        />
      </div>
      <div className="w-full 800px:w-[340px] shrink-0 800px:mt-0 mt-6">
        <CartData orderData={orderData} />
      </div>
    </div>
  );
};

const Radio = ({ selected }) => (
  <span
    className={`w-[22px] h-[22px] rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
      selected ? "border-marigold" : "border-clay"
    }`}
  >
    {selected && <span className="w-[11px] h-[11px] bg-marigold rounded-full" />}
  </span>
);

const payBtn =
  "w-full h-[48px] bg-marigold hover:bg-marigold-dark text-espresso font-display font-medium rounded-xl cursor-pointer transition-colors";

const PaymentInfo = ({ jazzcashHandler, cashOnDeliveryHandler }) => {
  const [select, setSelect] = useState(1);

  return (
    <div className="w-full bg-white border border-sand shadow-card rounded-2xl p-5 800px:p-6">
      {/* JazzCash */}
      <div className="border-b border-sand">
        <button
          type="button"
          className="flex items-center gap-3 w-full py-4"
          onClick={() => setSelect(1)}
        >
          <Radio selected={select === 1} />
          <h4 className="text-[16px] font-display font-medium text-espresso">
            JazzCash — card or mobile wallet
          </h4>
        </button>
        {select === 1 ? (
          <div className="w-full pb-5">
            <p className="text-[14px] text-clay mb-3">
              You'll be taken to JazzCash's secure page to pay with your card,
              JazzCash wallet or bank account, then returned here.
            </p>
            <button type="button" className={payBtn} onClick={jazzcashHandler}>
              Pay with JazzCash
            </button>
          </div>
        ) : null}
      </div>

      {/* Cash on delivery */}
      <div>
        <button
          type="button"
          className="flex items-center gap-3 w-full py-4"
          onClick={() => setSelect(2)}
        >
          <Radio selected={select === 2} />
          <h4 className="text-[16px] font-display font-medium text-espresso">
            Cash on delivery
          </h4>
        </button>
        {select === 2 ? (
          <div className="w-full pb-4">
            <p className="text-[14px] text-clay mb-3">
              Pay in cash when your order arrives at your door.
            </p>
            <form onSubmit={cashOnDeliveryHandler}>
              <input type="submit" value="Confirm order" className={payBtn} />
            </form>
          </div>
        ) : null}
      </div>
    </div>
  );
};

const CartData = ({ orderData }) => {
  return (
    <div className="w-full bg-white border border-sand shadow-card rounded-2xl p-5 800px:p-6">
      <h2 className="font-display text-[18px] font-semibold text-espresso mb-4">
        Order summary
      </h2>
      <div className="flex justify-between py-1.5 text-[14px]">
        <span className="text-clay">Subtotal</span>
        <span className="font-mono text-espresso">
          Rs {orderData?.subTotalPrice}
        </span>
      </div>
      <div className="flex justify-between py-1.5 text-[14px]">
        <span className="text-clay">Shipping</span>
        <span className="font-mono text-espresso">
          {orderData?.shipping ? `Rs ${orderData?.shipping}` : "Free"}
        </span>
      </div>
      <div className="flex justify-between py-1.5 text-[14px] border-b border-sand pb-3">
        <span className="text-clay">Discount</span>
        <span className="font-mono text-espresso">
          {orderData?.discountPrice ? "− Rs " + orderData?.discountPrice : "—"}
        </span>
      </div>
      <div className="flex justify-between items-baseline pt-3">
        <span className="font-medium text-espresso">Total</span>
        <span className="font-mono font-semibold text-[20px] text-espresso">
          Rs {orderData?.totalPrice}
        </span>
      </div>
    </div>
  );
};

export default Payment;
