import React, { useState, useEffect } from "react";
import CalendarLayout from "./CalendarLayout.jsx";
import EventList from "./EventList.jsx";
import { supabase } from "./supabaseClient";

const CalendarEdit = ({ userId }) => {
  const [events, setEvents] = useState([]);
  const [editingEvent, setEditingEvent] = useState(null);
  const [showModal, setShowModal] = useState(false);

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

  const openNewEventModal = () => {
    setEditingEvent({ date: "", time: "", title: "", type: "ゲーム", summary: "" });
    setShowModal(true);
  };

  const saveEvent = async () => {
    if (!editingEvent.title) return;

    const payload = {
      date: editingEvent.date || null,
      time: editingEvent.time || null,
      title: editingEvent.title,
      type: editingEvent.type,
      summary: editingEvent.summary || null,
      user_id: userId
    };

    try {
      if (editingEvent.no) {
        // 編集
        const { error } = await supabase
          .from("schedule_list")
          .update(payload)
          .eq("no", editingEvent.no);
        if (error) throw error;
      } else {
        // 新規
        const { data, error } = await supabase
          .from("schedule_list")
          .insert([payload])
          .select();
        if (error) throw error;
      }

      setEditingEvent(null);
      setShowModal(false);
      fetchEvents();
    } catch (err) {
      console.error("Save failed:", err);
    }
  };

  const deleteEvent = async (eventNo) => {
    if (!eventNo) return;

    try {
      const { error } = await supabase
        .from("schedule_list")
        .delete()
        .eq("no", eventNo);

      if (error) throw error;

      fetchEvents();
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  return (
    <div className="w-full max-w-[1600px] flex flex-col gap-6 mx-auto relative">
      <CalendarLayout
        events={events}
        onCellClick={(day) => {
          const eventForDay = events.find(e => e.date === day.format("YYYY-MM-DD"));
          if (eventForDay) {
            setEditingEvent({ ...eventForDay }); // no を含む
            setShowModal(true);
          }
        }}
      />

      <EventList
        events={events}
        onEdit={(evNo) => {
          const ev = events.find(e => e.no === evNo);
          if (ev) {
            setEditingEvent({ ...ev }); // no を含む
            setShowModal(true);
          }
        }}
        onDelete={deleteEvent}
        editable
      />

      <button
        onClick={openNewEventModal}
        className="fixed top-8 right-8 px-4 py-3 bg-cyan-400 rounded-full shadow-lg hover:bg-cyan-500 transition"
      >
        予定追加
      </button>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <div className="bg-indigo-900/30 backdrop-blur-xl p-6 rounded-2xl w-96 flex flex-col gap-4">
            <input
              type="date"
              value={editingEvent.date}
              onChange={e => setEditingEvent({ ...editingEvent, date: e.target.value })}
              className="p-2 rounded bg-gray-700 text-white"
            />
            <input
              type="time"
              value={editingEvent.time}
              onChange={e => setEditingEvent({ ...editingEvent, time: e.target.value })}
              className="p-2 rounded bg-gray-700 text-white"
            />
            <input
              type="text"
              value={editingEvent.title}
              onChange={e => setEditingEvent({ ...editingEvent, title: e.target.value })}
              placeholder="タイトル"
              className="p-2 rounded bg-gray-700 text-white"
            />
            <select
              value={editingEvent.type}
              onChange={e => setEditingEvent({ ...editingEvent, type: e.target.value })}
              className="p-2 rounded bg-gray-700 text-white"
            >
              <option value="ゲーム">ゲーム</option>
              <option value="シナリオ">シナリオ</option>
              <option value="リアル">リアル</option>
            </select>
            <input
              type="text"
              value={editingEvent.summary}
              onChange={e => setEditingEvent({ ...editingEvent, summary: e.target.value })}
              placeholder="詳細"
              className="p-2 rounded bg-gray-700 text-white"
            />

            <div className="flex justify-between mt-2">
              <button onClick={saveEvent} className="px-3 py-1 bg-cyan-400 rounded hover:bg-cyan-500 transition">
                保存
              </button>
              <button onClick={() => setShowModal(false)} className="px-3 py-1 bg-gray-500 rounded hover:bg-gray-600 transition">
                キャンセル
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CalendarEdit;
