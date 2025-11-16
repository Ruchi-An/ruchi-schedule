import React, { useEffect, useState } from "react";
import CalendarLayout from "./CalendarLayout.jsx";
import EventList from "./EventList.jsx";
import { supabase } from "./supabaseClient";

// props では userId を受け取るように統一
const CalendarView = ({ userId }) => {
  const [events, setEvents] = useState([]);

  // -----------------------------
  // Supabase から予定を取得
  // -----------------------------
  const fetchEvents = async () => {
    if (!userId) return;

    const { data, error } = await supabase
      .from("ScheduleList")       // ← Supabase のテーブル名
      .select("*")
      .eq("user_id", userId)      // ← UUID 固定値
      .order("date", { ascending: true });

    if (error) console.error("Failed to fetch events:", error);
    else setEvents(data);
  };

  useEffect(() => {
    fetchEvents();

    // -----------------------------
    // Realtime 更新
    // -----------------------------
    const subscription = supabase
      .from(`ScheduleList:user_id=eq.${userId}`) // ←ユーザー単位で購読
      .on("*", payload => {
        console.log("Realtime event:", payload);
        fetchEvents(); // 変更があれば fetch して state 更新
      })
      .subscribe();

    return () => {
      supabase.removeSubscription(subscription);
    };
  }, [userId]);

  return (
    <div className="w-full max-w-[1600px] flex flex-col gap-6 mx-auto">
      <CalendarLayout events={events} />
      <EventList events={events} editable={false} />
    </div>
  );
};

export default CalendarView;
