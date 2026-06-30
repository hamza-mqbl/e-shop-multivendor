import React from "react";
import { useSelector } from "react-redux";
import EventCard from "../components/Events/EventCard";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import styles from "../styles/styles";
import Seo from "../components/Seo.jsx";

const EventsPage = () => {
  const { allEvents } = useSelector((state) => state.events);

  return (
    <div className="bg-bone min-h-screen">
      <Seo
        title="Offers"
        path="/events"
        description="Limited-time deals on Qadam shoes — save on sneakers, formal shoes and heels while stocks last."
      />
      <Header activeHeading={3} />
      <div className={`${styles.section} py-8 800px:py-12`}>
        <p className="font-mono text-[12px] uppercase tracking-[0.2em] text-marigold-dark">
          Limited time
        </p>
        <h1 className="font-display text-[28px] font-semibold text-espresso mb-6">
          Running offers
        </h1>

        {allEvents && allEvents.length > 0 ? (
          <div className="space-y-8">
            {allEvents.map((event, index) => (
              <EventCard key={index} active={true} data={event} />
            ))}
          </div>
        ) : (
          <div className="bg-white border border-sand rounded-2xl shadow-card py-16 text-center">
            <p className="text-espresso font-medium">No offers running right now</p>
            <p className="text-clay text-[14px] mt-1">
              Check back soon — new deals drop regularly.
            </p>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default EventsPage;
