import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import CalendarView from "./CalendarView.jsx";
import CalendarEdit from "./CalendarEdit.jsx";

const App = () => {
  const [events, setEvents] = useState([
    { date: "2025-11-14", time: "20:00", title: "テスト配信", type: "ゲーム", detail: "" },
    { date: "2025-11-15", time: "18:00", title: "シナリオ遊び", type: "シナリオ", detail: "" },
  ]);

  return (
    <Router>
      <div
        className="min-h-screen h-screen bg-cover bg-center bg-no-repeat bg-fixed text-white"
        style={{ backgroundImage: "url('/okumono_neonstar21.png')" }}
      >
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
