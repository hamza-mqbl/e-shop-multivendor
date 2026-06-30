import React from "react";
import { AiOutlineLogin, AiOutlineMessage } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import { MdOutlineTrackChanges } from "react-icons/md";
import { RxPerson } from "react-icons/rx";
import { HiOutlineReceiptRefund, HiOutlineShoppingBag } from "react-icons/hi";
import { TbAddressBook } from "react-icons/tb";
import { RiLockPasswordLine } from "react-icons/ri";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import axios from "axios";
import { server } from "../../server";

const ProfileSidebar = ({ setActive, active }) => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.user);

  const logoutHandler = () => {
    axios
      .get(`${server}/user/logout`, { withCredentials: true })
      .then((res) => {
        toast.success(res.data.message);
        window.location.reload(true);
        navigate("/login");
      })
      .catch((err) => {
      });
  };

  const items = [
    { id: 1, label: "Profile", icon: RxPerson, onClick: () => setActive(1) },
    { id: 2, label: "Orders", icon: HiOutlineShoppingBag, onClick: () => setActive(2) },
    { id: 3, label: "Refunds", icon: HiOutlineReceiptRefund, onClick: () => setActive(3) },
    { id: 4, label: "Inbox", icon: AiOutlineMessage, onClick: () => setActive(4) || navigate("/inbox") },
    { id: 5, label: "Track Order", icon: MdOutlineTrackChanges, onClick: () => setActive(5) },
    { id: 6, label: "Change Password", icon: RiLockPasswordLine, onClick: () => setActive(6) },
    { id: 7, label: "Address", icon: TbAddressBook, onClick: () => setActive(7) },
  ];

  return (
    <div className="w-full bg-white border border-sand shadow-card rounded-2xl p-3 800px:p-4">
      {/* user mini-header */}
      <div className="hidden 800px:flex items-center gap-3 px-2 py-3 mb-2">
        <img
          src={`${user?.avatar?.url}`}
          alt=""
          className="w-[44px] h-[44px] rounded-full object-cover border-2 border-marigold shrink-0"
        />
        <div className="min-w-0">
          <p className="font-display font-semibold text-espresso truncate">
            {user?.name}
          </p>
          <p className="text-[12px] text-clay truncate">{user?.email}</p>
        </div>
      </div>
      <hr className="seam hidden 800px:block mb-2" />

      {items.map(({ id, label, icon: Icon, onClick }) => {
        const isActive = active === id;
        return (
          <button
            key={id}
            type="button"
            onClick={onClick}
            className={`w-full flex items-center gap-3 rounded-xl px-3 py-3 mb-1 transition-colors text-left ${
              isActive
                ? "bg-bone text-marigold-dark"
                : "text-espresso hover:bg-bone"
            }`}
          >
            <Icon size={20} className="shrink-0" />
            <span className="800px:block hidden font-medium">{label}</span>
          </button>
        );
      })}

      <hr className="seam my-2" />
      <button
        type="button"
        onClick={() => setActive(8) || logoutHandler()}
        className="w-full flex items-center gap-3 rounded-xl px-3 py-3 text-brick hover:bg-brick/5 transition-colors text-left"
      >
        <AiOutlineLogin size={20} className="shrink-0" />
        <span className="800px:block hidden font-medium">Log out</span>
      </button>
    </div>
  );
};

export default ProfileSidebar;
