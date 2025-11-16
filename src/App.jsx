import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import CalendarView from "./CalendarView.jsx";
import CalendarEdit from "./CalendarEdit.jsx";
import { supabase } from "./supabaseClient";
import bgImg from './assets/okumono_neonstar21.png';

const App = () => {
  const [events, setEvents] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // 認証状態を監視
    const session = supabase.auth.session();
    setUser(session?.user ?? null);

    supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
  }, []);

  // Supabase からイベント取得
  useEffect(() => {
    const fetchEvents = async () => {
      if (!user) return;
      const { data, error } = await supabase
        .from('ScheduleList')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: true });
      if (error) console.error(error);
      else setEvents(data);
    };
    fetchEvents();
  }, [user]);

  if (!user) return <div className="text-white p-6">ログインしてください...</div>;

  return (
    <Router>
      <div
        className="min-h-screen h-screen bg-cover bg-center bg-no-repeat bg-fixed text-white"
        style={{ backgroundImage: `url(${bgImg})` }}
      >
        <header className="bg-indigo-900/30 backdrop-blur-xl p-6 flex justify-center items-center shadow-[0_0_25px_#000A]">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-widest drop-shadow-[0_0_20px_#00ffff]">
            Ruchi Schedule
          </h1>
        </header>

        <main className="p-4 flex justify-center">
          <div className="w-full max-w-[1600px]">
            <Routes>
              <Route path="/" element={<CalendarView user={user} />} />
              <Route path="/edit" element={<CalendarEdit events={events} setEvents={setEvents} user={user} />} />
            </Routes>
          </div>
        </main>
      </div>
    </Router>
  );
};

export default App;
