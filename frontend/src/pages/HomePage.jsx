import React from "react";
import Header from "../components/layout/Header.jsx";
import Hero from "../components/Route/Hero/Hero.jsx";
import Categories from "../components/Route/Categories/Categories.jsx"
import BestDeal from "../components/Route/BestDeal/BestDeal.jsx"
import FeaturedProduct from "../components/Route/FeaturedProduct/FeaturedProducts.jsx"
import Events from "../components/Events/Events.jsx"
import Sponsored from "../components/Route/Sponsored.jsx"
import Footer from "../components/layout/Footer.jsx"
const HomePage = () => {
  return (
    <div>
      <Header activeHeading={1} />
      <Hero />
      <Categories />
      <BestDeal/>
      <Events/>
      <FeaturedProduct/>
      <Sponsored/>
      <Footer/>

    </div>
  );
};

export default HomePage;
