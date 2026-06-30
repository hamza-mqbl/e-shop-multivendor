import React, { useEffect, useState } from "react";
import styles from "../../styles/styles";
import {
  CardNumberElement,
  CardCvcElement,
  CardExpiryElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { server } from "../../server";
import { toast } from "react-toastify";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { RxCross1 } from "react-icons/rx";

const Payment = () => {
  const { user } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const stripe = useStripe();
  const elements = useElements();
  const [open, setOpen] = useState(false);
  const [orderData, setOrderData] = useState([]);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("latestOrder"));
    setOrderData(data);
  }, []);

  const createOrder = (data, actions) => {
    return actions.order
      .create({
        purchase_units: [
          {
            description: "Qadam order",
            amount: {
              currency_code: "USD",
              value: orderData?.totalPrice,
            },
          },
        ],
      })
      .then((orderId) => {
        return orderId;
      });
  };

  const onApprove = async (data, actions) => {
    return actions.order.capture().then(function (details) {
      const { payer } = details;
      let paymentInfo = payer;
      if (paymentInfo !== undefined) {
        paypalPayementHandler(paymentInfo);
      }
    });
  };

  const paypalPayementHandler = async (paymentInfo) => {
    const config = {
      headers: { "Content-Type": "application/json" },
    };
    order.paymentInfo = {
      id: paymentInfo.payer_id,
      status: "succeeded",
      type: "Paypal",
    };
    await axios
      .post(`${server}/order/create-order`, order, config)
      .then((res) => {
        setOpen(false);
        navigate("/order/success");
        toast.success("Order placed successfully!");
        localStorage.setItem("cartItems", JSON.stringify([]));
        localStorage.setItem("latestOrder", JSON.stringify([]));
        window.location.reload();
      });
  };

  const paymentData = {
    amount: Math.round(orderData?.totalPrice * 100),
  };
  const order = {
    cart: orderData?.cart,
    shippingAddress: orderData?.shippingAddress,
    user: user && user,
    totalPrice: orderData?.totalPrice,
  };

  const paymentHandler = async (e) => {
    e.preventDefault();
    try {
      const config = {
        headers: { "Content-Type": "application/json" },
      };
      const { data } = await axios.post(
        `${server}/payment/process`,
        paymentData,
        config
      );
      const client_secret = data.client_secret;
      if (!stripe || !elements) return;
      const result = await stripe.confirmCardPayment(client_secret, {
        payment_method: {
          card: elements.getElement(CardNumberElement),
        },
      });
      if (result.error) {
        toast.error(result.error.message);
      } else {
        if (result.paymentIntent.status === "succeeded") {
          order.paymentInfo = {
            id: result.paymentIntent.id,
            status: result.paymentIntent.status,
            type: "Credit Card",
          };
          await axios
            .post(`${server}/order/create-order`, order, config)
            .then((res) => {
              setOpen(false);
              navigate("/order/success");
              toast.success("Order placed successfully!");
              localStorage.setItem("cartItems", JSON.stringify([]));
              localStorage.setItem("latestOrder", JSON.stringify([]));
              window.location.reload();
            });
        }
      }
    } catch (error) {
      toast.error(error);
    }
  };

  const cashOnDeliveryHandler = async (e) => {
    e.preventDefault();
    order.paymentInfo = { type: "Cash on Delivery" };
    const config = {
      headers: { "Content-Type": "application/json" },
    };
    await axios
      .post(`${server}/order/create-order`, order, config)
      .then((res) => {
        setOpen(false);
        navigate("/order/success");
        toast.success("Order placed successfully!");
        localStorage.setItem("cartItems", JSON.stringify([]));
        localStorage.setItem("latestOrder", JSON.stringify([]));
        window.location.reload();
      });
  };

  return (
    <div className="w-full block 800px:flex gap-6 items-start">
      <div className="w-full 800px:w-[65%]">
        <PaymentInfo
          user={user}
          open={open}
          setOpen={setOpen}
          onApprove={onApprove}
          createOrder={createOrder}
          paymentHandler={paymentHandler}
          cashOnDeliveryHandler={cashOnDeliveryHandler}
        />
      </div>
      <div className="w-full 800px:w-[35%] 800px:mt-0 mt-6">
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

const cardStyle = {
  base: { fontSize: "16px", lineHeight: 1.5, color: "#241A14" },
  empty: { color: "#241A14", "::placeholder": { color: "#8C7A6B" } },
};
const payBtn =
  "w-full h-[48px] bg-marigold hover:bg-marigold-dark text-espresso font-display font-medium rounded-xl cursor-pointer transition-colors";

const PaymentInfo = ({
  user,
  open,
  setOpen,
  onApprove,
  createOrder,
  paymentHandler,
  cashOnDeliveryHandler,
}) => {
  const [select, setSelect] = useState(1);

  return (
    <div className="w-full bg-white border border-sand shadow-card rounded-2xl p-5 800px:p-6">
      {/* card */}
      <div>
        <button
          type="button"
          className="flex items-center gap-3 w-full pb-4 border-b border-sand"
          onClick={() => setSelect(1)}
        >
          <Radio selected={select === 1} />
          <h4 className="text-[16px] font-display font-medium text-espresso">
            Debit / credit card
          </h4>
        </button>

        {select === 1 ? (
          <div className="w-full pt-4 pb-5 border-b border-sand">
            <form className="w-full" onSubmit={paymentHandler}>
              <div className="w-full flex gap-4 pb-3">
                <div className="w-[50%]">
                  <label className="block pb-1 text-[14px] font-medium text-espresso">
                    Name on card
                  </label>
                  <input
                    required
                    placeholder={user && user.name}
                    className={styles.input}
                    value={user && user.name}
                    readOnly
                  />
                </div>
                <div className="w-[50%]">
                  <label className="block pb-1 text-[14px] font-medium text-espresso">
                    Expiry date
                  </label>
                  <CardExpiryElement
                    className={`${styles.input} !py-3`}
                    options={{ style: cardStyle }}
                  />
                </div>
              </div>

              <div className="w-full flex gap-4 pb-4">
                <div className="w-[50%]">
                  <label className="block pb-1 text-[14px] font-medium text-espresso">
                    Card number
                  </label>
                  <CardNumberElement
                    className={`${styles.input} !py-3`}
                    options={{ style: cardStyle }}
                  />
                </div>
                <div className="w-[50%]">
                  <label className="block pb-1 text-[14px] font-medium text-espresso">
                    CVV
                  </label>
                  <CardCvcElement
                    className={`${styles.input} !py-3`}
                    options={{ style: cardStyle }}
                  />
                </div>
              </div>
              <input type="submit" value="Pay now" className={payBtn} />
            </form>
          </div>
        ) : null}
      </div>

      {/* paypal */}
      <div className="mt-5">
        <button
          type="button"
          className="flex items-center gap-3 w-full pb-4 border-b border-sand"
          onClick={() => setSelect(2)}
        >
          <Radio selected={select === 2} />
          <h4 className="text-[16px] font-display font-medium text-espresso">
            PayPal
          </h4>
        </button>

        {select === 2 ? (
          <div className="w-full pt-4 pb-5 border-b border-sand">
            <button
              type="button"
              className={payBtn}
              onClick={() => setOpen(true)}
            >
              Pay now
            </button>
            {open && (
              <div className="w-full fixed top-0 left-0 bg-espresso/40 backdrop-blur-sm h-screen flex items-center justify-center z-[99999]">
                <div className="w-full 800px:w-[40%] h-screen 800px:h-[80vh] bg-white rounded-2xl shadow-cardHover flex flex-col justify-center p-8 relative overflow-y-scroll">
                  <RxCross1
                    size={26}
                    className="cursor-pointer absolute top-4 right-4 text-clay"
                    onClick={() => setOpen(false)}
                  />
                  <PayPalScriptProvider
                    options={{
                      "client-id":
                        "ASEwIwBSNLyGNzOquq0UQW5IljQ7JkYZmjcq1KrOCLPaol_4tZsYej_Vm9_lMwoHi8USY8-2avFTcHlh",
                    }}
                  >
                    <PayPalButtons
                      style={{ layout: "vertical" }}
                      onApprove={onApprove}
                      createOrder={createOrder}
                    />
                  </PayPalScriptProvider>
                </div>
              </div>
            )}
          </div>
        ) : null}
      </div>

      {/* cash on delivery */}
      <div className="mt-5">
        <button
          type="button"
          className="flex items-center gap-3 w-full pb-4 border-b border-sand"
          onClick={() => setSelect(3)}
        >
          <Radio selected={select === 3} />
          <h4 className="text-[16px] font-display font-medium text-espresso">
            Cash on delivery
          </h4>
        </button>

        {select === 3 ? (
          <div className="w-full pt-4">
            <p className="text-[14px] text-clay mb-3">
              Pay in cash when your order arrives at your door.
            </p>
            <form className="w-full" onSubmit={cashOnDeliveryHandler}>
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
