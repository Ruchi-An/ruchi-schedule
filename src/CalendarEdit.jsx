import React, { useState } from "react";
import CalendarLayout from "./CalendarLayout.jsx";
import EventList from "./EventList.jsx";
import { supabase } from "./supabaseClient"; // Supabase クライアント

const CalendarEdit = ({ events, setEvents }) => {
  const [editingEvent, setEditingEvent] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // 追加時に id を付与（Supabase 側で uuid 自動生成されるので仮で使用）
  const openNewEventModal = () => {
    setEditingEvent({ date: "", time: "", title: "", type: "ゲーム", summary: "" });
    setShowModal(true);
  };

  // 保存
  const saveEvent = async () => {
    if (!editingEvent.title) return;

    if (editingEvent.id) {
      // 更新
      const { error } = await supabase
        .from("events")
        .update({
          date: editingEvent.date,
          time: editingEvent.time,
          title: editingEvent.title,
          type: editingEvent.type,
          summary: editingEvent.summary
        })
        .eq("id", editingEvent.id);

      if (error) {
        console.error("Failed to update event:", error);
        return;
      }

      setEvents(events.map(e => (e.id === editingEvent.id ? editingEvent : e)));
    } else {
      // 新規追加
      const { data, error } = await supabase
        .from("events")
        .insert([{
          date: editingEvent.date,
          time: editingEvent.time,
          title: editingEvent.title,
          type: editingEvent.type,
          summary: editingEvent.summary
        }])
        .select();

      if (error) {
        console.error("Failed to insert event:", error);
        return;
      }

      // Supabase から返ってきた id を反映
      setEvents([...events, data[0]]);
    }

    // モーダルを閉じる
    setEditingEvent(null);
    setShowModal(false);
  };

  // 削除
  const deleteEvent = async (idx) => {
    const eventToDelete = events[idx];
    if (!eventToDelete.id) return;

    const { error } = await supabase
      .from("events")
      .delete()
      .eq("id", eventToDelete.id);

    if (error) {
      console.error("Failed to delete event:", error);
      return;
    }

    setEvents(events.filter((_, i) => i !== idx));
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

      {/* 右上追加ボタン */}
      <button
        onClick={openNewEventModal}
        className="fixed top-8 right-8 px-4 py-3 bg-cyan-400 rounded-full shadow-lg hover:bg-cyan-500 transition"
      >
        予定追加
      </button>

      {/* モーダル */}
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
              <button
                onClick={saveEvent}
                className="px-3 py-1 bg-cyan-400 rounded hover:bg-cyan-500 transition"
              >
                保存
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="px-3 py-1 bg-gray-500 rounded hover:bg-gray-600 transition"
              >
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
