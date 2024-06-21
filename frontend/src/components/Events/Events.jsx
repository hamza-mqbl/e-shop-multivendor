import React, { useEffect } from "react";

import styles from "../../styles/styles";
import EventCard from "./EventCard.jsx";
import { useSelector } from "react-redux";

const Events = () => {
  const { allEvents, isLoading } = useSelector((state) => state.events);

  // useEffect(() => {
  //   const data = allEvents && allEvents.find((a, b) => a.sold_out - b.sold_out);
  // });

  return (
    <div>
      <div className={`${styles.section}`}>
        <div className={`${styles.heading}`}>
          <h1>Popular Events</h1>
        </div>

        <div className="w-full grid">
          <EventCard data={allEvents && allEvents[0]} />
        </div>
      </div>
    </div>
  );
};

export default Events;
