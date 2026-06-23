import React from "react";
import { AiOutlineGift } from "react-icons/ai";
import { MdOutlineLocalOffer } from "react-icons/md";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { FiPackage, FiShoppingBag } from "react-icons/fi";
import { BiMessageSquareDetail } from "react-icons/bi";
import { FaShoePrints } from "react-icons/fa";
import { backend_url } from "../../../server";
const DashboardHeader = () => {
  const { seller } = useSelector((state) => state.seller);
  if (!seller) {
    // You can add a loading state or render a loading indicator here
    return null;
  }
  return (
    <div className="w-full h-[80px] bg-white shadow sticky top-0 left-0 z-30 flex items-center justify-between px-4">
      <div>
        <Link to="/dashboard" className="flex items-center gap-2">
          <FaShoePrints className="text-marigold text-[22px] -rotate-12" />
          <span className="font-display text-[24px] font-semibold text-espresso leading-none">
            Qadam
          </span>
          <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-clay border border-sand rounded px-1.5 py-0.5">
            Seller
          </span>
        </Link>
      </div>
      <div className="flex items-center">
        <div className="flex items-center mr-4">
          <Link to="/dashboard/cupouns" className="800px:block hidden">
            <AiOutlineGift
              color="#555"
              size={30}
              className="mx-5 cursor-pointer"
            />
          </Link>
          <Link to="/dashboard-events" className="800px:block hidden">
            <MdOutlineLocalOffer
              color="#555"
              size={30}
              className="mx-5 cursor-pointer"
            />
          </Link>
          <Link to="/dashboard-products" className="800px:block hidden">
            <FiShoppingBag
              color="#555"
              size={30}
              className="mx-5 cursor-pointer"
            />
          </Link>
          <Link to="/dashboard-orders" className="800px:block hidden">
            <FiPackage color="#555" size={30} className="mx-5 cursor-pointer" />
          </Link>
          <Link to="/dashboard-messages">
            <BiMessageSquareDetail
              color="#555"
              size={30}
              className="mx-5 cursor-pointer"
            />
          </Link>
          <Link to={`/shop/${seller._id}`}>
            <img
              src={`${seller?.avatar?.url}`}
              alt=""
              className="w-[50px] h-[50px] rounded-full object-cover border-2 border-marigold"
            />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;
