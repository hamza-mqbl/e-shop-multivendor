import React, { useEffect, useState } from "react";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import ProductDetails from "../components/Products/ProductDetails.jsx";
import { useParams } from "react-router-dom";
import SuggestedProduct from "../components/Products/SuggestedProduct.jsx";
import {  useSelector } from "react-redux";
// import Loader from "./components/layout/Loader.jsx";
import Loader from "../components/layout/Loader.jsx";

const ProductDetailsPage = () => {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const { allProducts } = useSelector((state) => state.products);

  useEffect(() => {
    console.log("🚀 ~ useEffect ~ allProducts:", allProducts);
    console.log("🚀 ~ useEffect ~ id:", id);

    if (allProducts.length > 0 && id) {
      const foundData = allProducts.find((i) => i._id === id);
      console.log("🚀 ~ useEffect ~ foundData:", foundData);

      setData(foundData);
    }
  }, [allProducts, id]);

  useEffect(() => {
    console.log("🚀 ~ ProductDetailsPage ~ data (inside useEffect):", data);
  }, [data]);

  return (
    <div>
      <Header />
      {data ? (
        <>
          <ProductDetails data={data} />
          <SuggestedProduct data={data} />
        </>
      ) : (
        <Loader />
      )}
      <Footer />
    </div>
  );
};

export default ProductDetailsPage;
