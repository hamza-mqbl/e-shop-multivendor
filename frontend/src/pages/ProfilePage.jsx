import React, { useState } from "react";
import Header from "../components/layout/Header";
import styles from "../styles/styles";
import ProfileSideBar from "../components/Profile/ProfileSidebar.jsx";
import ProfileContent from "../components/Profile/ProfileContent.jsx";
import { useSelector } from "react-redux";
import Loader from "../components/layout/Loader.jsx";

const ProfilePage = () => {
  const { loading } = useSelector((state) => state.user);
  const [active, setActive] = useState(1);

  return (
    <div className="bg-bone min-h-screen">
      {loading ? (
        <Loader />
      ) : (
        <>
          <Header />
          <div className={`${styles.section} py-8 800px:py-12`}>
            <h1 className="font-display text-[28px] font-semibold text-espresso mb-6">
              My account
            </h1>
            <div className="flex gap-6 items-start">
              <div className="w-[64px] 800px:w-[300px] shrink-0 sticky top-6">
                <ProfileSideBar active={active} setActive={setActive} />
              </div>
              <div className="flex-1 min-w-0 bg-white border border-sand shadow-card rounded-2xl p-5 800px:p-8">
                <ProfileContent active={active} />
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ProfilePage;
