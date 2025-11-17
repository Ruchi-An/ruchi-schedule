import React, { useEffect, useState } from "react";
import CalendarLayout from "./CalendarLayout.jsx";
import EventList from "./EventList.jsx";
import { supabase } from "./supabaseClient";

const CalendarView = ({ user }) => {
  const [events, setEvents] = useState([]);

  const fetchEvents = async () => {
    if (!user) return;
    const { data, error } = await supabase
      .from("ScheduleList")
      .select("*")
      .eq("user_id", user.id)
      .order("date", { ascending: true });
    if (error) console.error("Fetch events failed:", error);
    else setEvents(data || []);
  };

  useEffect(() => {
    fetchEvents();

    const channel = supabase
      .channel("public:ScheduleList")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "ScheduleList" },
        (payload) => {
          console.log("Realtime payload:", payload);
          fetchEvents();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  return (
    <div className="w-full max-w-[1600px] flex flex-col gap-6 mx-auto">
      <CalendarLayout events={events} />
      <EventList events={events} editable={false} />
    </div>
  );
};

export default CalendarView;
