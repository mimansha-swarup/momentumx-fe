

export function formatDateToWords(dateString: string) {
  const date = new Date(dateString);

  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  return date.toLocaleDateString("en-US", options);
}

export function formatToSimpleDate(dateString: string): string {
  const date = new Date(dateString);

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // months are 0-based
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

const RELATIVE_TIME_THRESHOLDS: {
  max: number;
  divisor: number;
  unit: Intl.RelativeTimeFormatUnit;
}[] = [
  { max: 60, divisor: 1, unit: "second" },
  { max: 3600, divisor: 60, unit: "minute" },
  { max: 86400, divisor: 3600, unit: "hour" },
  { max: 2592000, divisor: 86400, unit: "day" },
  { max: 31536000, divisor: 2592000, unit: "month" },
  { max: Infinity, divisor: 31536000, unit: "year" },
];

const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });

export function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "";

  const diffSeconds = Math.round((date.getTime() - Date.now()) / 1000);
  if (diffSeconds >= 0) return "just now";

  const absDiff = Math.abs(diffSeconds);
  for (const { max, divisor, unit } of RELATIVE_TIME_THRESHOLDS) {
    if (absDiff < max) {
      return rtf.format(-Math.round(absDiff / divisor), unit);
    }
  }
  return "";
}
