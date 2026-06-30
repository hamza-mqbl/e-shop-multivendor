import React from "react";
import Header from "../components/layout/Header";
import CheckoutSteps from "../components/Checkout/CheckoutSteps";
import Footer from "../components/layout/Footer";
import Payment from "../components/Payment/Payment.jsx";

const PaymentPage = () => {
  return (
    <div className="bg-bone min-h-screen">
      <Header />
      <div className="w-11/12 max-w-[1100px] mx-auto py-8 800px:py-12">
        <h1 className="font-display text-[28px] font-semibold text-espresso mb-6 text-center">
          Payment
        </h1>
        <CheckoutSteps active={2} />
        <Payment />
      </div>
      <Footer />
    </div>
  );
};

export default PaymentPage;
