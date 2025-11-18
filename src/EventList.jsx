import React from "react";

const EventList = ({ events = [], onEdit, onDelete, editable = false, userId }) => {
  // 日付順ソート（未定は最後）
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

  console.log("EventList received events:", events);

  return (
    <div className="w-full">
      <div className="bg-indigo-900/25 backdrop-blur-xl p-4 rounded-2xl">
        <h3 className="text-cyan-300 font-semibold mb-3">📋 登録済みイベント</h3>

        {sortedEvents.length === 0 ? (
          <p className="text-gray-400">イベントはまだありません</p>
        ) : (
          <ul className="space-y-3">
            {sortedEvents.map((ev) => (
              <li key={ev.no} className="bg-indigo-800/40 p-3 rounded flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <span className="text-white font-bold">
                      {ev.date || "未定"} {ev.time || ""}
                    </span>
                    <span className="text-cyan-300">
                      {ev.title} <span className="text-gray-300">[{ev.type}]</span>
                    </span>
                  </div>
                  {ev.summary && <div className="text-gray-300 mt-2 text-sm break-words">{ev.summary}</div>}
                </div>

                {editable && (
                  <div className="flex flex-col gap-2 ml-4">
                    <button
                      onClick={() => {
                        console.log("編集ボタン押された ev.no:", ev.no);
                        onEdit && onEdit(ev.no)
                      }}
                      className="px-2 py-1 bg-yellow-400 rounded hover:bg-yellow-500 text-xs"
                    >
                      編集
                    </button>
                    <button
                      onClick={() => {
                        console.log("削除ボタン押された ev.no:", ev.no);
                        console.log("ユーザーID", userId);
                        onDelete && onDelete(ev.no, userId)
                      }}
                      className="px-2 py-1 bg-red-500 rounded hover:bg-red-600 text-xs"
                    >
                      削除
                    </button>
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
