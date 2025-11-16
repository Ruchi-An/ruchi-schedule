import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import CalendarView from "./CalendarView.jsx";
import CalendarEdit from "./CalendarEdit.jsx";
import { supabase } from "./supabaseClient";
import bgImg from './assets/okumono_neonstar21.png';


const App = () => {
  const [events, setEvents] = useState([]);

  // 初回読み込みで Supabase からデータ取得
  const fetchEvents = async () => {
    const { data, error } = await supabase
      .from("ScheduleList")
      .select("*")
      .order("date", { ascending: true })
      .order("time", { ascending: true });

    if (error) console.error("Failed to fetch events:", error);
    else setEvents(data);
  };

  useEffect(() => {
    fetchEvents();

    // Realtime subscription
    const subscription = supabase
      .from("ScheduleList")
      .on("*", () => {
        fetchEvents();
      })
      .subscribe();

    return () => {
      supabase.removeSubscription(subscription);
    };
  }, []);

  return (
    <Router>
      <div className="min-h-screen h-screen bg-cover bg-center bg-no-repeat bg-fixed text-white" style={{ backgroundImage: `url(${bgImg})` }}>
        <header className="bg-indigo-900/30 backdrop-blur-xl p-6 flex justify-center items-center shadow-[0_0_25px_#000A]">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-widest drop-shadow-[0_0_20px_#00ffff]">
            Ruchi Schedule
          </h1>
        </header>

        <main className="p-4 flex justify-center">
          <div className="w-full max-w-[1600px]">
            <Routes>
              <Route path="/" element={<CalendarView events={events} />} />
              <Route path="/edit" element={<CalendarEdit events={events} setEvents={setEvents} />} />
            </Routes>
          </div>
        </main>
      </div>
    </Router>
  );
};

export default App;
