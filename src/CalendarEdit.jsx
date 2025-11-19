import React, { useState, useEffect } from "react";
import CalendarLayout from "./CalendarLayout.jsx";
import EventList from "./EventList.jsx";
import { supabase } from "./supabaseClient";
import "./CalendarEdit.css";

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
      .on("postgres_changes", { event: "*", schema: "public", table: "schedule_list" }, fetchEvents)
      .subscribe();
    return () => supabase.removeChannel(channel);
  }, [userId]);

  const openNewEventModal = () => {
    setEditingEvent({ date:"", time:"", title:"", type:"ゲーム", summary:"" });
    setShowModal(true);
  };

  const saveNewEvent = async () => {
    if(!editingEvent.title) return;
    const payload = { ...editingEvent, user_id: userId, date: editingEvent.date||null, time: editingEvent.time||null, summary: editingEvent.summary||null };
    const { error } = await supabase.from("schedule_list").insert([payload]);
    if(error) console.error(error);
    setEditingEvent(null);
    setShowModal(false);
    fetchEvents();
  };

  const updateEvent = async () => {
    if(!editingEvent.title) return;
    const payload = { ...editingEvent, date: editingEvent.date||null, time: editingEvent.time||null, summary: editingEvent.summary||null };
    const { error } = await supabase.from("schedule_list").update(payload).eq("no", editingEvent.no);
    if(error) console.error(error);
    setEditingEvent(null);
    setShowModal(false);
    fetchEvents();
  };

  const deleteEvent = async (eventNo, userId) => {
    if(!eventNo) return;
    const { error } = await supabase.from("schedule_list").delete().eq("no", eventNo);
    if(error) console.error(error);
    fetchEvents();
  };

  return (
    <div className="calendar-edit-container">
      <CalendarLayout
        events={events}
        onCellClick={(day) => {
          const ev = events.find(e=>e.date===day.format("YYYY-MM-DD"));
          if(ev){ setEditingEvent({...ev}); setShowModal(true);}
        }}
      />
      <EventList events={events} onEdit={(no)=>{const ev = events.find(e=>e.no===no); if(ev) {setEditingEvent({...ev}); setShowModal(true);}}} onDelete={deleteEvent} editable userId={userId} />
      <button className="btn-add-event" onClick={openNewEventModal}>予定追加</button>

      {showModal && (
        <div className="modal-backdrop">
          <div className="modal-content">
            <input type="date" value={editingEvent.date} onChange={e=>setEditingEvent({...editingEvent, date:e.target.value})}/>
            <input type="time" value={editingEvent.time} onChange={e=>setEditingEvent({...editingEvent, time:e.target.value})}/>
            <input type="text" value={editingEvent.title} onChange={e=>setEditingEvent({...editingEvent, title:e.target.value})} placeholder="タイトル"/>
            <select value={editingEvent.type} onChange={e=>setEditingEvent({...editingEvent, type:e.target.value})}>
              <option>コラボ</option><option>ソロ</option><option>マダミス</option><option>ストプレ</option><option>スパイゲーム</option><option>その他シナリオ</option><option>リアル</option>
            </select>
            <input type="text" value={editingEvent.summary} onChange={e=>setEditingEvent({...editingEvent, summary:e.target.value})} placeholder="詳細"/>
            <div className="modal-buttons">
              <button onClick={editingEvent.no?updateEvent:saveNewEvent}>{editingEvent.no?"更新":"保存"}</button>
              <button onClick={()=>setShowModal(false)}>キャンセル</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CalendarEdit;
