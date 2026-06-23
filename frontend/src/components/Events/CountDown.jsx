import React, { useEffect, useState } from "react";

const CountDown = ({ data }) => {
  const [timeLeft, setTimeLeft] = useState({});

  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearTimeout(timer);
  }, [timeLeft]);

  function calculateTimeLeft() {
    const difference = +new Date(data.Finish_Date) - +new Date();
    let timeLeft = {};

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }

    return timeLeft;
  }

  if (Object.keys(timeLeft).length === 0) {
    return (
      <span className="font-display text-[18px] text-brick">Offer ended</span>
    );
  }

  const intervals = ["days", "hours", "minutes", "seconds"];

  return (
    <div className="flex gap-2">
      {intervals.map((interval) => (
        <div
          key={interval}
          className="flex flex-col items-center bg-bone border border-sand rounded-lg px-3 py-1.5 min-w-[56px]"
        >
          <span className="font-mono font-semibold text-espresso text-[20px] leading-none">
            {String(timeLeft[interval] ?? 0).padStart(2, "0")}
          </span>
          <span className="text-[10px] uppercase tracking-wide text-clay mt-1">
            {interval}
          </span>
        </div>
      ))}
    </div>
  );
};

export default CountDown;
