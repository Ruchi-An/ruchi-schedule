import React from "react";
import CalendarLayout from "./CalendarLayout.jsx";
import EventList from "./EventList.jsx";

const CalendarView = ({ events }) => {
  return (
    <div className="w-full max-w-[1600px] flex flex-col gap-6 mx-auto">
      <CalendarLayout events={events} />
      <EventList events={events} />
    </div>
  );
};

export default CalendarView;
