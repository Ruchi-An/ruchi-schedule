// ------------------------------
// 📌 timeBorderClass.js
// 時間表記の変換・時間帯判定・枠色クラス返却
// ------------------------------

// ------------------------------
// 25時表記などを「分」に変換
// 例: "25:30" → 25時は翌日の1時として扱う
// ------------------------------
export const toMinutes = (timeStr) => {
  if (!timeStr) return null;                 // null や空文字は無効

  // hh:mm を分解して数値に
  const [h, m] = timeStr.split(":").map(Number);

  // 24時以上なら翌日として調整
  const hour = h >= 24 ? h - 24 : h;        // 時間部分
  const dayOffset = h >= 24 ? 24 * 60 : 0;  // 24時以上なら 1日分の分数を加算

  return hour * 60 + m + dayOffset;         // 合計分数を返す
};

// ------------------------------
// 📌 時間帯判定（6時間ごと）
// 返却値: morning / noon / night / midnight / other
// ------------------------------
export const getTimeZone = (timeStr) => {
  const min = toMinutes(timeStr);           // 分に変換
  if (min === null) return "other";        // 無効値は other

  if (min >= 360 && min <= 719) return "morning";    // 6:00〜11:59
  if (min >= 720 && min <= 1079) return "noon";      // 12:00〜17:59
  if (min >= 1080 && min <= 1439) return "night";    // 18:00〜23:59
  if (min >= 1440 && min <= 1799) return "midnight";// 24:00〜29:59

  return "other";                                   // その他
};

/**
 * 📌 表示用に時間を HH:mm 表示
 * 0〜5時は +24 して 24:00〜29:59 表記にする
 */
export const displayTime = (time) => {
  if (!time) return "";
  let [h, m] = time.split(":").map(Number);
  if (h < 6) h += 24;
  return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`;
};

/**
 * 📌 入力文字列を HH:mm:ss 形式に変換（内部保存用）
 * "24:30" → "00:30:00" のように変換
 * @param {string} input - 入力文字列 "HH:mm"
 * @returns {string|null} "HH:mm:ss" 形式
 */
export const parseInputTime = (input) => {
  if (!input) return null;
  const [hStr, mStr] = input.split(":");
  let h = parseInt(hStr, 10);
  const m = parseInt(mStr || "0", 10);

  // 24〜29 時は 0〜5 に変換（内部保存用）
  if (h >= 24 && h < 30) h -= 24;

  return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:00`;
};