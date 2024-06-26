import React from "react";
import DashboardHeader from "../../components/Shop/Layout/DashboardHeader";
import OrderDetails from "../../components/Shop/OrderDetails.jsx"
import Footer from "../../components/layout/Footer.jsx";
const ShopCreateProduct = () => {
  return (
    <div>
      <DashboardHeader />
      <OrderDetails/>
      <Footer/>
    </div>
  );
};

export default ShopCreateProduct;
