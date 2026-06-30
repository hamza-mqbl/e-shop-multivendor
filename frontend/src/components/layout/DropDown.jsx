import React from "react";
import { useNavigate } from "react-router-dom";
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
import { FaChild, FaRunning } from "react-icons/fa";

// Same footwear icons as the homepage category grid, keyed by title
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

const DropDown = ({ categoriesData, setDropDown }) => {
  const navigate = useNavigate();
  const submitHandle = (i) => {
    navigate(`/products?category=${i.title}`);
    setDropDown(false);
    window.location.reload();
  };
  return (
    <div className="pb-2 w-[270px] bg-white border border-sand absolute right-0 top-full mt-2 z-40 rounded-xl shadow-card overflow-hidden">
      {categoriesData &&
        categoriesData.map((i, index) => {
          const Icon = categoryIcons[i.title] || GiConverseShoe;
          return (
            <div
              key={index}
              className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-bone transition-colors"
              onClick={() => submitHandle(i)}
            >
              <span className="text-marigold-dark text-[22px] shrink-0">
                <Icon />
              </span>
              <h3 className="text-[15px] text-espresso cursor-pointer select-none">
                {i.title}
              </h3>
            </div>
          );
        })}
    </div>
  );
};

export default DropDown;
