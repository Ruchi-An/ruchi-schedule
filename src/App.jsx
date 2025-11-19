import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import CalendarView from "./CalendarView.jsx";
import CalendarEdit from "./CalendarEdit.jsx";
import { supabase } from "./supabaseClient";
import "./App.css";

const App = () => {
  const FIXED_USER_ID = "11111111-1111-1111-1111-111111111111";

  return (
    <Router>
      <div className="app-container">
        <header className="app-header">
          <h1>Ruchi Schedule</h1>
        </header>
        <main className="app-main">
          <Routes>
            <Route path="/" element={<CalendarView userId={FIXED_USER_ID} />} />
            <Route path="/edit" element={<CalendarEdit userId={FIXED_USER_ID} />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;
