import React, { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";
import CalendarView from "./CalendarView";
import CalendarEdit from "./CalendarEdit";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

const App = () => {
  const [events, setEvents] = useState([]);
  const [user, setUser] = useState(null);

  // ① ログイン状態取得
  useEffect(() => {
    const session = supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
  }, []);

  // ② DB から全イベント取得
  const fetchEvents = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from("schedule_list")
      .select("*")
      .eq("user_id", user.id)
      .order("date", { ascending: true })
      .order("time", { ascending: true });

    if (!error) setEvents(data);
  };

  // ③ user が読み込まれたら events を取得
  useEffect(() => {
    if (user) fetchEvents();
  }, [user]);

  // ④ Realtime 設定（唯一のチャンネル）
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel("schedule_list_changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "schedule_list",
        },
        () => {
          fetchEvents();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<CalendarView events={events} />} />
        <Route path="/edit" element={<CalendarEdit events={events} userId={user?.id} />} />
      </Routes>
    </Router>
  );
};

export default App;
