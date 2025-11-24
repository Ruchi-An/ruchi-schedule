// ------------------------------
// 📌 ScheduleListLayout.jsx
// イベントリスト表示コンポーネント（未定の予定用）
// 編集・削除ボタン付き / 時間帯色分け
// ------------------------------

import React, { useRef } from "react";
import styles from "./ScheduleListLayout.module.css";

const ScheduleListLayout = ({ events, onEdit, onDelete, editable, scrollToEvent }) => {
  const eventRefs = useRef({}); // ★ 個別イベントのDOM参照用（スクロール等に使える）

  // ------------------------------
  // 📌 未定の予定だけ抽出
  // date が空文字・null・undefined のものを未定とする
  // ------------------------------
  const filteredEvents = events.filter(ev => !ev.date || ev.date.trim() === "");

  // ------------------------------
  // 📌 並び替え
  // 未定イベントは後ろ、日付ありは日付+開始時間順
  // ------------------------------
  const sortedEvents = [...filteredEvents].sort((a, b) => {
    const hasDateA = !!a.date?.trim();
    const hasDateB = !!b.date?.trim();

    if (!hasDateA && hasDateB) return 1;  // 未定は後ろ
    if (hasDateA && !hasDateB) return -1;

    // 日付+時間で比較
    const dateA = new Date(`${a.date} ${a.startTime || "00:00"}`);
    const dateB = new Date(`${b.date} ${b.startTime || "00:00"}`);
    return dateA - dateB;
  });

  // ------------------------------
  // 📌 JSX描画
  // ------------------------------
  return (
    <div className={styles.schedulelistContainer}>
      <h3>未定の予定</h3>

      {sortedEvents.length === 0 ? (
        <p className={styles.noEvents}>未定の予定ありません</p>
      ) : (
        <ul className={styles.schedulelist}>
          {sortedEvents.map((ev) => {

            return (
              <li
                key={ev.no}
                ref={el => { if (el) eventRefs.current[ev.no] = el; }}
                className={`${styles.schedulelistItem}`}
              >
                {/* イベント情報 */}
                <div className={styles.eventInfo}>
                  <div className={styles.eventTitle}>
                    {`${ev.category || "カテゴリ未設定"}｜${ev.title}`}
                  </div>
                  {ev.summary && (
                    <div className={styles.eventSummary}>{ev.summary}</div>
                  )}
                </div>

                {/* 編集・削除ボタン（編集可能な場合のみ） */}
                {editable && (
                  <div className={styles.eventActions}>
                    <button
                      onClick={() => onEdit?.(ev.no)}
                      className={styles.btnEdit}
                    >
                      編集
                    </button>
                    <button
                      onClick={() => onDelete?.(ev.no)}
                      className={styles.btnDelete}
                    >
                      削除
                    </button>
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
