// ------------------------------
// 📌 RuchisukeView.jsx
// ユーザーごとのスケジュールを取得して表示するコンポーネント
// カレンダー・リスト表示・イベントポップアップに対応
// ------------------------------

import React, { useEffect, useState } from "react";
import CalendarLayout from "../components/CalendarLayout.jsx";      // ★ カレンダー表示用コンポーネント
import ScheduleListLayout from "../components/ScheduleListLayout.jsx"; // ★ リスト表示用コンポーネント
import EventPopup from "../components/EventPopup.jsx";               // ★ イベント詳細ポップアップ用
import { supabase } from "../services/supabaseClient.js";           // ★ Supabaseクライアント

const RuchisukeView = ({ userId }) => {
  // ------------------------------
  // 📌 state管理
  // ------------------------------
  const [events, setEvents] = useState([]);         // ★ 取得したイベント一覧
  const [selectedEvent, setSelectedEvent] = useState(null); // ★ クリックされたイベント（ポップアップ表示用）

  // ------------------------------
  // 📌 イベント取得関数
  // ------------------------------
  const fetchEvents = async () => {
    // SupabaseからユーザーIDに紐づくスケジュールを取得
    const { data, error } = await supabase
      .from("schedule_list")
      .select("*")
      .eq("user_id", userId)
      .order("date", { ascending: true }); // 日付順に並び替え

    if (error) {
      console.error("Fetch events failed:", error); // ★ エラー時はコンソール表示
    } else {
      setEvents(data || []); // ★ データがない場合は空配列を設定
    }
  };

  // ------------------------------
  // 📌 初回レンダリング & リアルタイム更新
  // ------------------------------
  useEffect(() => {
    fetchEvents(); // 初回取得

    // Supabase Realtimeでスケジュール変更を監視
    const channel = supabase
      .channel("public:schedule_list")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "schedule_list" }, // ★ INSERT/UPDATE/DELETEを監視
        () => fetchEvents() // 変更があれば再取得
      )
      .subscribe();

    // コンポーネントアンマウント時にチャンネル削除
    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId]); // ★ userIdが変わったら再実行

  console.log("RuchisukeView events:", events); // ★ デバッグ用

  // ------------------------------
  // 📌 カレンダーのイベントクリック時
  // ------------------------------
  const handleEventClick = (event) => {
    console.log("CLICK:", event); // ★ どのイベントがクリックされたか確認
    setSelectedEvent(event);      // ★ ポップアップ表示用stateにセット
  };

  // ------------------------------
  // 📌 JSX描画部分
  // ------------------------------
  return (
    <div className="w-full max-w-[1600px] flex flex-col gap-6 mx-auto">
      {/* カレンダー表示 */}
      <CalendarLayout 
        events={events} 
        onEventClick={handleEventClick} // ★ クリック時にポップアップを開く
      />

      {/* スケジュールリスト表示（編集不可） */}
      <ScheduleListLayout events={events} editable={false} />

      {/* 選択中イベントがある場合のみポップアップ表示 */}
      {selectedEvent && (
        <EventPopup 
          event={selectedEvent} 
          onClose={() => setSelectedEvent(null)} // ★ 閉じる時にstateリセット
        />
      )}
    </div>
  );
};

export default RuchisukeView;
