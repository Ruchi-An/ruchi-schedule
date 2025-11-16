import React from "react";
import dayjs from "dayjs";
import isoWeek from "dayjs/plugin/isoWeek.js";
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

  const weekdays = ["月", "火", "水", "木", "金", "土", "日"];

  return (
    <div className="relative w-full p-4 rounded-2xl overflow-hidden mx-auto">
      <div className="absolute inset-0 bg-indigo-900/20 backdrop-blur-2xl rounded-2xl"></div>

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
          <button onClick={prevMonth} className="px-3 py-1 rounded-2xl bg-indigo-800/50 text-white shadow-[0_0_12px_#00ffff60] hover:bg-indigo-700/60">
            ◀ 前月
          </button>

          <div className="flex items-center gap-3">
            <select value={currentMonth.year()} onChange={handleYearChange} className="bg-indigo-800/50 text-white px-3 py-1 rounded-2xl border border-cyan-300/50 shadow-[0_0_8px_#00ffff50]">
              {years.map((y) => (<option key={y} value={y}>{y}年</option>))}
            </select>

            <select value={currentMonth.month() + 1} onChange={handleMonthChange} className="bg-indigo-800/50 text-white px-3 py-1 rounded-2xl border border-cyan-300/50 shadow-[0_0_8px_#00ffff50]">
              {months.map((m) => (<option key={m} value={m}>{m}月</option>))}
            </select>

            <button onClick={goToToday} className="bg-indigo-800/50 text-white px-3 py-1 rounded-2xl border border-cyan-300/50 shadow-[0_0_8px_#00ffff50]">
              今日
            </button>
          </div>

          <button onClick={nextMonth} className="px-3 py-1 rounded-2xl bg-indigo-800/50 text-white shadow-[0_0_12px_#00ffff60] hover:bg-indigo-700/60">
            次月 ▶
          </button>
        </div>

        <div className="grid grid-cols-7 text-center text-white font-bold drop-shadow-[0_0_8px_#00ffff80]">
          {weekdays.map((d) => (<div key={d} className="p-2">{d}</div>))}
        </div>

        <div className="grid grid-cols-7 text-center mt-1 gap-1">
          {calendar.map((day) => {
            const isCurrent = day.month() === currentMonth.month();
            const isToday = day.isSame(today, "day");
            return (
              <div key={day.format("YYYY-MM-DD")} className={`p-2 min-h-[5.2rem] rounded-xl border ${isCurrent ? "bg-indigo-900/40" : "bg-indigo-900/10"} border-blue-400/60 ${isToday ? "shadow-[0_0_20px_#ffee88] border-yellow-300" : ""}`}>
                <span className="text-white font-bold drop-shadow-[0_0_6px_#00ffff]">{day.date()}</span>

                <ul className="mt-1 text-xs flex flex-col gap-0.5">
                  {getEventsForDay(day).map((ev, i) => (
                    <li key={i} className="bg-cyan-400/60 text-white px-1 rounded text-[0.65rem] truncate shadow-[0_0_5px_#00ffff]">
                      {ev.title}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CalendarLayout;
