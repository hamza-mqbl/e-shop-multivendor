import React, { useEffect } from "react";
import ShopCreate from "../components/Shop/ShopCreate.jsx";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
const ShopCreatePage = () => {
  const navigate = useNavigate();
  const { isSeller, seller } = useSelector((state) => state.seller);

  useEffect(() => {
    if (isSeller === true) {
      navigate(`/dashboard`);
    }
  }, []);
  return (
    <div>
      <ShopCreate />
    </div>
  );
};

export default ShopCreatePage;
