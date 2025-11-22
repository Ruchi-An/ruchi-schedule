import React, { useState, useEffect } from "react";
import CalendarLayout from "../components/CalendarLayout.jsx";
import ScheduleListLayout from "../components/ScheduleListLayout.jsx";
import EventEditPopup from "../components/EventEditPopup.jsx";
import { supabase } from "../services/supabaseClient.js";
import { parseInputTime, displayTime } from "../utils/timeBorderClass";
import "./RuchisukeEdit.css";

const RuchisukeEdit = ({ userId }) => {
  const [events, setEvents] = useState([]);
  const [editingEvent, setEditingEvent] = useState(null);

  const fetchEvents = async () => {
    const { data, error } = await supabase
      .from("schedule_list")
      .select("*")
      .eq("user_id", userId)
      .order("date", { ascending: true });
    if (error) console.error(error);
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
    return () => supabase.removeChannel(channel);
  }, [userId]);

  const saveNewEvent = async (ev) => {
    const payload = {
      ...ev,
      startTime: parseInputTime(ev.startTime) || null,
      endTime: parseInputTime(ev.endTime) || null,
      user_id: userId,
      allDay: ev.allDay || false,
      sleep: ev.sleep || false,
    };
    const { error } = await supabase.from("schedule_list").insert([payload]);
    if (error) console.error(error);
    else setEditingEvent(null);
  };

  const updateEvent = async (ev) => {
    const payload = { ...ev };
    const { error } = await supabase
      .from("schedule_list")
      .update(payload)
      .eq("no", ev.no);
    if (error) console.error(error);
    else setEditingEvent(null);
  };

  const deleteEvent = async (no) => {
    if (!no) return;
    const { error } = await supabase.from("schedule_list").delete().eq("no", no);
    if (error) console.error(error);
    else fetchEvents();
  };

  return (
    <div className="calendar-edit-container">
      <CalendarLayout 
        events={events} 
        onEventClick={ev => setEditingEvent(ev)} 
      />

      <ScheduleListLayout
        events={events}
        onEdit={no => {
          const ev = events.find(e => e.no === no);
          if (ev) setEditingEvent(ev);
        }}
        onDelete={deleteEvent}
        editable
        userId={userId}
      />

      <button className="btn-add-event" onClick={() => setEditingEvent({})}>予定追加</button>

      {editingEvent && (
        <EventEditPopup
          event={editingEvent}
          onClose={() => setEditingEvent(null)}
          onSave={ev => {
            if (ev.no) updateEvent(ev);
            else saveNewEvent(ev);
            fetchEvents();
          }}
        />
      )}
    </div>
  );
};

export default RuchisukeEdit;
