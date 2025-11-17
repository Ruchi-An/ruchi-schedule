import React from "react";

const CalendarView = ({ events, onEdit, onDelete }) => {
  return (
    <div className="grid grid-cols-7 gap-2 p-4 bg-gray-900 rounded-xl text-white">
      {events.length === 0 && <div className="col-span-7 text-center py-4">予定はありません</div>}

      {events.map((ev) => (
        <div
          key={ev.no}
          className="bg-indigo-800/50 rounded-lg p-2 flex flex-col gap-1 shadow-md hover:shadow-lg transition"
        >
          <div className="flex justify-between items-center">
            <span className="font-semibold">{ev.title}</span>
            <div className="flex gap-1">
              <button
                onClick={() => onEdit && onEdit(ev.no)}
                className="px-2 py-1 bg-yellow-400 rounded hover:bg-yellow-500 text-xs"
              >
                編集
              </button>
              <button
                onClick={() => onDelete && onDelete(ev.no)}
                className="px-2 py-1 bg-red-500 rounded hover:bg-red-600 text-xs"
              >
                削除
              </button>
            </div>
          </div>
          <div className="text-xs text-gray-300">
            {ev.date ? `${ev.date} ${ev.time || ""}` : "日時未設定"}
          </div>
          {ev.type && <div className="text-xs text-cyan-300">{ev.type}</div>}
          {ev.summary && <div className="text-xs text-gray-400 truncate">{ev.summary}</div>}
        </div>
      ))}
    </div>
  );
};

export default CalendarView;
