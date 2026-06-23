import React from "react";
import { useNavigate } from "react-router-dom";
import { brandingData, categoriesData } from "../../../static/data";
import styles from "../../../styles/styles";
import {
  GiLeatherBoot,
  GiConverseShoe,
  GiRunningShoe,
  GiSandal,
  GiFlipFlops,
  GiSlippers,
  GiHighHeel,
  GiBallerinaShoes,
} from "react-icons/gi";
import { FaChild, FaRunning, FaShoePrints } from "react-icons/fa";

// Map each shoe category to a footwear icon — the tiles read at a glance.
const categoryIcons = {
  "Men's Formal": GiLeatherBoot,
  "Men's Casual": GiConverseShoe,
  Sneakers: GiRunningShoe,
  "Sandals & Slides": GiSandal,
  Chappals: GiFlipFlops,
  "Peshawari & Khussa": GiSlippers,
  "Women's Heels": GiHighHeel,
  "Women's Flats": GiBallerinaShoes,
  Kids: FaChild,
  Sports: FaRunning,
};

const Categories = () => {
  const navigate = useNavigate();
  return (
    <>
      {/* Trust strip — stitched seams between each promise */}
      <div className={`${styles.section} hidden sm:block`}>
        <div className="branding my-12 flex justify-between w-full bg-white border border-sand rounded-2xl shadow-card px-5 py-6 divide-x divide-dashed divide-sand">
          {brandingData &&
            brandingData.map((i, index) => (
              <div className="flex items-start px-4 first:pl-0 last:pr-0" key={index}>
                {i.icon}
                <div className="px-3">
                  <h3 className="font-display font-semibold text-sm md:text-base text-espresso">
                    {i.title}
                  </h3>
                  <p className="text-xs md:text-sm text-clay">{i.Description}</p>
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* Shop by category */}
      <div className={`${styles.section} mb-12`} id="categories">
        <div className="flex items-end justify-between mb-6">
          <div>
            <p className="font-mono text-[12px] uppercase tracking-[0.2em] text-marigold-dark">
              Find your fit
            </p>
            <h2 className="font-display text-[28px] font-semibold text-espresso">
              Shop by category
            </h2>
          </div>
          <FaShoePrints className="text-sand text-[34px] rotate-[15deg] hidden md:block" />
        </div>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
          {categoriesData &&
            categoriesData.map((i) => {
              const Icon = categoryIcons[i.title] || GiConverseShoe;
              const handleSubmit = () => {
                navigate(`/products?category=${i.title}`);
              };
              return (
                <button
                  type="button"
                  className="group w-full flex flex-col items-center justify-center gap-3 bg-white border border-sand rounded-xl py-7 px-3 cursor-pointer transition-all duration-200 hover:border-marigold hover:shadow-card hover:-translate-y-1 hover:border-dashed"
                  key={i.id}
                  onClick={handleSubmit}
                >
                  <span className="flex items-center justify-center w-14 h-14 rounded-full bg-bone text-espresso text-[30px] transition-colors group-hover:bg-marigold/15 group-hover:text-marigold-dark">
                    <Icon />
                  </span>
                  <h5 className="font-display text-[15px] font-medium text-espresso text-center leading-tight">
                    {i.title}
                  </h5>
                </button>
              );
            })}
        </div>
      </div>
    </>
  );
};

export default Categories;
