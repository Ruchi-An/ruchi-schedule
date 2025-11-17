import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import CalendarView from "./CalendarView.jsx";
import CalendarEdit from "./CalendarEdit.jsx";
import { supabase } from "./supabaseClient";
import bgImg from './assets/okumono_neonstar21.png';

const App = () => {
  const FIXED_USER_ID = "11111111-1111-1111-1111-111111111111";

  return (
    <Router>
      <div
        className="min-h-screen bg-cover bg-center bg-fixed text-white"
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
              <Route path="/" element={<CalendarView userId={FIXED_USER_ID} />} />
              <Route path="/edit" element={<CalendarEdit userId={FIXED_USER_ID} />} />
            </Routes>
          </div>
        </main>
      </div>
    </Router>
  );
};

export default App;
