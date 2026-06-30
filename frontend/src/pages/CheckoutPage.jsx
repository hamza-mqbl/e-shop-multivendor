import React from "react";
import Header from "../components/layout/Header";
import Checkout from "../components/Checkout/Checkout";
import Footer from "../components/layout/Footer";
import CheckoutSteps from "../components/Checkout/CheckoutSteps.jsx";

const CheckoutPage = () => {
  return (
    <div className="bg-bone min-h-screen">
      <Header />
      <div className="w-11/12 max-w-[1100px] mx-auto py-8 800px:py-12">
        <h1 className="font-display text-[28px] font-semibold text-espresso mb-6 text-center">
          Checkout
        </h1>
        <CheckoutSteps active={1} />
        <Checkout />
      </div>
      <Footer />
    </div>
  );
};

export default CheckoutPage;
