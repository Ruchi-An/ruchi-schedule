import React, { useState } from "react";
import { supabase } from "./supabaseClient";

const CalendarEdit = ({ events, userId }) => {
  const [editing, setEditing] = useState(null);

  const saveEvent = async (e) => {
    e.preventDefault();

    const form = new FormData(e.target);
    const payload = {
      title: form.get("title"),
      type: form.get("type"),
      summary: form.get("summary"),
      date: form.get("date"),
      time: form.get("time"),
      user_id: userId,
    };

    if (editing?.id) {
      await supabase
        .from("schedule_list")
        .update(payload)
        .eq("id", editing.id);
    } else {
      await supabase.from("schedule_list").insert(payload);
    }

    setEditing(null); // フォーム閉じる
  };

  const deleteEvent = async (id) => {
    await supabase.from("schedule_list").delete().eq("id", id);
  };

  return (
    <div className="p-4">
      <h1>編集画面</h1>

      {/* イベント一覧 */}
      {events.map((ev) => (
        <div key={ev.id} className="p-2 border rounded mb-2">
          <p>{ev.title}</p>
          <button onClick={() => setEditing(ev)}>編集</button>
          <button onClick={() => deleteEvent(ev.id)}>削除</button>
        </div>
      ))}

      {/* 新規 or 編集フォーム */}
      <form onSubmit={saveEvent} className="mt-4 grid gap-2">
        <input name="title" placeholder="タイトル" defaultValue={editing?.title} required />
        <input name="type" placeholder="種別" defaultValue={editing?.type} required />
        <input name="summary" placeholder="概要" defaultValue={editing?.summary ?? ""} />
        <input type="date" name="date" defaultValue={editing?.date ?? ""} />
        <input type="time" name="time" defaultValue={editing?.time ?? ""} />

        <button type="submit">保存</button>
      </form>
    </div>
  );
};

export default CalendarEdit;
