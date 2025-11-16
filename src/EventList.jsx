import React from "react";

const EventList = ({ events = [], onDelete, onEdit, editable = false }) => {
  const sortedEvents = [...events].sort((a, b) => {
    const hasDateA = a.date && a.date.trim() !== "";
    const hasDateB = b.date && b.date.trim() !== "";

    if (!hasDateA && hasDateB) return 1;
    if (hasDateA && !hasDateB) return -1;
    if (!hasDateA && !hasDateB) return 0;

    const dateA = new Date(`${a.date} ${a.time || "00:00"}`);
    const dateB = new Date(`${b.date} ${b.time || "00:00"}`);
    return dateA - dateB;
  });

  return (
    <div className="w-full">
      <div className="bg-indigo-900/25 backdrop-blur-xl p-4 rounded-2xl">
        <h3 className="text-cyan-300 font-semibold mb-3">📋 登録済みイベント</h3>

        {sortedEvents.length === 0 ? (
          <p className="text-gray-400">イベントはまだありません</p>
        ) : (
          <ul className="space-y-3">
            {sortedEvents.map((ev, idx) => (
              <li key={idx} className="bg-indigo-800/40 p-3 rounded flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <span className="text-white font-bold">{ev.date || "未定"} {ev.time || ""}</span>
                    <span className="text-cyan-300">{ev.title} <span className="text-gray-300">[{ev.type}]</span></span>
                  </div>
                  {ev.detail && <div className="text-gray-300 mt-2 text-sm break-words">{ev.detail}</div>}
                </div>

                {editable && (
                  <div className="flex flex-col gap-2 ml-4">
                    <button onClick={() => onEdit && onEdit(idx)} className="px-2 py-1 bg-yellow-400 rounded hover:bg-yellow-500">編集</button>
                    <button onClick={() => onDelete && onDelete(idx)} className="px-2 py-1 bg-red-500 rounded hover:bg-red-600">削除</button>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default EventList;
