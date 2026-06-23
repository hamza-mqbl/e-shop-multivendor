import React, { useState } from "react";
import Footer from "../components/layout/Footer";
import Header from "../components/layout/Header";
import styles from "../styles/styles";
import { FiMinus, FiPlus } from "react-icons/fi";

const faqs = [
  {
    q: "How do I find my size?",
    a: "We list every shoe in UK sizing. Use the “Size guide” link on a product page to match UK / EU / cm. If you're between sizes, we recommend going half a size up — and if it doesn't fit, our 7-day exchange has you covered.",
  },
  {
    q: "What is your exchange & return policy?",
    a: "Wrong size? We offer a free 7-day size exchange on unworn shoes in their original box. For returns, contact us within 7 days of delivery and we'll guide you through it. Items must be unworn with tags and packaging intact.",
  },
  {
    q: "How long does delivery take, and is it free?",
    a: "We deliver across Pakistan in 2–5 working days. Delivery is free on all orders over Rs 5,000; a small flat fee applies below that. You'll get a confirmation as soon as your order is on the way.",
  },
  {
    q: "What payment methods do you accept?",
    a: "Cash on Delivery (pay when it reaches you), plus Visa, Mastercard and other cards via secure checkout. You can choose your preferred method at checkout.",
  },
  {
    q: "How do I track my order?",
    a: "Log in and open your account, then go to “Track Order” to see your latest status. You can also message the shop directly from the order or product page.",
  },
  {
    q: "Are your shoes genuine quality?",
    a: "Yes — we work with real leather and quality materials, and every pair is checked before it leaves our workshop. Material details are listed in each product's specifications.",
  },
  {
    q: "How should I care for my shoes?",
    a: "Wipe leather with a soft dry cloth and use a matching cream to keep it supple. Let shoes air-dry away from direct heat, and store them in their box to keep their shape. Avoid machine washing leather or suede.",
  },
];

const FAQPage = () => {
  return (
    <div className="bg-bone min-h-screen">
      <Header activeHeading={4} />
      <Faq />
      <Footer />
    </div>
  );
};

const Faq = () => {
  const [active, setActive] = useState(0);

  const toggle = (i) => setActive(active === i ? -1 : i);

  return (
    <div className={`${styles.section} py-10 800px:py-14`}>
      <div className="max-w-[820px]">
        <p className="font-mono text-[12px] uppercase tracking-[0.2em] text-marigold-dark">
          Help centre
        </p>
        <h1 className="font-display text-[30px] font-semibold text-espresso mb-2">
          Frequently asked questions
        </h1>
        <p className="text-clay mb-8">
          Sizing, delivery, exchanges and more. Still stuck? Message the shop
          from any product page.
        </p>

        <div className="bg-white border border-sand rounded-2xl shadow-card divide-y divide-sand overflow-hidden">
          {faqs.map((item, i) => {
            const open = active === i;
            return (
              <div key={i}>
                <button
                  className="flex items-center justify-between w-full text-left px-5 800px:px-6 py-5 hover:bg-bone transition-colors"
                  onClick={() => toggle(i)}
                >
                  <span className="font-display font-medium text-espresso text-[16px] 800px:text-[17px] pr-4">
                    {item.q}
                  </span>
                  <span
                    className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                      open ? "bg-marigold text-espresso" : "bg-bone text-espresso"
                    }`}
                  >
                    {open ? <FiMinus size={18} /> : <FiPlus size={18} />}
                  </span>
                </button>
                {open && (
                  <div className="px-5 800px:px-6 pb-5 -mt-1">
                    <p className="text-[15px] leading-7 text-clay max-w-[680px]">
                      {item.a}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default FAQPage;
