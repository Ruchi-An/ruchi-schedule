import React, { useState, useEffect } from "react";
import styles from "./EventPopup.module.css"; // 見た目そのまま使う

const EventEditPopup = ({ event, onClose, onSave }) => {
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
        date: event.date || "",
        startTime: event.startTime || "",
        endTime: event.endTime || "",
        summary: event.summary || "",
      });
    }
  }, [event]);

  const handleChange = (key, value) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    onSave({ ...event, ...formData });
  };

  return (
    <div className={styles.popupOverlay} onClick={onClose}>
      <div className={styles.popupBox} onClick={(e) => e.stopPropagation()}>
        <h3 className={styles.title}>{event?.title ? `編集: ${event.title}` : "新規作成"}</h3>

        <div className={styles.meta}>
          {/* タイトル */}
          <input
            type="text"
            placeholder="タイトル"
            value={formData.title}
            onChange={e => handleChange("title", e.target.value)}
          />

          {/* 日付入力 */}
          <input
            type="date"
            value={formData.date}
            onChange={e => handleChange("date", e.target.value)}
          />

          {/* 時間入力 */}
          <input
            type="time"
            value={formData.startTime}
            onChange={e => handleChange("startTime", e.target.value)}
          />
          <input
            type="time"
            value={formData.endTime}
            onChange={e => handleChange("endTime", e.target.value)}
          />

          {/* タイプ選択 */}
          <select
            value={formData.type}
            onChange={e => handleChange("type", e.target.value) || handleChange("category", "")}
          >
            <option value="">選択してください</option>
            <option value="game">🎮ゲーム</option>
            <option value="scenario">📚シナリオ</option>
            <option value="real">🌏リアル</option>
          </select>

          {/* カテゴリ選択（タイプ依存） */}
          <select
            value={formData.category}
            onChange={e => handleChange("category", e.target.value)}
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
            onChange={e => handleChange("summary", e.target.value)}
          />
        </div>

        {/* 保存 / キャンセルボタン */}
        <div className={styles.actions}>
          <button onClick={handleSave}>保存</button>
          <button onClick={onClose}>キャンセル</button>
        </div>
      </div>
    </div>
  );
};

export default EventEditPopup;
