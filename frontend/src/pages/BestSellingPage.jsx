import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Header from "../components/layout/Header";
import ProductCard from "../components/Route/ProductCard/ProductCard";
import styles from "../styles/styles";
import Footer from "../components/layout/Footer";

const BestSellingPage = () => {
  const [data, setData] = useState([]);
  const { allProducts } = useSelector((state) => state.products);

  useEffect(() => {
    const sorted =
      allProducts &&
      [...allProducts].sort((a, b) => (b.sold_out || 0) - (a.sold_out || 0));
    setData(sorted || []);
    window.scrollTo(0, 0);
  }, [allProducts]);

  return (
    <div className="bg-bone min-h-screen">
      <Header activeHeading={0} />
      <div className={`${styles.section} py-8 800px:py-12`}>
        <p className="font-mono text-[12px] uppercase tracking-[0.2em] text-marigold-dark">
          Customer favourites
        </p>
        <h1 className="font-display text-[28px] font-semibold text-espresso mb-8">
          Best sellers
        </h1>
        {data && data.length > 0 ? (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-[25px] lg:grid-cols-4 xl:grid-cols-5 xl:gap-[30px]">
            {data.map((i, index) => (
              <ProductCard data={i} key={index} />
            ))}
          </div>
        ) : (
          <div className="bg-white border border-sand rounded-2xl shadow-card py-20 text-center">
            <p className="text-espresso font-display font-medium text-[18px]">
              Nothing here yet
            </p>
            <p className="text-clay text-[14px] mt-1">
              Check back once shoppers start buying.
            </p>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default BestSellingPage;
