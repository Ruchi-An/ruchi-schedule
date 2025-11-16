import React, { useEffect, useState } from "react";
import CalendarLayout from "./CalendarLayout.jsx";
import EventList from "./EventList.jsx";
import { supabase } from "./supabaseClient";

const CalendarView = ({ user }) => {
  const [events, setEvents] = useState([]);

  // Supabase から予定を取得
  const fetchEvents = async () => {
    if (!user) return;
    const { data, error } = await supabase
      .from("ScheduleList")
      .select("*")
      .eq("user_id", user.id)
      .order("date", { ascending: true });
    if (error) console.error("Failed to fetch events:", error);
    else setEvents(data);
  };

  useEffect(() => {
    fetchEvents();

    // リアルタイム更新
    const subscription = supabase
      .from(`ScheduleList:user_id=eq.${user?.id}`)
      .on("*", payload => {
        console.log("Realtime event:", payload);
        fetchEvents();
      })
      .subscribe();

    return () => {
      supabase.removeSubscription(subscription);
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
