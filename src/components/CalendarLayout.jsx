import React from "react";
import dayjs from "dayjs";
import isoWeek from "dayjs/plugin/isoWeek.js";
import { holidays } from "../utils/holidays.js";
import { getTimeBorderClass, displayTime } from "../utils/timeBorderClass";
import styles from "./CalendarLayout.module.css";

dayjs.extend(isoWeek);

const CalendarLayout = ({ events = [], onEventClick }) => {
  const today = dayjs();
  const [currentMonth, setCurrentMonth] = React.useState(today);

  const years = Array.from({ length: 7 }, (_, i) => today.year() - 3 + i);
  const months = Array.from({ length: 12 }, (_, i) => i + 1);

  const handleYearChange = (e) =>
    setCurrentMonth(currentMonth.year(parseInt(e.target.value, 10)));
  const handleMonthChange = (e) =>
    setCurrentMonth(currentMonth.month(parseInt(e.target.value, 10) - 1));

  const prevMonth = () => setCurrentMonth(currentMonth.subtract(1, "month"));
  const nextMonth = () => setCurrentMonth(currentMonth.add(1, "month"));
  const goToToday = () => setCurrentMonth(today);

  const start = currentMonth.startOf("month").startOf("week").add(1, "day");
  const end = currentMonth.endOf("month").endOf("week").add(1, "day");

  const calendar = [];
  let d = start.clone();
  while (d.isBefore(end) || d.isSame(end, "day")) {
    calendar.push(d.clone());
    d = d.add(1, "day");
  }

  const getEventsForDay = (date) =>
    events.filter((e) => e.date === date.format("YYYY-MM-DD"));

  const weekdays = ["Mon.", "Tue.", "Wed.", "Thu.", "Fri.", "Sat.", "Sun."];
  const isMobile = window.innerWidth <= 768;

  return (
    <div className={styles.calendarContainer}>
      {/* 月切り替え */}
      <div className={styles.calendarControls}>
        <button className={styles.btnMonth} onClick={prevMonth}>◀</button>
        <div className={styles.calendarSelects}>
          <select value={currentMonth.year()} onChange={handleYearChange}>
            {years.map((y) => (
              <option key={y} value={y}>{y}年</option>
            ))}
          </select>
          <select value={currentMonth.month() + 1} onChange={handleMonthChange}>
            {months.map((m) => (
              <option key={m} value={m}>{m}月</option>
            ))}
          </select>
          <button className={styles.btnToday} onClick={goToToday}>今日</button>
        </div>
        <button className={styles.btnMonth} onClick={nextMonth}>▶</button>
      </div>

      {/* 曜日 */}
      <div className={styles.calendarWeekdays}>
        {weekdays.map((d) => (
          <div key={d}>{d}</div>
        ))}
      </div>

      {/* 日付マス */}
      <div className={styles.calendarDays}>
        {calendar.map((day) => {
          const isCurrent = day.month() === currentMonth.month();
          const isToday = day.isSame(today, "day");
          const isSaturday = day.day() === 6;
          const isSunday = day.day() === 0;
          const isHoliday = holidays.includes(day.format("YYYY-MM-DD"));

          const dayEvents = getEventsForDay(day);

          return (
            <div
              key={day.format("YYYY-MM-DD")}
              className={styles.calendarDay}
            >
              <span className={styles.dayNumber}>{day.date()}</span>

              {/* イベント表示：クリックで開く */}
              <ul className={styles.eventsList}>
                {dayEvents.map((ev, i) => {
                  const borderClass = getTimeBorderClass(ev);

                  return (
                    <li
                      key={i}
                      className={`${styles.eventItem} ${styles[borderClass]}`}
                      onClick={() => onEventClick && onEventClick(ev)}   // ←★ここでポップアップ開く！
                    >
                      {isMobile
                        ? ev.category
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
