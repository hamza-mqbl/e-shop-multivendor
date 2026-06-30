import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import ProductCard from "../components/Route/ProductCard/ProductCard";
import styles from "../styles/styles";

const ProductsPage = () => {
  const [searchParams] = useSearchParams();
  const categoryData = searchParams.get("category");
  const { allProducts } = useSelector((state) => state.products);
  const [data, setData] = useState([]);
  const [sort, setSort] = useState("popular");

  useEffect(() => {
    if (categoryData === null) {
      setData(allProducts ? [...allProducts] : []);
    } else {
      setData(
        allProducts
          ? [...allProducts].filter((i) => i.category === categoryData)
          : []
      );
    }
    window.scrollTo(0, 0);
  }, [allProducts, categoryData]);

  const sorted = [...(data || [])].sort((a, b) => {
    if (sort === "priceLow") return a.discountPrice - b.discountPrice;
    if (sort === "priceHigh") return b.discountPrice - a.discountPrice;
    if (sort === "rating") return (b.ratings || 0) - (a.ratings || 0);
    return (b.sold_out || 0) - (a.sold_out || 0); // popular
  });

  return (
    <div className="bg-bone min-h-screen">
      <Header activeHeading={2} />
      <div className={`${styles.section} py-8 800px:py-12`}>
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
          <div>
            <p className="font-mono text-[12px] uppercase tracking-[0.2em] text-marigold-dark">
              {categoryData ? "Category" : "Catalogue"}
            </p>
            <h1 className="font-display text-[28px] font-semibold text-espresso">
              {categoryData || "All shoes"}
            </h1>
            <p className="text-clay text-[14px] mt-1">
              {sorted.length} {sorted.length === 1 ? "product" : "products"}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <label className="text-[13px] text-clay">Sort by</label>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="h-[42px] px-3 bg-white border border-sand focus:border-marigold rounded-lg transition-colors text-[14px]"
            >
              <option value="popular">Most popular</option>
              <option value="priceLow">Price: low to high</option>
              <option value="priceHigh">Price: high to low</option>
              <option value="rating">Top rated</option>
            </select>
          </div>
        </div>

        {sorted.length > 0 ? (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-[25px] lg:grid-cols-4 xl:grid-cols-5 xl:gap-[30px]">
            {sorted.map((i, index) => (
              <ProductCard data={i} key={index} />
            ))}
          </div>
        ) : (
          <div className="bg-white border border-sand rounded-2xl shadow-card py-20 text-center">
            <p className="text-espresso font-display font-medium text-[18px]">
              No shoes found here yet
            </p>
            <p className="text-clay text-[14px] mt-1">
              Try another category or check back soon.
            </p>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default ProductsPage;
