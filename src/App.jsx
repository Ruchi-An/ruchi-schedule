import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import CalendarView from "./CalendarView.jsx";
import CalendarEdit from "./CalendarEdit.jsx";
import { supabase } from "./supabaseClient";
import bgImg from './assets/okumono_neonstar21.png';

const App = () => {
  // -----------------------------
  // React state: UI で表示する予定リスト
  // ※ここは "events" という名前ですが、
  // Supabase テーブル名とは無関係です
  // -----------------------------
  const [events, setEvents] = useState([]);

  // 固定 UUID（認証なしで使う場合）
  const USER_ID = "11111111-1111-1111-1111-111111111111";

  // -----------------------------
  // Supabase からデータ取得
  // -----------------------------
  const fetchEvents = async () => {
    const { data, error } = await supabase
      .from("ScheduleList") // ← Supabase のテーブル名
      .select("*")
      .order("date", { ascending: true });

    if (error) console.error("Supabase fetch error:", error);
    else setEvents(data);
  };

  useEffect(() => {
    fetchEvents();

    // -----------------------------
    // Realtime: ScheduleList の変更を購読
    // -----------------------------
    const channel = supabase
      .channel("public:ScheduleList")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "ScheduleList" }, // ←テーブル名
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
              <Route path="/edit" element={
                <CalendarEdit
                  events={events}
                  setEvents={setEvents}
                  userId={USER_ID} // ← 新規作成時に user_id に書き込む
                />
              } />
            </Routes>
          </div>
        </main>
      </div>
    </Router>
  );
};

export default App;
