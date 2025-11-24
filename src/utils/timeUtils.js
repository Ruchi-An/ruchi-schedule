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
 * 📌 入力した時間を解析して
 *   - DB保存用 time ("HH:mm:ss")
 *   - 必要なら日付を翌日に変更して返す
 *
 * @param {string} inputTime - "HH:mm"
 * @param {string} inputDate - "YYYY-MM-DD"
 * @returns {{ time: string, date: string }}
 */
export const parseInputTime = (inputTime, inputDate) => {
  if (!inputTime || !inputDate) {
    return { time: null, date: inputDate };
  }

  let [hStr, mStr] = inputTime.split(":");
  let h = parseInt(hStr, 10);
  const m = parseInt(mStr || "0", 10);
  let date = inputDate;

  // 24〜29 時は翌日扱い
  if (h >= 24 && h < 30) {
    h -= 24;

    // 翌日へ
    const d = new Date(inputDate);
    d.setDate(d.getDate() + 1);
    date = d.toISOString().slice(0, 10); // YYYY-MM-DD
  }

  const time = `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:00`;

  return { time, date };
};
