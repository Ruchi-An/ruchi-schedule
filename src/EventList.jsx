import React from "react";
import "./EventList.css";
import "./Type.css";

const EventList = ({ events = [], onEdit, onDelete, editable = false, userId }) => {

  // 時間を "21:00:00" → "21:00" にする
  const formatTime = (time) => {
    if (!time) return "";
    return time.slice(0, 5);
  };

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
    <div className="eventlist-container">
      <h3>スケジュールリスト</h3>

      {sortedEvents.length === 0 ? (
        <p className="no-events">イベントはまだありません</p>
      ) : (
        <ul className="eventlist">
          {sortedEvents.map((ev) => (
            <li key={ev.no} className={`eventlist-item type-${ev.type}`}>
              <div className="event-info">

                {/* 日付 + 時間 */}
                <div className="event-date">
                  {ev.date || "未定"}
                  {ev.time && `（${formatTime(ev.time)}）`}
                </div>

                {/* タイトル（大きめ） */}
                <div className="event-title">{ev.title}</div>

                {/* 概要 */}
                {ev.summary && (
                  <div className="event-summary">{ev.summary}</div>
                )}
              </div>

              {editable && (
                <div className="event-actions">
                  <button onClick={() => onEdit && onEdit(ev.no)} className="btn-edit">編集</button>
                  <button onClick={() => onDelete && onDelete(ev.no, userId)} className="btn-delete">削除</button>
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
