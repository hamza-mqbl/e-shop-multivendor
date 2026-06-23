import React, { useState, useEffect } from "react";
import styles from "../../../styles/styles";
import ProductCard from "../ProductCard/ProductCard.jsx";
import { useSelector } from "react-redux";
const BestDeal = () => {
  const [data, setData] = useState([]);
  const { allProducts } = useSelector((state) => state.products);
  useEffect(() => {
    const allProductsData = allProducts ? [...allProducts] : [];
    const sortedData = allProductsData?.sort((a,b) => b.sold_out - a.sold_out); 
    const firstFive = sortedData && sortedData.slice(0, 5);
    setData(firstFive);
  }, [allProducts]);

  return (
    <div className={`${styles.section}`}>
      <div className={`${styles.heading}`}>
        <h1>Best Deals</h1>
      </div>
      <div className="relative overflow-hidden">
        {/* edge fades */}
        <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-bone to-transparent z-10" />
        <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-bone to-transparent z-10" />
        {data && data.length > 0 && (
          <div className="marquee-track gap-5 py-2">
            {[...data, ...data].map((i, index) => (
              <div className="w-[230px] shrink-0" key={index}>
                <ProductCard data={i} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BestDeal;
