import React from "react";
import { Link } from "react-router-dom";
import styles from "../../../styles/styles";
import { GiConverseShoe } from "react-icons/gi";
import { FaShoePrints } from "react-icons/fa";

const Hero = () => {
  return (
    <div className="relative w-full overflow-hidden bg-gradient-to-b from-bone to-sand">
      {/* faint walking footprints in the background */}
      <FaShoePrints className="pointer-events-none absolute -left-6 top-10 text-sand text-[120px] rotate-[20deg] opacity-60" />
      <FaShoePrints className="pointer-events-none absolute right-10 bottom-6 text-sand text-[90px] -rotate-[15deg] opacity-50 hidden 800px:block" />

      <div
        className={`${styles.section} relative grid grid-cols-1 800px:grid-cols-2 items-center gap-10 min-h-[80vh] py-14`}
      >
        {/* Copy */}
        <div className="max-w-[560px]">
          <p className="font-mono text-[12px] uppercase tracking-[0.25em] text-marigold-dark mb-4">
            Qadam · the shoe house
          </p>
          <h1 className="font-display text-[40px] leading-[1.05] 800px:text-[60px] font-semibold text-espresso">
            Shoes for every <span className="text-marigold-dark">step</span> you
            take.
          </h1>
          <p className="mt-5 text-[16px] leading-relaxed text-clay font-sans">
            From everyday chappals to formal leather — for ladies, gents and
            kids. Genuine quality, honest prices, delivered to your door.
          </p>

          <hr className="seam my-7 max-w-[420px]" />

          <div className="flex flex-wrap items-center gap-4">
            <Link to="/products" className="inline-block">
              <span className="inline-flex items-center justify-center h-[52px] px-7 rounded-xl bg-espresso hover:bg-coffee transition-colors text-bone font-display font-medium text-[17px]">
                Shop the collection
              </span>
            </Link>
            <Link to="/events" className="inline-block">
              <span className="inline-flex items-center justify-center h-[52px] px-7 rounded-xl border border-espresso/30 hover:border-marigold hover:text-marigold-dark transition-colors text-espresso font-display font-medium text-[17px]">
                See today’s offers
              </span>
            </Link>
          </div>

          {/* quick reassurances */}
          <div className="mt-8 flex flex-wrap gap-x-8 gap-y-3 text-[13px] text-espresso">
            <span className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-marigold" /> Free
              delivery over Rs 5,000
            </span>
            <span className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-marigold" /> 7-day
              easy exchange
            </span>
            <span className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-marigold" /> Cash on
              delivery
            </span>
          </div>
        </div>

        {/* Visual — swap this block for a real product photo when you have one */}
        <div className="hidden 800px:flex justify-center">
          <div className="relative w-[360px] h-[360px] rounded-full tread flex items-center justify-center">
            <div className="absolute inset-4 rounded-full border-2 border-dashed border-sand/40" />
            <GiConverseShoe className="text-marigold text-[180px] drop-shadow-[0_10px_20px_rgba(0,0,0,0.35)] -rotate-[10deg]" />
            {/* floating price chip */}
            <div className="absolute -bottom-3 -left-3 bg-bone border border-sand rounded-xl px-4 py-2 shadow-card">
              <p className="font-mono text-[11px] text-clay">from</p>
              <p className="font-display font-semibold text-espresso text-[18px]">
                Rs 1,499
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
