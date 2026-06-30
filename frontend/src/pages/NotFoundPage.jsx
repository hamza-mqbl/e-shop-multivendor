import React from "react";
import { Link } from "react-router-dom";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import { FaShoePrints } from "react-icons/fa";

const NotFoundPage = () => (
  <div className="bg-bone min-h-screen flex flex-col">
    <Header />
    <div className="flex-1 flex flex-col items-center justify-center text-center px-4 py-20">
      <FaShoePrints className="text-marigold text-[56px] -rotate-12 mb-4" />
      <p className="font-mono text-[13px] uppercase tracking-[0.2em] text-marigold-dark">
        Error 404
      </p>
      <h1 className="font-display text-[36px] 800px:text-[42px] font-semibold text-espresso mt-1">
        This page took a wrong step
      </h1>
      <p className="text-clay mt-3 max-w-[440px]">
        The page you're looking for doesn't exist or may have moved. Let's get
        you back on track.
      </p>
      <div className="flex flex-wrap items-center justify-center gap-3 mt-8">
        <Link to="/">
          <span className="inline-flex items-center justify-center h-[48px] px-7 rounded-xl bg-espresso hover:bg-coffee text-bone font-display font-medium transition-colors">
            Back home
          </span>
        </Link>
        <Link to="/products">
          <span className="inline-flex items-center justify-center h-[48px] px-7 rounded-xl border border-espresso text-espresso hover:bg-espresso hover:text-bone font-display font-medium transition-colors">
            Shop all shoes
          </span>
        </Link>
      </div>
    </div>
    <Footer />
  </div>
);

export default NotFoundPage;
