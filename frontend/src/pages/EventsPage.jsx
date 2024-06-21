import React from "react";
import { useSelector } from "react-redux";
import EventCard from "../components/Events/EventCard";
import Header from "../components/layout/Header";
// import Loader from "../components/Layout/Loader";

const EventsPage = () => {
  const { allEvents } = useSelector((state) => state.events);
  console.log(allEvents);

  return (
    <>
      {/* {isLoading ? (
        <Loader />
      ) : ( */}
      <div>
        <Header activeHeading={4} />

        {allEvents && allEvents.map((event, index) => (
          <EventCard key={index} active={true} data={event} />
        ))}
        
        {/* <EventCard active={true} /> */}
      </div>
      {/* )} */}
    </>
  );
};

export default EventsPage;
