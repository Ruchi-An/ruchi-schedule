import React from "react";
import styles from "./EventPopup.module.css";

/**
 * props:
 *  - event: event object (nullable)
 *  - onClose: () => void
 */
const EventPopup = ({ event, onClose }) => {
  if (!event) return null;

  const formatTime = (s) => {
    if (!s) return "";
    // 既存の displayTime と同じ形式が欲しければそちらを import してもOK
    const parts = s.split(":");
    return parts.length >= 2 ? `${parts[0].padStart(2, "0")}:${parts[1].padStart(2, "0")}` : s;
  };

  return (
    <div className={styles.popupOverlay} onClick={onClose}>
      <div className={styles.popupBox} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeIcon} onClick={onClose} aria-label="閉じる">✕</button>

        <h3 className={styles.title}>{event.title || "無題の予定"}</h3>

        <div className={styles.meta}>
          <div><strong>日付：</strong>{event.date || "未定"}</div>
          <div>
            <strong>時間：</strong>
            {event.startTime ? `${formatTime(event.startTime)}${event.endTime ? ` 〜 ${formatTime(event.endTime)}` : ""}` : "なし"}
          </div>
          <div><strong>カテゴリ：</strong>{event.category || "未設定"}</div>
        </div>

        {event.summary && (
          <div className={styles.summary}>
            <strong>詳細：</strong>
            <p>{event.summary}</p>
          </div>
        )}

        <div className={styles.actions}>
          {/* 参照用だけなら閉じるだけ。編集に飛ばしたければ onEdit prop を追加して使う */}
          <button className={styles.closeBtn} onClick={onClose}>閉じる</button>
        </div>
      </div>
    </div>
  );
};

export default EventPopup;
