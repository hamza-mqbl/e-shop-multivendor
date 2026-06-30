import React from "react";
import { AiOutlineFolder, AiOutlineGift } from "react-icons/ai";
import { FiPackage, FiShoppingBag } from "react-icons/fi";
import { MdOutlineLocalOffer } from "react-icons/md";
import { RxDashboard } from "react-icons/rx";
import { Link } from "react-router-dom";
import { CiMoneyBill, CiSettings } from "react-icons/ci";
import { VscNewFile } from "react-icons/vsc";
import { BiMessageSquareDetail } from "react-icons/bi";
import { HiOutlineReceiptRefund } from "react-icons/hi";

const items = [
  { id: 1, label: "Dashboard", icon: RxDashboard, url: "/dashboard" },
  { id: 2, label: "All Orders", icon: FiShoppingBag, url: "/dashboard-orders" },
  { id: 3, label: "All Products", icon: FiPackage, url: "/dashboard-products" },
  { id: 4, label: "Create Product", icon: AiOutlineFolder, url: "/dashboard-create-product" },
  { id: 5, label: "All Events", icon: MdOutlineLocalOffer, url: "/dashboard-events" },
  { id: 6, label: "Create Event", icon: VscNewFile, url: "/dashboard-create-event" },
  { id: 7, label: "Withdraw Money", icon: CiMoneyBill, url: "/dashboard-withdraw-money" },
  { id: 8, label: "Shop Inbox", icon: BiMessageSquareDetail, url: "/dashboard-messages" },
  { id: 9, label: "Discount Codes", icon: AiOutlineGift, url: "/dashboard-cupouns" },
  { id: 10, label: "Refunds", icon: HiOutlineReceiptRefund, url: "/dashboard-refunds" },
  { id: 11, label: "Settings", icon: CiSettings, url: "/settings" },
];

const DashboardSideBar = ({ active }) => {
  return (
    <div className="w-full h-[calc(100vh-80px)] bg-white border-r border-sand overflow-y-auto sticky top-[80px] z-20 py-3">
      {items.map(({ id, label, icon: Icon, url }) => {
        const isActive = active === id;
        return (
          <Link
            key={id}
            to={url}
            className={`flex items-center gap-3 mx-2 px-3 py-3 rounded-xl mb-1 transition-colors ${
              isActive
                ? "bg-marigold/15 text-marigold-dark border-l-2 border-marigold"
                : "text-espresso/70 hover:bg-bone hover:text-espresso"
            }`}
          >
            <Icon size={22} className="shrink-0" />
            <span className="hidden 800px:block font-medium text-[15px]">
              {label}
            </span>
          </Link>
        );
      })}
    </div>
  );
};

export default DashboardSideBar;
