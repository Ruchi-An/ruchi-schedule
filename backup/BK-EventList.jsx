import React from "react";

const EventList = ({ events, onDelete, onEdit, editable = false }) => {
  // ===== ソート処理 =====
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
    <div className="bg-gray-800 p-4 rounded-lg mb-6">
      <h3 className="text-cyan-300 font-semibold mb-2">📋 登録済みイベント</h3>

      {sortedEvents.length === 0 ? (
        <p className="text-gray-400">イベントはまだありません</p>
      ) : (
        <ul className="space-y-2">
          {sortedEvents.map((ev, idx) => (
            <li key={idx} className="bg-gray-700 p-3 rounded flex justify-between">
              {/* 左側：日時 + タイトル[カテゴリ] */}
              <div>
                <div className="flex items-start gap-4">
                  <span className="text-white font-bold">
                    {ev.date || "未定"} {ev.time || ""}
                  </span>
                  <span className="text-cyan-300">
                    {ev.title} [{ev.type}]
                  </span>
                </div>

                {/* 下段：詳細 */}
                {ev.detail && (
                  <div className="text-gray-300 mt-1 text-sm">
                    {ev.detail}
                  </div>
                )}
              </div>

              {/* 右側：編集 / 削除ボタン（縦並び） */}
              {editable && (
                <div className="flex flex-col gap-1">
                  <button
                    onClick={() => onEdit(idx)}
                    className="px-2 py-1 bg-yellow-400 rounded hover:bg-yellow-500"
                  >
                    編集
                  </button>
                  <button
                    onClick={() => onDelete(idx)}
                    className="px-2 py-1 bg-red-500 rounded hover:bg-red-600"
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
  );
};

export default EventList;
