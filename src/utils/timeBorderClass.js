// ------------------------------
// 📌 timeBorderClass.js（強化版）
// イベントの時間帯判定・表示用変換・入力変換
// ------------------------------


// ------------------------------
// 📌 枠色クラスを返す
// CSSクラス名として使用
// ------------------------------
export const getBorderColorClass = (event) => {
  const zone = getTimeZone(event.time);  // 時間帯取得

  return {
    morning: "border-morning",
    noon: "border-noon",
    night: "border-night",
    midnight: "border-midnight",
    other: "border-other",
  }[zone];  // zone に応じたクラス名を返す
};

/**
 * 📌 イベントに応じた枠色クラスを返す
 * @param {Object} ev - イベントオブジェクト
 * @param {string} ev.startTime - "HH:mm" または "HH:mm:ss"
 * @param {boolean} ev.allDay - 終日イベントか
 * @param {boolean} ev.sleep - 睡眠イベントか
 */
export const getTimeBorderClass = (ev) => {
  if (!ev) return "borderOther";        // 無効なイベント
  if (ev.allDay) return "borderAllday"; // 終日イベント
  if (ev.sleep) return "borderSleep";   // 睡眠イベント
  if (!ev.startTime) return "borderOther"; // 時間未設定

  // HH:mm:ss を HH:mm に分解
  const [hourStr, minStr] = ev.startTime.split(":");
  let hour = parseInt(hourStr, 10);
  const min = parseInt(minStr || "0", 10);

  // 0〜5時は翌日の 24〜29 時として扱う
  if (hour < 6) hour += 24;

  // 時間帯判定
  if (hour >= 6 && hour < 12) return "borderMorning";   // 6:00〜11:59
  if (hour >= 12 && hour < 18) return "borderNoon";     // 12:00〜17:59
  if (hour >= 18 && hour < 24) return "borderNight";    // 18:00〜23:59
  if (hour >= 24 && hour < 30) return "borderMidnight"; // 24:00〜29:59

  return "borderOther";
};
