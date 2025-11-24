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
import { parseInputTime, displayTime } from "../utils/timeUtils";    // ★ 時間フォーマット用ユーティリティ


const RuchisukeView = ({ userId }) => {
  // ------------------------------
  // 📌 state管理
  // ------------------------------
  const [events, setEvents] = useState([]);         // ★ 取得したイベント一覧
  const [selectedEvent, setSelectedEvent] = useState(null); // ★ クリックされたイベント（ポップアップ表示用）
  const [offDays, setOffDays] = useState([]);               // ★ offDay（日付文字列配列）


  // ------------------------------
  // 📌 イベント取得関数
  // ------------------------------
  const fetchEvents = async () => {
    const { data, error } = await supabase
      .from("schedule_list")
      .select("*")
      .eq("user_id", userId)
      .order("date", { ascending: true })
      .order("startTime", { ascending: true });

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
  useEffect(() => {
    fetchEvents();      // イベント取得
    fetchOffDays();     // offDay取得（これだけで setOffDays する）

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
  // 📌 カレンダーのイベントクリック時
  // ------------------------------
  const handleEventClick = (event) => {
    console.log("CLICK:", event); // ★ どのイベントがクリックされたか確認
    setSelectedEvent(event);      // ★ ポップアップ表示用stateにセット
  };

  // ------------------------------
  // 📌 offDayチェックボックス変更時
  // ------------------------------
  const handleToggleOffDay = (dateStr) => {
    setOffDays(prev => {
      if (prev.includes(dateStr)) {
        // 既にoffDayなら削除
        return prev.filter(d => d !== dateStr);
      } else {
        // 新規追加
        return [...prev, dateStr];
      }
    });
  };

  // ------------------------------
  // 📌 JSX描画部分
  // ------------------------------
  return (
    <div className="w-full max-w-[1600px] flex flex-col gap-6 mx-auto">
      {/* カレンダー表示 */}
      <CalendarLayout
        events={events}
        onEventClick={handleEventClick}
        offDays={offDays}       // ★ 背景ハイライトのみ反映
        isEditable={false}      // ★ チェックボックス非表示
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
