// CalendarEdit.jsx
import React, { useState, useEffect } from "react";
import CalendarLayout from "./CalendarLayout.jsx";
import EventList from "./EventList.jsx";
import { supabase } from "./supabaseClient";

const CalendarEdit = () => {
  const [events, setEvents] = useState([]);
  const [editingEvent, setEditingEvent] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  // 現在ログインしているユーザーを取得
  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) {
        console.error(error);
        alert("ログインしてください");
        return;
      }
      setCurrentUser(user);
    };
    fetchUser();
  }, []);

  const fetchEvents = async () => {
    if (!currentUser) return;
    const { data, error } = await supabase
      .from("schedule_list")
      .select("*")
      .eq("user_id", currentUser.id)
      .order("date", { ascending: true });
    if (error) console.error(error);
    else setEvents(data || []);
  };

  useEffect(() => {
    fetchEvents();

    if (!currentUser) return;
    const channel = supabase
      .channel("public:schedule_list")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "schedule_list" },
        () => fetchEvents()
      )
      .subscribe();

    return () => {
      if (channel) supabase.removeChannel(channel);
    };
  }, [currentUser]);

  const openNewEventModal = () => {
    setEditingEvent({ date: "", time: "", title: "", type: "ゲーム", summary: "" });
    setShowModal(true);
  };

  const saveEvent = async () => {
    if (!editingEvent.title) return;
    if (!currentUser) {
      alert("ログインしてください");
      return;
    }

    const payload = {
      date: editingEvent.date,
      time: editingEvent.time,
      title: editingEvent.title,
      type: editingEvent.type,
      summary: editingEvent.summary,
      user_id: currentUser.id,
    };

    if (editingEvent.no) {
      const { error } = await supabase
        .from("schedule_list")
        .update(payload)
        .eq("no", editingEvent.no);
      if (error) console.error("Update failed:", error);
    } else {
      const { error } = await supabase
        .from("schedule_list")
        .insert([payload])
        .select();
      if (error) console.error("Insert failed:", error);
    }

    setEditingEvent(null);
    setShowModal(false);
  };

  const deleteEvent = async (idx) => {
    const eventToDelete = events[idx];
    if (!eventToDelete.no) return;

    const { error } = await supabase
      .from("schedule_list")
      .delete()
      .eq("no", eventToDelete.no);
    if (error) console.error("Delete failed:", error);
  };

  return (
    <div className="w-full max-w-[1600px] flex flex-col gap-6 mx-auto relative">
      <CalendarLayout
        events={events}
        onCellClick={(day) => {
          const eventForDay = events.find(e => e.date === day.format("YYYY-MM-DD"));
          if (eventForDay) {
            setEditingEvent({ ...eventForDay });
            setShowModal(true);
          }
        }}
      />
      <EventList
        events={events}
        onEdit={(idx) => { setEditingEvent({ ...events[idx] }); setShowModal(true); }}
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
            <input type="date" value={editingEvent.date} onChange={e => setEditingEvent({ ...editingEvent, date: e.target.value })} className="p-2 rounded bg-gray-700 text-white" />
            <input type="time" value={editingEvent.time} onChange={e => setEditingEvent({ ...editingEvent, time: e.target.value })} className="p-2 rounded bg-gray-700 text-white" />
            <input type="text" value={editingEvent.title} onChange={e => setEditingEvent({ ...editingEvent, title: e.target.value })} placeholder="タイトル" className="p-2 rounded bg-gray-700 text-white" />
            <select value={editingEvent.type} onChange={e => setEditingEvent({ ...editingEvent, type: e.target.value })} className="p-2 rounded bg-gray-700 text-white">
              <option value="ゲーム">ゲーム</option>
              <option value="シナリオ">シナリオ</option>
              <option value="リアル">リアル</option>
            </select>
            <input type="text" value={editingEvent.summary} onChange={e => setEditingEvent({ ...editingEvent, summary: e.target.value })} placeholder="詳細" className="p-2 rounded bg-gray-700 text-white" />
            <div className="flex justify-between mt-2">
              <button onClick={saveEvent} className="px-3 py-1 bg-cyan-400 rounded hover:bg-cyan-500 transition">保存</button>
              <button onClick={() => setShowModal(false)} className="px-3 py-1 bg-gray-500 rounded hover:bg-gray-600 transition">キャンセル</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CalendarEdit;
