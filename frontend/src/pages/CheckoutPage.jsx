import React from "react";
import Header from "../components/layout/Header";
import Checkout from "../components/Checkout/Checkout";
import Footer from "../components/layout/Footer";
import CheckoutSteps from "../components/Checkout/CheckoutSteps.jsx"
const CheckoutPage = () => {
  return (
    <div>
      <Header />
      <br />
      <br />
      <CheckoutSteps active={1}/>
      <Checkout />
      <br />
      <br />
      <Footer />
    </div>
  );
};

export default CheckoutPage;
