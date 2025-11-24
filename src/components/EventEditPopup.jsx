// ------------------------------
// 📌 EventEditPopup.jsx
// イベントの編集・新規作成用ポップアップコンポーネント
// タイトル・日付・時間・タイプ・カテゴリ・詳細を入力できる
// 保存 / 削除 / キャンセルボタン付き
// ------------------------------

import React, { useState, useEffect } from "react";
import styles from "./EventPopup.module.css"; // ★ CSSモジュールでスタイル適用
import { parseInputTime } from "../utils/timeUtils.js";

const EventEditPopup = ({ event, onClose, onSave, onDelete }) => {
  // ------------------------------
  // 📌 フォーム入力用 state
  // ------------------------------
  const [formData, setFormData] = useState({
    title: "",
    type: "",
    category: "",
    date: "",
    startTime: "",
    endTime: "",
    summary: "",
  });

  // ------------------------------
  // 📌 eventが変更されたらフォームにセット
  // ------------------------------
  useEffect(() => {
    if (event) {
      setFormData({
        title: event.title || "",
        type: event.type || "",
        category: event.category || "",
        date: event.displayDate || event.date || null,
        startTime: event.displayStartTime || event.startTime || null,
        endTime: event.displayEndTime || event.endTime || null,
        summary: event.summary || "",
      });
    }
  }, [event]);

  // ------------------------------
  // 📌 フォーム入力値変更時
  // key: 更新するフィールド名, value: 入力値
  // ------------------------------
  const handleChange = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  // ------------------------------
  // 📌 保存ボタン押下時
  // ------------------------------
  const handleSave = () => {
    const rawStart = formData.startTime; // "22:00" など
    const rawEnd = formData.endTime;
    const rawDate = formData.date;

    // startTime は入力済みならパース
    const startParsed = rawStart ? parseInputTime(rawStart, rawDate) : null;

    // endTime は未入力なら null
    const endParsed = rawEnd && rawEnd.trim() !== "" ? parseInputTime(rawEnd, rawDate) : null;

    const payload = {
      ...event,
      ...formData,

      // DB 用（HH:mm:ss に正規化、null も可）
      date: startParsed?.date || rawDate,
      startTime: startParsed?.time || null,
      endTime: endParsed?.time || null,

      // 参照用（文字列そのまま）
      displayDate: rawDate || null,
      displayStartTime: rawStart || null,
      displayEndTime: rawEnd || null,
    };

    console.log("payload:", payload); // 確認用
    onSave(payload);
  };

  // ------------------------------
  // 📌 削除ボタン押下時
  // ------------------------------
  const handleDelete = () => {
    if (typeof onDelete === "function") {
      onDelete(event.no); // ★ イベント番号を渡して削除
    } else {
      console.warn("onDelete is not a function");
    }
    onClose(); // ★ 削除後ポップアップを閉じる
  };

  // ------------------------------
  // 📌 JSX描画
  // ------------------------------
  return (
    <div className={styles.popupOverlay} onClick={onClose}>
      {/* ★ ポップアップボックスクリックは閉じない */}
      <div className={styles.popupBox} onClick={(e) => e.stopPropagation()}>
        {/* ヘッダー */}
        <h3 className={styles.title}>
          {event?.title ? `編集: ${event.title}` : "新規作成"}
        </h3>

        {/* 入力フォーム */}
        <div className={styles.meta}>
          {/* タイトル */}
          <input
            type="text"
            placeholder="タイトル"
            value={formData.title}
            onChange={(e) => handleChange("title", e.target.value)}
          />

          {/* 日付 */}
          <input
            type="date"
            value={formData.date}
            onChange={(e) => handleChange("date", e.target.value)}
          />

          {/* 時間 */}
          <input
            type="text"
            value={formData.startTime}
            onChange={(e) => handleChange("startTime", e.target.value)}
          />
          <input
            type="text"
            value={formData.endTime}
            onChange={(e) => handleChange("endTime", e.target.value)}
          />

          {/* タイプ選択 */}
          <select
            value={formData.type}
            onChange={(e) => {
              handleChange("type", e.target.value);
              handleChange("category", ""); // ★ タイプ変更でカテゴリリセット
            }}
          >
            <option value="">選択してください</option>
            <option value="game">🎮ゲーム</option>
            <option value="scenario">📚シナリオ</option>
            <option value="real">🌏リアル</option>
          </select>

          {/* カテゴリ選択（タイプに応じて表示） */}
          <select
            value={formData.category}
            onChange={(e) => handleChange("category", e.target.value)}
          >
            <option value="">選択してください</option>

            {/* ゲームカテゴリ */}
            {formData.type === "game" && (
              <>
                <option value="🤪">🤪</option>
                <option value="🚀">🚀</option>
                <option value="🍎">🍎</option>
                <option value="🐺">🐺</option>
                <option value="🔍">🔍</option>
                <option value="🪿">🪿</option>
                <option value="🫖">🫖</option>
                <option value="🚙">🚙</option>
                <option value="🛸">🛸</option>
                <option value="⛄">⛄</option>
                <option value="👻">👻</option>
                <option value="💳">💳</option>
              </>
            )}

            {/* シナリオカテゴリ */}
            {formData.type === "scenario" && (
              <>
                <option value="📕">📕</option>
                <option value="📗">📗</option>
                <option value="📘">📘</option>
                <option value="📙">📙</option>
              </>
            )}

            {/* リアルカテゴリ */}
            {formData.type === "real" && <option value="🌏">🌏</option>}
          </select>

          {/* 詳細サマリー */}
          <textarea
            placeholder="詳細"
            value={formData.summary}
            onChange={(e) => handleChange("summary", e.target.value)}
          />
        </div>

        {/* ボタン類 */}
        <div className={styles.actions}>
          {/* 削除ボタン（既存イベントのみ） */}
          {event && (
            <button
              style={{
                borderColor: "rgb(255,80,80)",
                color: "#ffbfbf",
                textShadow: "0 0 6px rgba(255,120,120,0.9)",
              }}
              onClick={handleDelete}
            >
              削除
            </button>
          )}

          {/* 保存 / キャンセル */}
          <div style={{ marginLeft: "auto", display: "flex", gap: "8px" }}>
            <button onClick={handleSave}>保存</button>
            <button onClick={onClose}>キャンセル</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventEditPopup;
