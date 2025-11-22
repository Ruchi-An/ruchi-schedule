import React, { useEffect, useState } from "react";
import CalendarLayout from "../components/CalendarLayout.jsx";
import ScheduleListLayout from "../components/ScheduleListLayout.jsx";
import EventPopup from "../components/EventPopup.jsx"; // ★ 忘れずに
import { supabase } from "../services/supabaseClient.js";

const RuchisukeView = ({ userId }) => {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null); // ★ ポップアップ用

  const fetchEvents = async () => {
    const { data, error } = await supabase
      .from("schedule_list")
      .select("*")
      .eq("user_id", userId)
      .order("date", { ascending: true });
    if (error) console.error("Fetch events failed:", error);
    else setEvents(data || []);
  };

  useEffect(() => {
    fetchEvents();

    const channel = supabase
      .channel("public:schedule_list")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "schedule_list" },
        () => fetchEvents()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId]);

  console.log("RuchisukeView events:", events);

  // ★ カレンダー項目がクリックされた時の処理
  const handleEventClick = (event) => {
    console.log("CLICK:", event);
    setSelectedEvent(event);
  };

  return (
    <div className="w-full max-w-[1600px] flex flex-col gap-6 mx-auto">
      <CalendarLayout 
        events={events} 
        onEventClick={(ev) => setSelectedEvent(ev)}
      />

      <ScheduleListLayout events={events} editable={false} />

      {/* ★ 選択中イベントがある時だけポップアップ表示 */}
      {selectedEvent && (
<EventPopup event={selectedEvent} onClose={() => setSelectedEvent(null)} />
      )}
    </div>
  );
};

export default RuchisukeView;
