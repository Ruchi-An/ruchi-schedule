// 25時表記 → 分
export const toMinutes = (timeStr) => {
  if (!timeStr) return null;
  const [h, m] = timeStr.split(":").map(Number);

  const hour = h >= 24 ? h - 24 : h;
  const dayOffset = h >= 24 ? 24 * 60 : 0;

  return hour * 60 + m + (h >= 24 ? 24 * 60 : 0);
};

// 時間帯判定（6時間ごと）
export const getTimeZone = (timeStr) => {
  const min = toMinutes(timeStr);
  if (min === null) return "other";

  if (min >= 360 && min <= 719) return "morning";   // 6:00〜11:59
  if (min >= 720 && min <= 1079) return "noon";     // 12:00〜17:59
  if (min >= 1080 && min <= 1439) return "night";   // 18:00〜23:59
  if (min >= 1440 && min <= 1799) return "midnight"; // 24:00〜29:59

  return "other";
};

// 枠色クラス返却
export const getBorderColorClass = (event) => {
  const zone = getTimeZone(event.time);

  return {
    morning: "border-morning",
    noon: "border-noon",
    night: "border-night",
    midnight: "border-midnight",
    other: "border-other",
  }[zone];
};
