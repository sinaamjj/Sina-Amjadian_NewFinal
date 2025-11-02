import jalaali from "jalaali-js";

const MONTHS = [
  "فروردین",
  "اردیبهشت",
  "خرداد",
  "تیر",
  "مرداد",
  "شهریور",
  "مهر",
  "آبان",
  "آذر",
  "دی",
  "بهمن",
  "اسفند",
];

function toDate(value) {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

export function formatJalali(dateValue, { withYear = true } = {}) {
  const date = toDate(dateValue);
  if (!date) return "---";

  const { jy, jm, jd } = jalaali.toJalaali(date);
  const month = MONTHS[jm - 1];
  return withYear ? `${jd} ${month} ${jy}` : `${jd} ${month}`;
}

export function formatJalaliNumeric(dateValue) {
  const date = toDate(dateValue);
  if (!date) return "---";

  const { jy, jm, jd } = jalaali.toJalaali(date);
  return `${jy}/${String(jm).padStart(2, "0")}/${String(jd).padStart(2, "0")}`;
}

export function formatJalaliDateTime(dateValue) {
  const date = toDate(dateValue);
  if (!date) return "---";

  const dateText = formatJalaliNumeric(date);
  const timeText = date.toLocaleTimeString("fa-IR", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return `${dateText} - ${timeText}`;
}

export function formatJalaliRange(start, end) {
  const startText = formatJalali(start, { withYear: false });
  const endText = formatJalali(end, { withYear: false });
  return `${startText} تا ${endText}`;
}

export function calculateDuration(start, end) {
  const startDate = toDate(start);
  const endDate = toDate(end);

  if (!startDate || !endDate) {
    return { days: "-", nights: "-" };
  }

  const diffMs = endDate.getTime() - startDate.getTime();
  if (diffMs < 0) {
    return { days: "-", nights: "-" };
  }

  const nights = Math.max(0, Math.round(diffMs / (1000 * 60 * 60 * 24)));
  const days = nights + 1;

  return { days, nights };
}

export function formatPrice(amount) {
  if (typeof amount !== "number") return "---";
  return amount.toLocaleString("fa-IR");
}
