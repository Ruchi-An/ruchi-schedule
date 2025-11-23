import React, { useState, useEffect } from "react";
import styles from "./EventPopup.module.css";

const EventEditPopup = ({ event, onClose, onSave, onDelete }) => {
  const [formData, setFormData] = useState({
    title: "",
    type: "",
    category: "",
    date: "",
    startTime: "",
    endTime: "",
    summary: "",
  });

  useEffect(() => {
    if (event) {
      setFormData({
        title: event.title || "",
        type: event.type || "",
        category: event.category || "",
        date: event.date || null,
        startTime: event.startTime || null,
        endTime: event.endTime || null,
        summary: event.summary || "",
      });
    }
  }, [event]);

  const handleChange = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    onSave({ ...event, ...formData });
  };

const handleDelete = () => {
  if (typeof onDelete === "function") {
    onDelete(event.no);
  } else {
    console.warn("onDelete is not a function");
  }
  onClose();
};

  return (
    <div className={styles.popupOverlay} onClick={onClose}>
      <div className={styles.popupBox} onClick={(e) => e.stopPropagation()}>
        <h3 className={styles.title}>
          {event?.title ? `編集: ${event.title}` : "新規作成"}
        </h3>

        <div className={styles.meta}>
          {/* タイトル */}
          <input
            type="text"
            placeholder="タイトル"
            value={formData.title}
            onChange={(e) => handleChange("title", e.target.value)}
          />

          {/* 日付入力 */}
          <input
            type="date"
            value={formData.date}
            onChange={(e) => handleChange("date", e.target.value)}
          />

          {/* 時間入力 */}
          <input
            type="time"
            value={formData.startTime}
            onChange={(e) => handleChange("startTime", e.target.value)}
          />
          <input
            type="time"
            value={formData.endTime}
            onChange={(e) => handleChange("endTime", e.target.value)}
          />

          {/* タイプ選択 */}
          <select
            value={formData.type}
            onChange={(e) => {
              handleChange("type", e.target.value);
              handleChange("category", "");
            }}
          >
            <option value="">選択してください</option>
            <option value="game">🎮ゲーム</option>
            <option value="scenario">📚シナリオ</option>
            <option value="real">🌏リアル</option>
          </select>

          {/* カテゴリ選択（タイプ依存） */}
          <select
            value={formData.category}
            onChange={(e) => handleChange("category", e.target.value)}
          >
            <option value="">選択してください</option>

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

            {formData.type === "scenario" && (
              <>
                <option value="📕">📕</option>
                <option value="📗">📗</option>
                <option value="📘">📘</option>
                <option value="📙">📙</option>
              </>
            )}

            {formData.type === "real" && <option value="🌏">🌏</option>}
          </select>

          {/* サマリー */}
          <textarea
            placeholder="詳細"
            value={formData.summary}
            onChange={(e) => handleChange("summary", e.target.value)}
          />
        </div>

        {/* 保存 / キャンセル / 削除ボタン */}
        <div className={styles.actions}>
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
