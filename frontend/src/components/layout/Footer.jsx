import React from "react";
import {
  AiFillFacebook,
  AiFillInstagram,
  AiFillYoutube,
  AiOutlineTwitter,
} from "react-icons/ai";
import { FaShoePrints } from "react-icons/fa";
import { Link } from "react-router-dom";
import {
  footercompanyLinks,
  footerProductLinks,
  footerSupportLinks,
} from "../../static/data";

const Footer = () => {
  return (
    <div className="tread text-bone">
      {/* Newsletter band */}
      <div className="md:flex md:justify-between md:items-center sm:px-12 px-4 bg-coffee py-8 border-b border-dashed border-white/10">
        <h1 className="lg:text-3xl text-2xl md:mb-0 mb-6 lg:leading-snug font-display font-semibold md:w-2/5">
          <span className="text-marigold">New drops & offers</span>, straight to
          your inbox
        </h1>
        <div className="flex flex-col sm:flex-row">
          <input
            type="email"
            required
            placeholder="Enter your email..."
            className="text-espresso bg-bone sm:w-72 w-full sm:mr-3 mb-3 sm:mb-0 py-2.5 rounded-lg px-3 focus:outline-none"
          />
          <button className="bg-marigold hover:bg-marigold-dark text-espresso font-display font-medium duration-300 px-6 py-2.5 rounded-lg md:w-auto w-full">
            Subscribe
          </button>
        </div>
      </div>

      {/* Link columns */}
      <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-8 sm:px-8 px-5 py-16 sm:text-center">
        <ul className="px-5 text-center sm:text-start flex sm:block flex-col items-center">
          <span className="flex items-center gap-2">
            <FaShoePrints className="text-marigold text-[22px] -rotate-12" />
            <span className="font-display text-[26px] font-semibold text-bone">
              Qadam
            </span>
          </span>
          <p className="mt-4 text-sand/80 text-sm leading-6 max-w-[240px]">
            Shoes for every step you take — chappals, sandals, formal and
            sneakers for the whole family.
          </p>
          <div className="flex items-center mt-5 gap-4">
            <AiFillFacebook size={24} className="cursor-pointer hover:text-marigold transition-colors" />
            <AiOutlineTwitter size={24} className="cursor-pointer hover:text-marigold transition-colors" />
            <AiFillInstagram size={24} className="cursor-pointer hover:text-marigold transition-colors" />
            <AiFillYoutube size={24} className="cursor-pointer hover:text-marigold transition-colors" />
          </div>
        </ul>

        <ul className="text-center sm:text-start">
          <h1 className="mb-3 font-display font-semibold text-bone">Company</h1>
          {footerProductLinks.map((link, index) => (
            <li key={index}>
              <Link
                className="text-sand/80 hover:text-marigold duration-300 text-sm cursor-pointer leading-7"
                to={link.link}
              >
                {link.name}
              </Link>
            </li>
          ))}
        </ul>

        <ul className="text-center sm:text-start">
          <h1 className="mb-3 font-display font-semibold text-bone">Shop</h1>
          {footercompanyLinks.map((link, index) => (
            <li key={index}>
              <Link
                className="text-sand/80 hover:text-marigold duration-300 text-sm cursor-pointer leading-7"
                to={link.link}
              >
                {link.name}
              </Link>
            </li>
          ))}
        </ul>

        <ul className="text-center sm:text-start">
          <h1 className="mb-3 font-display font-semibold text-bone">Support</h1>
          {footerSupportLinks.map((link, index) => (
            <li key={index}>
              <Link
                className="text-sand/80 hover:text-marigold duration-300 text-sm cursor-pointer leading-7"
                to={link.link}
              >
                {link.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 text-center pt-2 text-sand/70 text-sm pb-8 px-5 items-center">
        <span>© {new Date().getFullYear()} Qadam. All rights reserved.</span>
        <span>Terms · Privacy Policy</span>
        <div className="sm:block flex items-center justify-center w-full">
          <img
            src="https://hamart-shop.vercel.app/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Ffooter-payment.a37c49ac.png&w=640&q=75"
            alt="Accepted payment methods"
            className="opacity-80"
          />
        </div>
      </div>
    </div>
  );
};

export default Footer;
