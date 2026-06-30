import React from "react";
import { Link } from "react-router-dom";
import Footer from "../components/layout/Footer";
import Header from "../components/layout/Header";
import Lottie from "react-lottie";
import animationData from "../Assests/animations/107043-success.json";

const OrderSuccessPage = () => {
  const defaultOptions = {
    loop: false,
    autoplay: true,
    animationData,
    rendererSettings: { preserveAspectRatio: "xMidYMid slice" },
  };

  return (
    <div className="bg-bone min-h-screen flex flex-col">
      <Header />
      <div className="flex-1 flex flex-col items-center justify-center py-16 px-4 text-center">
        <Lottie options={defaultOptions} width={260} height={260} />
        <h1 className="font-display text-[26px] font-semibold text-espresso mt-2">
          Order placed 🎉
        </h1>
        <p className="text-clay mt-2 max-w-[440px]">
          Thank you for shopping with Qadam. Your order is confirmed — we'll let
          you know as soon as it's on the way.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3 mt-8">
          <Link to="/products">
            <span className="inline-flex items-center justify-center h-[48px] px-7 rounded-xl bg-espresso hover:bg-coffee text-bone font-display font-medium transition-colors">
              Continue shopping
            </span>
          </Link>
          <Link to="/profile">
            <span className="inline-flex items-center justify-center h-[48px] px-7 rounded-xl border border-espresso text-espresso hover:bg-espresso hover:text-bone font-display font-medium transition-colors">
              View my orders
            </span>
          </Link>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default OrderSuccessPage;
