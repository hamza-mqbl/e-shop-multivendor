import React, { useEffect, useState } from "react";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import ProductDetails from "../components/Products/ProductDetails.jsx";
import { useParams, useSearchParams } from "react-router-dom";
import SuggestedProduct from "../components/Products/SuggestedProduct.jsx";
import { useSelector } from "react-redux";
// import Loader from "./components/layout/Loader.jsx";
import Loader from "../components/layout/Loader.jsx";

const ProductDetailsPage = () => {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const { allProducts } = useSelector((state) => state.products);
  const { allEvents } = useSelector((state) => state.events);
  console.log("🚀 ~ ProductDetailsPage ~ allEvents:", allEvents);

  const [searchParams] = useSearchParams();
  const eventData = searchParams.get("isEvent");
  console.log("🚀 ~ ProductDetailsPage ~ eventData:", eventData);
  useEffect(() => {
    console.log("🚀 ~ useEffect ~ allProducts:", allProducts);
    console.log("🚀 ~ useEffect ~ id:", id);
    if (eventData == null) {
      if (allProducts?.length > 0 && id) {
        const foundData = allProducts.find((i) => i._id === id);
        setData(foundData);
      }
    } else if (allEvents.length > 0) {
      const foundData = allEvents.find((i) => i._id === id);
      setData(foundData);
    }
  }, [allProducts, allEvents, id, eventData]);

  useEffect(() => {
    console.log("🚀 ~ ProductDetailsPage ~ data (inside useEffect):", data);
  }, [data]);

  return (
    <div>
      <Header />
      {data ? (
        <>
          <ProductDetails data={data} />
          {!eventData && <>{<SuggestedProduct data={data} />}</>}
        </>
      ) : (
        <Loader />
      )}
      <Footer />
    </div>
  );
};

export default ProductDetailsPage;
