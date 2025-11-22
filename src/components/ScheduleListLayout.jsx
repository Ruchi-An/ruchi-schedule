import React, { useRef, useEffect } from "react";
import { getTimeBorderClass, displayTime } from "../utils/timeBorderClass";
import styles from "./ScheduleListLayout.module.css";

const ScheduleListLayout = ({ events, onEdit, onDelete, editable, scrollToEvent }) => {
  const eventRefs = useRef({});

  // 今日以降 or 未定のイベントだけに絞る
  const filteredEvents = events.filter(ev => !ev.date);

  // 並び替え：未定→今日以降、日付ありは時間順
  const sortedEvents = [...filteredEvents].sort((a, b) => {
    const hasDateA = !!a.date?.trim();
    const hasDateB = !!b.date?.trim();
    if (!hasDateA && hasDateB) return 1;
    if (hasDateA && !hasDateB) return -1;

    const dateA = new Date(`${a.date} ${a.startTime || "00:00"}`);
    const dateB = new Date(`${b.date} ${b.startTime || "00:00"}`);
    return dateA - dateB;
  });


  return (
    <div className={styles.schedulelistContainer}>
      <h4>未定の予定</h4>
      {sortedEvents.length === 0 ? (
        <p className={styles.noEvents}>未定の予定ありません</p>
      ) : (
        <ul className={styles.schedulelist}>
          {sortedEvents.map((ev) => {
            const borderClass = getTimeBorderClass(ev);
            return (
              <li
                key={ev.no}
                ref={el => { if(el) eventRefs.current[ev.no] = el; }}
                className={`${styles.schedulelistItem} ${styles[borderClass]}`}
              >
                <div className={styles.eventInfo}>
                  <div className={styles.eventTitle}>
                    {`${ev.category || "カテゴリ未設定"}｜${ev.title}`}
                  </div>
                  {ev.summary && <div className={styles.eventSummary}>{ev.summary}</div>}
                </div>
                {editable && (
                  <div className={styles.eventActions}>
                    <button onClick={() => onEdit?.(ev.no)} className={styles.btnEdit}>編集</button>
                    <button onClick={() => onDelete?.(ev.no)} className={styles.btnDelete}>削除</button>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default ScheduleListLayout;
