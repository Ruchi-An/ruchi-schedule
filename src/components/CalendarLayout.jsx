// ------------------------------
// 📌 CalendarLayout.jsx
// 編集/参照兼用カレンダー表示コンポーネント（offDay対応）
// isEditable: 編集ページならtrue、参照ページならfalse
// ------------------------------

import React from "react";
import dayjs from "dayjs";
import isoWeek from "dayjs/plugin/isoWeek.js";
import { holidays } from "../utils/holidays.js";
import { getTimeBorderClass } from "../utils/timeBorderClass.js";
import { displayTime } from "../utils/timeUtils.js";
import styles from "./CalendarLayout.module.css";

dayjs.extend(isoWeek);

const CalendarLayout = ({
  events = [],                // ★ イベント一覧
  onEventClick,               // ★ イベントクリックハンドラー
  offDays = [],               // ★ offDay配列（YYYY-MM-DD）
  onToggleOffDay,             // ★ チェックボックス変更ハンドラー（編集ページのみ）
  isEditable = false          // ★ 編集ページフラグ
}) => {
  const today = dayjs();
  const [currentMonth, setCurrentMonth] = React.useState(today);

  // 年・月セレクト用配列
  const years = Array.from({ length: 7 }, (_, i) => today.year() - 3 + i);
  const months = Array.from({ length: 12 }, (_, i) => i + 1);

  // 年月変更ハンドラー
  const handleYearChange = (e) =>
    setCurrentMonth(currentMonth.year(parseInt(e.target.value, 10)));
  const handleMonthChange = (e) =>
    setCurrentMonth(currentMonth.month(parseInt(e.target.value, 10) - 1));

  // 前月・次月・今日ボタン
  const prevMonth = () => setCurrentMonth(currentMonth.subtract(1, "month"));
  const nextMonth = () => setCurrentMonth(currentMonth.add(1, "month"));
  const goToToday = () => setCurrentMonth(today);

  // 月初〜月末の日付配列生成
  const start = currentMonth.startOf("month").startOf("week").add(1, "day");
  const end = currentMonth.endOf("month").endOf("week").add(1, "day");

  const calendar = [];
  let d = start.clone();
  while (d.isBefore(end) || d.isSame(end, "day")) {
    calendar.push(d.clone());
    d = d.add(1, "day");
  }

  // 日ごとのイベント取得
  const getEventsForDay = (date) =>
    events.filter((e) => e.displayDate === date.format("YYYY-MM-DD"));

  const weekdays = ["Mon.", "Tue.", "Wed.", "Thu.", "Fri.", "Sat.", "Sun."];
  const isMobile = window.innerWidth <= 768;

  // offDays安全配列化
  const safeOffDays = Array.isArray(offDays) ? offDays : [];

  return (
    <div className={styles.calendarContainer}>
      {/* 月移動・今日ボタン */}
      <div className={styles.calendarControls}>
        <button className={styles.btnMonth} onClick={prevMonth}>◀</button>
        <div className={styles.calendarSelects}>
          <select value={currentMonth.year()} onChange={handleYearChange}>
            {years.map((y) => <option key={y} value={y}>{y}年</option>)}
          </select>
          <select value={currentMonth.month() + 1} onChange={handleMonthChange}>
            {months.map((m) => <option key={m} value={m}>{m}月</option>)}
          </select>
          <button className={styles.btnToday} onClick={goToToday}>今日</button>
        </div>
        <button className={styles.btnMonth} onClick={nextMonth}>▶</button>
      </div>

      {/* 曜日ヘッダー */}
      <div className={styles.calendarWeekdays}>
        {weekdays.map((d) => <div key={d}>{d}</div>)}
      </div>

      {/* 日付マス */}
      <div className={styles.calendarDays}>
        {calendar.map((day) => {
          const dayStr = day.format("YYYY-MM-DD");
          const isCurrent = day.month() === currentMonth.month();
          const isToday = day.isSame(today, "day");
          const isSaturday = day.day() === 6;
          const isSunday = day.day() === 0;
          const isHoliday = holidays.includes(dayStr);

          const dayEvents = getEventsForDay(day);
          const isOffDay = safeOffDays.includes(dayStr);

          return (
            <div
              key={dayStr}
              className={[
                styles.calendarDay,
                !isCurrent ? styles.otherMonth : "",
                isToday ? styles.today : "",
                isSaturday ? styles.sat : "",
                isSunday ? styles.sun : "",
                isHoliday ? styles.holiday : "",
                isOffDay ? styles.offDay : "", // ★ 背景ハイライト
              ].filter(Boolean).join(" ")}
            >
              {/* 日付番号＋チェックボックス（編集ページのみ） */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span className={styles.dayNumber}>{day.date()}</span>
                {isEditable && (
                  <input
                    type="checkbox"
                    checked={isOffDay}
                    onChange={() => onToggleOffDay(dayStr, !isOffDay)} // ←新しく「次の状態」を渡す
                    style={{ width: "16px", height: "16px" }}
                  />
                )}
              </div>

              {/* イベントリスト */}
              <ul className={styles.eventsList}>
                {dayEvents
                  .sort((a, b) => {
                    // displayStartTime が null/undefined なら "00:00" にフォールバック
                    const aTime = a.displayStartTime || "00:00";
                    const bTime = b.displayStartTime || "00:00";

                    const [aH, aM] = aTime.split(":").map(Number);
                    const [bH, bM] = bTime.split(":").map(Number);

                    const aMinutes = (aH < 6 ? aH + 24 : aH) * 60 + aM;
                    const bMinutes = (bH < 6 ? bH + 24 : bH) * 60 + bM;

                    return aMinutes - bMinutes;
                  })
                  .map((ev, i) => {
                    const borderClass = getTimeBorderClass(ev);
                    return (
                      <li
                        key={i}
                        className={`${styles.eventItem} ${styles[borderClass]}`}
                        onClick={() => onEventClick && onEventClick(ev)}
                      >
                        {isMobile
                          ? ev.category
                          : `${ev.category}｜${ev.title}（${ev.displayStartTime || "未定"}${ev.displayEndTime ? `~${ev.displayEndTime}` : ""}）`}
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
