// ------------------------------
// 📌 EventPopup.jsx
// イベント内容の参照用ポップアップ
// 編集は行わず、閉じるだけの簡易表示用
// ------------------------------

import React from "react";
import styles from "./EventPopup.module.css";

/**
 * props:
 *  - event: 表示するイベントオブジェクト（nullable）
 *  - onClose: 閉じるボタン押下時に呼ばれる関数
 */
const EventPopup = ({ event, onClose }) => {
  // ★ イベントがない場合は何も表示しない
  if (!event) return null;

  // ------------------------------
  // 📌 時間をHH:mm形式に整形
  // ------------------------------
  const formatTime = (s) => {
    if (!s) return "";
    const parts = s.split(":"); // "HH:mm:ss"などを分割
    return parts.length >= 2
      ? `${parts[0].padStart(2, "0")}:${parts[1].padStart(2, "0")}` // HH:mm形式に整形
      : s;
  };

  // ------------------------------
  // 📌 JSX描画
  // ------------------------------
  return (
    <div className={styles.popupOverlay} onClick={onClose}>
      {/* ★ ポップアップボックスクリックは閉じない */}
      <div className={styles.popupBox} onClick={(e) => e.stopPropagation()}>
        {/* 閉じるアイコン */}
        <button
          className={styles.closeIcon}
          onClick={onClose}
          aria-label="閉じる"
        >
          ✕
        </button>

        {/* イベントタイトル */}
        <h3 className={styles.title}>{event.title || "無題の予定"}</h3>

        {/* メタ情報 */}
        <div className={styles.meta}>
          {/* 日付 */}
          <div>
            <strong>日付：</strong>
            {event.date || "未定"}
          </div>

          {/* 時間 */}
          <div>
            <strong>時間：</strong>
            {event.startTime
              ? `${formatTime(event.startTime)}${
                  event.endTime ? ` 〜 ${formatTime(event.endTime)}` : ""
                }`
              : "なし"}
          </div>

          {/* カテゴリ */}
          <div>
            <strong>カテゴリ：</strong>
            {event.category || "未設定"}
          </div>
        </div>

        {/* サマリー（詳細） */}
        {event.summary && (
          <div className={styles.summary}>
            <strong>詳細：</strong>
            <p>{event.summary}</p>
          </div>
        )}

        {/* アクションボタン */}
        <div className={styles.actions}>
          {/* ★ 参照用なので閉じるボタンのみ */}
          <button className={styles.closeBtn} onClick={onClose}>
            閉じる
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventPopup;
