/**
 * イベントに応じた枠色クラスを返す
 * @param {Object} ev - イベントオブジェクト
 * @param {string} ev.startTime - "HH:mm" or "HH:mm:ss"
 * @param {boolean} ev.allDay
 * @param {boolean} ev.sleep
 */
export const getTimeBorderClass = (ev) => {
  if (!ev) return "borderOther";
  if (ev.allDay) return "borderAllday";
  if (ev.sleep) return "borderSleep";
  if (!ev.startTime) return "borderOther";

  // HH:mm:ss を HH:mm に
  const [hourStr, minStr] = ev.startTime.split(":");
  let hour = parseInt(hourStr, 10);
  const min = parseInt(minStr || "0", 10);

  // 0〜5時は翌日の 24〜29 時として扱う
  if (hour < 6) hour += 24;

  if (hour >= 6 && hour < 12) return "borderMorning";   // 6:00〜11:59
  if (hour >= 12 && hour < 18) return "borderNoon";     // 12:00〜17:59
  if (hour >= 18 && hour < 24) return "borderNight";    // 18:00〜23:59
  if (hour >= 24 && hour < 30) return "borderMidnight"; // 24:00〜29:59

  return "borderOther";
};

/**
 * 表示用に時間を HH:mm 表示
 * 0〜5時を +24 して 24:00〜29:59 とする
 */
export const displayTime = (time) => {
  if (!time) return "";
  let [h, m] = time.split(":").map(Number);
  if (h < 6) h += 24;
  return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`;
};


/**
 * 入力文字列を HH:mm:ss 形式に変換
 * "24:30" → "00:30"（内部保存用）
 * 0-29 の範囲を受け付け
 */
export const parseInputTime = (input) => {
  if (!input) return null;
  const [hStr, mStr] = input.split(":");
  let h = parseInt(hStr, 10);
  const m = parseInt(mStr || "0", 10);
  if (h >= 24 && h < 30) h -= 24; // 内部的に 0-5 時に変換
  return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:00`;
};
