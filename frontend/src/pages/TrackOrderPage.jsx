import React from 'react'
import Header from '../components/layout/Header'
import Footer from '../components/layout/Footer'
import TrackOrder from "../components/Profile/TrackOrder.jsx";

const TrackOrderPage = () => {
    return (
      <div className="bg-bone min-h-screen">
          <Header />
          <TrackOrder />
          <Footer />
      </div>
    )
  }

export default TrackOrderPage