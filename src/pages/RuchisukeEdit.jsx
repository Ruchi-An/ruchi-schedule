// ------------------------------
// 📌 RuchisukeEdit.jsx
// ユーザーのスケジュールを編集・追加・削除できるコンポーネント
// カレンダー・リスト・編集用ポップアップ対応
// ------------------------------

import React, { useState, useEffect } from "react";
import CalendarLayout from "../components/CalendarLayout.jsx";       // ★ カレンダー表示用
import ScheduleListLayout from "../components/ScheduleListLayout.jsx"; // ★ リスト表示用（編集可能）
import EventEditPopup from "../components/EventEditPopup.jsx";       // ★ イベント編集用ポップアップ
import { supabase } from "../services/supabaseClient.js";           // ★ Supabaseクライアント
import { parseInputTime, displayTime } from "../utils/timeUtils"; // ★ 時間フォーマット用ユーティリティ
import "./RuchisukeEdit.css";                                        // ★ スタイル

const RuchisukeEdit = ({ userId }) => {
  // ------------------------------
  // 📌 state管理
  // ------------------------------
  const [events, setEvents] = useState([]);         // ★ 取得したイベント一覧
  const [editingEvent, setEditingEvent] = useState(null); // ★ 編集中のイベント（ポップアップ用）

  // ------------------------------
  // 📌 イベント取得関数
  // ------------------------------
  const fetchEvents = async () => {
    const { data, error } = await supabase
      .from("schedule_list")
      .select("*")
      .eq("user_id", userId)
      .order("date", { ascending: true });

    if (error) console.error(error); // ★ エラーがあればコンソール表示
    else setEvents(data || []);      // ★ データがない場合は空配列
  };

  // ------------------------------
  // 📌 初回レンダリング & リアルタイム更新
  // ------------------------------
  useEffect(() => {
    fetchEvents(); // 初回取得

    const channel = supabase
      .channel("public:schedule_list")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "schedule_list" }, // ★ INSERT/UPDATE/DELETEを監視
        () => fetchEvents() // 変更があれば再取得
      )
      .subscribe();

    return () => supabase.removeChannel(channel); // ★ アンマウント時にチャンネル削除
  }, [userId]); // ★ userIdが変わったら再実行

  // ------------------------------
  // 📌 新規イベント追加
  // ------------------------------
  const saveNewEvent = async (ev) => {
    const payload = {
      ...ev,
      startTime: parseInputTime(ev.startTime) || null, // ★ HH:mm→適切な形式に変換
      endTime: parseInputTime(ev.endTime) || null,
      user_id: userId,
      allDay: ev.allDay || false,  // ★ 終日フラグ
      sleep: ev.sleep || false,    // ★ 睡眠イベントフラグ
    };

    const { error } = await supabase.from("schedule_list").insert([payload]);
    if (error) console.error(error);
    else setEditingEvent(null); // ★ 保存後ポップアップ閉じる
  };

  // ------------------------------
  // 📌 既存イベント更新
  // ------------------------------
  const updateEvent = async (ev) => {
    const payload = { ...ev }; // ★ 変更データ
    const { error } = await supabase
      .from("schedule_list")
      .update(payload)
      .eq("no", ev.no);        // ★ イベント番号で特定

    if (error) console.error(error);
    else setEditingEvent(null); // ★ 更新後ポップアップ閉じる
  };

  // ------------------------------
  // 📌 イベント削除
  // ------------------------------
  const handleDelete  = async (no) => {
    if (!no) return; // ★ noがない場合は処理しない
    const { error } = await supabase.from("schedule_list").delete().eq("no", no);
    if (error) console.error(error);
    else fetchEvents(); // ★ 削除後に一覧を再取得
  };

  // ------------------------------
  // 📌 JSX描画
  // ------------------------------
  return (
    <div className="calendar-edit-container">
      {/* カレンダー表示 */}
      <CalendarLayout 
        events={events} 
        onEventClick={ev => setEditingEvent(ev)} // ★ カレンダークリックで編集ポップアップ
      />

      {/* スケジュールリスト表示（編集・削除可能） */}
      <ScheduleListLayout
        events={events}
        onEdit={no => {
          const ev = events.find(e => e.no === no);
          if (ev) setEditingEvent(ev); // ★ 編集ボタンでポップアップ
        }}
        onDelete={handleDelete}       // ★ 削除ボタン
        editable
        userId={userId}
      />

      {/* 新規イベント追加ボタン */}
      <button className="btn-add-event" onClick={() => setEditingEvent({})}> + </button>

      {/* 編集中のイベントがある場合のみポップアップ表示 */}
      {editingEvent && (
        <EventEditPopup
          event={editingEvent}
          onDelete={handleDelete}                  // ★ 削除処理
          onClose={() => setEditingEvent(null)}    // ★ ポップアップ閉じる
          onSave={ev => {
            if (ev.no) updateEvent(ev);           // ★ 既存イベントなら更新
            else saveNewEvent(ev);                // ★ 新規イベントなら追加
            fetchEvents();                        // ★ 保存後一覧を再取得
          }}
        />
      )}
    </div>
  );
};

export default RuchisukeEdit;
