import React from "react";
import dayjs from "dayjs";
import isoWeek from "dayjs/plugin/isoWeek.js";
import "./CalendarLayout.css";

dayjs.extend(isoWeek);

const CalendarLayout = ({ events = [] }) => {
  const today = dayjs();
  const [currentMonth, setCurrentMonth] = React.useState(today);

  const years = Array.from({ length: 7 }, (_, i) => today.year() - 3 + i);
  const months = Array.from({ length: 12 }, (_, i) => i + 1);

  const handleYearChange = (e) => setCurrentMonth(currentMonth.year(parseInt(e.target.value)));
  const handleMonthChange = (e) => setCurrentMonth(currentMonth.month(parseInt(e.target.value) - 1));
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

  const getEventsForDay = (date) => events.filter((e) => e.date === date.format("YYYY-MM-DD"));
  const weekdays = ["Mon.", "Tue.", "Wed.", "Thu.", "Fri.", "Sat.", "Sun."];

  return (
    <div className="calendar-container">
      <div className="calendar-controls">
        <button className="btn-month" onClick={prevMonth}>◀</button>

        <div className="calendar-selects">
          <select value={currentMonth.year()} onChange={handleYearChange}>
            {years.map((y) => (<option key={y} value={y}>{y}年</option>))}
          </select>
          <select value={currentMonth.month() + 1} onChange={handleMonthChange}>
            {months.map((m) => (<option key={m} value={m}>{m}月</option>))}
          </select>
          <button className="btn-today" onClick={goToToday}>今日</button>
        </div>

        <button className="btn-month" onClick={nextMonth}>▶</button>
      </div>

      <div className="calendar-weekdays">
        {weekdays.map((d) => <div key={d}>{d}</div>)}
      </div>

      <div className="calendar-days">
        {calendar.map((day) => {
          const isCurrent = day.month() === currentMonth.month();
          const isToday = day.isSame(today, "day");

          // その日のイベント取得
          const dayEvents = getEventsForDay(day);

          // スマホ判定
          const isMobile = window.innerWidth <= 768;

          return (
            <div
              key={day.format("YYYY-MM-DD")}
              className={`calendar-day ${isCurrent ? "current-month" : "other-month"} ${isToday ? "today" : ""}`}
            >
              <span className="day-number">{day.date()}</span>
              <ul className="events-list">
                {dayEvents.map((ev, i) => {
                  const typeClass = ev.type
                    ? `type-${ev.type.replace(/\s+/g, "").toLowerCase()}`
                    : "";

                  return (
                    <li key={i} className={`event-item ${typeClass}`}>
                      {isMobile
                        ? ev.category
                        : `${ev.category}｜${ev.title}`}
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
