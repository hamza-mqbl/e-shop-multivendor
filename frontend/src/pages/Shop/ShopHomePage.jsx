import React from "react";
import styles from "../../styles/styles";
import ShopInfo from "../../components/Shop/ShopInfo.jsx";
import ShopProfileData from "../../components/Shop/ShopProfileData.jsx";

const ShopHomePage = () => {
  return (
    <div className="bg-bone min-h-screen">
      <div className={`${styles.section} py-8 800px:py-12`}>
        <div className="w-full 800px:flex gap-6 justify-between items-start">
          <div className="800px:w-[28%] bg-white border border-sand shadow-card rounded-2xl p-1">
            <ShopInfo isOwner={true} />
          </div>
          <div className="800px:w-[70%] mt-6 800px:mt-0">
            <ShopProfileData isOwner={true} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopHomePage;
