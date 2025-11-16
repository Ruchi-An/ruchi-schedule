import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import CalendarView from "./CalendarView.jsx";
import CalendarEdit from "./CalendarEdit.jsx";
import { supabase } from "./supabaseClient";
import bgImg from './assets/okumono_neonstar21.png';


const App = () => {
  const [events, setEvents] = useState([]);

  const USER_ID = "11111111-1111-1111-1111-111111111111"; // 固定UUID

  // Supabase からデータ取得
  const fetchEvents = async () => {
    const { data, error } = await supabase
      .from("ScheduleList")
      .select("*")
      .order("date", { ascending: true });
    if (error) console.error(error);
    else setEvents(data);
  };

  useEffect(() => {
    fetchEvents();

    // Realtime チャンネル購読
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
  }, []);

  return (
    <Router>
      <div className="min-h-screen bg-cover bg-center bg-fixed text-white"
           style={{ backgroundImage: `url(${bgImg})` }}>
        <header className="bg-indigo-900/30 backdrop-blur-xl p-6 flex justify-center items-center shadow-[0_0_25px_#000A]">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-widest drop-shadow-[0_0_20px_#00ffff]">
            Ruchi Schedule
          </h1>
        </header>

        <main className="p-4 flex justify-center">
          <div className="w-full max-w-[1600px]">
            <Routes>
              <Route path="/" element={<CalendarView events={events} />} />
              <Route path="/edit" element={<CalendarEdit events={events} setEvents={setEvents} userId={USER_ID} />} />
            </Routes>
          </div>
        </main>
      </div>
    </Router>
  );
};

export default App;
