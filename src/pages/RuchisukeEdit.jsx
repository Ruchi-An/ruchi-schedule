// ------------------------------
// 📌 RuchisukeEdit.jsx
// ユーザーのスケジュールを編集・追加・削除できるコンポーネント
// カレンダー・リスト・編集用ポップアップ対応
// offDay対応（カレンダー右上チェックボックス）追加
// ------------------------------

import React, { useState, useEffect } from "react";
import CalendarLayout from "../components/CalendarLayout.jsx";        // ★ カレンダー表示用
import ScheduleListLayout from "../components/ScheduleListLayout.jsx"; // ★ リスト表示用（編集可能）
import EventEditPopup from "../components/EventEditPopup.jsx";        // ★ イベント編集用ポップアップ
import { supabase } from "../services/supabaseClient.js";            // ★ Supabaseクライアント
import { parseInputTime, displayTime } from "../utils/timeUtils";    // ★ 時間フォーマット用ユーティリティ
import styles from "../components/CalendarLayout.module.css";


const RuchisukeEdit = ({ userId }) => {
  // ------------------------------
  // 📌 state管理
  // ------------------------------
  const [events, setEvents] = useState([]);                  // ★ 取得したイベント一覧
  const [editingEvent, setEditingEvent] = useState(null);    // ★ 編集中のイベント（ポップアップ用）
  const [offDays, setOffDays] = useState([]);               // ★ offDay（日付文字列配列）

  // ------------------------------
  // 📌 Supabaseからイベント取得関数
  // ------------------------------
  const fetchEvents = async () => {
    const { data, error } = await supabase
      .from("schedule_list")
      .select("*")
      .eq("user_id", userId)
      .order("date", { ascending: true })

    if (error) console.error(error); // ★ エラーがあればコンソール表示
    else setEvents(data || []);      // ★ データがない場合は空配列
  };

  const fetchOffDays = async () => {
    const { data, error } = await supabase
      .from("days_status")
      .select("date")
      .eq("user_id", userId)
      .eq("offDay", true);

    if (error) console.error(error);
    else setOffDays(data.map(d => d.date)); // YYYY-MM-DD配列
  };

  // ------------------------------
  // 📌 初回レンダリング & リアルタイム更新
  // ------------------------------
  // useEffectに追加
  useEffect(() => {
    fetchEvents();
    fetchOffDays(); // ★ offDay取得

    const eventChannel = supabase
      .channel("public:schedule_list")
      .on("postgres_changes", { event: "*", schema: "public", table: "schedule_list" }, () => fetchEvents())
      .subscribe();

    const offDayChannel = supabase
      .channel("public:days_status")
      .on("postgres_changes", { event: "*", schema: "public", table: "days_status" }, () => fetchOffDays())
      .subscribe();

    return () => {
      supabase.removeChannel(eventChannel);
      supabase.removeChannel(offDayChannel);
    };
  }, [userId]);

  // ------------------------------
  // 📌 新規イベント追加（修正版）
  // ------------------------------
  const saveNewEvent = async (ev) => {
    // startTime / endTime を parseInputTime で HH:mm:ss に変換
    const startParsed = ev.startTime
      ? parseInputTime(ev.startTime, ev.date)
      : { time: null, date: ev.date || null };

    const endParsed = ev.endTime
      ? parseInputTime(ev.endTime, ev.date)
      : { time: null, date: startParsed.date };

    const payload = {
      ...ev,

      // DB 用
      startTime: startParsed.time,
      endTime: endParsed.time,
      date: startParsed.date,

      // ユーザーID・フラグ
      user_id: userId,
      allDay: ev.allDay || false,
    };

    const { error } = await supabase.from("schedule_list").insert([payload]);
    if (error) console.error(error);
    else setEditingEvent(null); // 保存後ポップアップ閉じる
  };

  // ------------------------------
  // 📌 既存イベント更新
  // ------------------------------
  const updateEvent = async (ev) => {
    const payload = {
      ...ev,
      date: ev.date && ev.date !== "" ? ev.date : null,
      startTime: ev.startTime
        ? parseInputTime(ev.startTime, ev.date).time
        : null,
      endTime: ev.endTime
        ? parseInputTime(ev.endTime, ev.date).time
        : null,
      allDay: ev.allDay || false,
    };

    const { error } = await supabase
      .from("schedule_list")
      .update(payload)
      .eq("no", ev.no);

    if (error) console.error(error);
    else setEditingEvent(null);
  };

  // ------------------------------
  // 📌 イベント削除
  // ------------------------------
  const handleDelete = async (no) => {
    if (!no) return; // ★ noがない場合は処理しない
    const { error } = await supabase.from("schedule_list").delete().eq("no", no);
    if (error) console.error(error);
    else fetchEvents(); // ★ 削除後に一覧を再取得
  };

  // ------------------------------
  // 📌 offDayチェックボックス変更時（完全版）
  // ------------------------------
  const handleToggleOffDay = async (dateStr) => {
    if (!userId) {
      console.error("userId が渡されていません");
      return;
    }

    try {
      // 1️⃣ 既存レコード確認
      const { data: existing, error: fetchError } = await supabase
        .from("days_status")
        .select("*")
        .eq("user_id", userId)
        .eq("date", dateStr)
        .limit(1)
        .single();

      if (fetchError && fetchError.code !== "PGRST116") {
        console.error("既存取得エラー:", fetchError);
        return;
      }

      // 2️⃣ 更新 or 挿入
      if (existing) {
        const { error: updateError } = await supabase
          .from("days_status")
          .update({ offDay: !existing.offDay })
          .eq("date", dateStr)
          .eq("user_id", userId); // 忘れずにユーザーIDも条件に

        if (updateError) {
          console.error("更新エラー:", updateError);
          return;
        }
      } else {
        const { error: insertError } = await supabase
          .from("days_status")
          .insert([{ date: dateStr, offDay: true, user_id: userId }]);

        if (insertError) {
          console.error("挿入エラー:", insertError);
          return;
        }
      }

      // 3️⃣ ローカル state 更新
      setOffDays((prev) =>
        prev.includes(dateStr)
          ? prev.filter((d) => d !== dateStr)
          : [...prev, dateStr]
      );
    } catch (err) {
      console.error("handleToggleOffDay で予期せぬエラー:", err);
    }
  };

  // ------------------------------
  // 📌 JSX描画
  // ------------------------------
  return (
    <div className="calendar-edit-container">
      {/* ------------------------------ */}
      {/* カレンダー表示（offDay対応） */}
      {/* ------------------------------ */}
      <CalendarLayout
        events={events}
        onEventClick={ev => setEditingEvent(ev)}
        offDays={offDays}
        onToggleOffDay={handleToggleOffDay} // ★ 完全版関数
        isEditable={true}
      />
      {/* ------------------------------ */}
      {/* スケジュールリスト表示（編集・削除可能） */}
      {/* ------------------------------ */}
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

      {/* ------------------------------ */}
      {/* 新規イベント追加ボタン */}
      {/* ------------------------------ */}
      <button
        className={styles.addButton}
        onClick={() => setEditingEvent({})}
      >
        +
      </button>

      {/* ------------------------------ */}
      {/* 編集中のイベントがある場合のみポップアップ表示 */}
      {/* ------------------------------ */}
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
