import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import RuchisukeView from "./pages/RuchisukeView.jsx";
import RuchisukeEdit from "./pages/RuchisukeEdit.jsx";
import { supabase } from "./services/supabaseClient";
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
            <Route path="/" element={<RuchisukeView userId={FIXED_USER_ID} />} />
            <Route path="/piyo" element={<RuchisukeEdit userId={FIXED_USER_ID} />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;
