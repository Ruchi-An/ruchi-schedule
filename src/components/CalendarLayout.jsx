// ------------------------------
// 📌 CalendarLayout.jsx
// カレンダー表示コンポーネント
// 月表示・前後移動・今日に戻る・イベント表示・クリックでポップアップ対応
// ------------------------------

import React from "react";
import dayjs from "dayjs";
import isoWeek from "dayjs/plugin/isoWeek.js";            // ★ ISO週の計算用
import { holidays } from "../utils/holidays.js";          // ★ 祝日リスト
import { getTimeBorderClass } from "../utils/timeBorderClass"; // ★ 時間帯クラス・時間表示用
import { displayTime } from "../utils/timeUtils"; // ★ 時間フォーマット用ユーティリティ
import styles from "./CalendarLayout.module.css";         // ★ CSSモジュール

dayjs.extend(isoWeek);

const CalendarLayout = ({ events = [], onEventClick }) => {
  const today = dayjs();                        // ★ 今日の日付
  const [currentMonth, setCurrentMonth] = React.useState(today); // ★ 表示中の月

  // ------------------------------
  // 📌 年・月のセレクト用配列
  // ------------------------------
  const years = Array.from({ length: 7 }, (_, i) => today.year() - 3 + i); // 3年前〜3年後
  const months = Array.from({ length: 12 }, (_, i) => i + 1);              // 1月〜12月

  // ------------------------------
  // 📌 月・年変更ハンドラー
  // ------------------------------
  const handleYearChange = (e) =>
    setCurrentMonth(currentMonth.year(parseInt(e.target.value, 10)));
  const handleMonthChange = (e) =>
    setCurrentMonth(currentMonth.month(parseInt(e.target.value, 10) - 1));

  // ------------------------------
  // 📌 前月 / 次月 / 今日へ
  // ------------------------------
  const prevMonth = () => setCurrentMonth(currentMonth.subtract(1, "month"));
  const nextMonth = () => setCurrentMonth(currentMonth.add(1, "month"));
  const goToToday = () => setCurrentMonth(today);

  // ------------------------------
  // 📌 カレンダーの日付生成
  // 月初の週初めから月末の週末まで
  // ------------------------------
  const start = currentMonth.startOf("month").startOf("week").add(1, "day");
  const end = currentMonth.endOf("month").endOf("week").add(1, "day");

  const calendar = [];
  let d = start.clone();
  while (d.isBefore(end) || d.isSame(end, "day")) {
    calendar.push(d.clone());
    d = d.add(1, "day");
  }

  // ------------------------------
  // 📌 日ごとのイベント取得
  // ------------------------------
  const getEventsForDay = (date) =>
    events.filter((e) => e.date === date.format("YYYY-MM-DD"));

  const weekdays = ["Mon.", "Tue.", "Wed.", "Thu.", "Fri.", "Sat.", "Sun."];
  const isMobile = window.innerWidth <= 768; // ★ モバイル表示判定

  // ------------------------------
  // 📌 JSX描画
  // ------------------------------
  return (
    <div className={styles.calendarContainer}>
      {/* 月移動・今日ボタン */}
      <div className={styles.calendarControls}>
        <button className={styles.btnMonth} onClick={prevMonth}>◀</button>
        <div className={styles.calendarSelects}>
          {/* 年セレクト */}
          <select value={currentMonth.year()} onChange={handleYearChange}>
            {years.map((y) => (
              <option key={y} value={y}>{y}年</option>
            ))}
          </select>

          {/* 月セレクト */}
          <select value={currentMonth.month() + 1} onChange={handleMonthChange}>
            {months.map((m) => (
              <option key={m} value={m}>{m}月</option>
            ))}
          </select>

          {/* 今日ボタン */}
          <button className={styles.btnToday} onClick={goToToday}>今日</button>
        </div>
        <button className={styles.btnMonth} onClick={nextMonth}>▶</button>
      </div>

      {/* 曜日表示 */}
      <div className={styles.calendarWeekdays}>
        {weekdays.map((d) => (
          <div key={d}>{d}</div>
        ))}
      </div>

      {/* 日付マス */}
      <div className={styles.calendarDays}>
        {calendar.map((day) => {
          const isCurrent = day.month() === currentMonth.month(); // ★ 当月かどうか
          const isToday = day.isSame(today, "day");               // ★ 今日かどうか
          const isSaturday = day.day() === 6;
          const isSunday = day.day() === 0;
          const isHoliday = holidays.includes(day.format("YYYY-MM-DD"));

          const dayEvents = getEventsForDay(day); // ★ 日付に紐づくイベント一覧

          return (
            <div
              key={day.format("YYYY-MM-DD")}
              className={[
                styles.calendarDay,
                !isCurrent ? styles.otherMonth : "",
                isToday ? styles.today : "",
                isSaturday ? styles.sat : "",
                isSunday ? styles.sun : "",
                isHoliday ? styles.holiday : "",
              ]
                .filter(Boolean)
                .join(" ")}
            >
              {/* 日付番号 */}
              <span className={styles.dayNumber}>{day.date()}</span>

              {/* イベントリスト */}
              <ul className={styles.eventsList}>
                {dayEvents.map((ev, i) => {
                  const borderClass = getTimeBorderClass(ev); // ★ 時間帯で色分け

                  return (
                    <li
                      key={i}
                      className={`${styles.eventItem} ${styles[borderClass]}`}
                      onClick={() => onEventClick && onEventClick(ev)} // ★ クリックでポップアップ
                    >
                      {isMobile
                        ? ev.category // モバイルはカテゴリだけ
                        : `${ev.category}｜${ev.title}（${displayTime(ev.startTime)}${ev.endTime ? `〜${displayTime(ev.endTime)}` : ""}）`}
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CalendarLayout;
