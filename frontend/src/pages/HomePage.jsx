import React from "react";
import Header from "../components/layout/Header.jsx";
import Hero from "../components/Route/Hero/Hero.jsx";
import Categories from "../components/Route/Categories/Categories.jsx"
import BestDeal from "../components/Route/BestDeal/BestDeal.jsx"
import FeaturedProduct from "../components/Route/FeaturedProduct/FeaturedProducts.jsx"
import Events from "../components/Events/Events.jsx"
import Footer from "../components/layout/Footer.jsx"
import Seo from "../components/Seo.jsx";

const origin =
  typeof window !== "undefined" ? window.location.origin : "https://qadam.pk";

const HomePage = () => {
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: "Qadam",
      url: origin,
      logo: `${origin}/logo512.png`,
      description:
        "Handcrafted leather shoes for men, women and kids — sneakers, formal shoes, heels and chappals.",
    },
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: "Qadam",
      url: origin,
      potentialAction: {
        "@type": "SearchAction",
        target: `${origin}/products?category={search_term_string}`,
        "query-input": "required name=search_term_string",
      },
    },
  ];
  return (
    <div>
      <Seo path="/" jsonLd={jsonLd} />
      <Header activeHeading={1} />
      <Hero />
      <Categories />
      <BestDeal/>
      <Events/>
      <FeaturedProduct/>
      <Footer/>

    </div>
  );
};

export default HomePage;
