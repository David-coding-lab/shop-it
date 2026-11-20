const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
] as const;

export function formatNaira(amount: number): string {
  const value = Number.isFinite(amount) ? amount : 0;
  const whole = Math.round(Math.abs(value));
  const grouped = whole.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return `${value < 0 ? "-" : ""}₦${grouped}`;
}

export function formatDistance(meters: number | null | undefined): string {
  if (meters == null || !Number.isFinite(meters) || meters < 0) {
    return "—";
  }
  if (meters < 1000) {
    return `${Math.round(meters)} m`;
  }
  const km = meters / 1000;
  return `${km >= 10 ? Math.round(km) : km.toFixed(1)} km`;
}

export function formatDateTime(value: string | Date | null | undefined): string {
  if (!value) {
    return "—";
  }
  const date = typeof value === "string" ? new Date(value) : value;
  if (Number.isNaN(date.getTime())) {
    return "—";
  }
  const hours24 = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const period = hours24 >= 12 ? "PM" : "AM";
  const hours = hours24 % 12 || 12;
  return `${date.getDate()} ${MONTHS[date.getMonth()]} ${date.getFullYear()}, ${hours}:${minutes} ${period}`;
}

export function formatTime(value: string | Date | null | undefined): string {
  if (!value) {
    return "—";
  }
  const date = typeof value === "string" ? new Date(value) : value;
  if (Number.isNaN(date.getTime())) {
    return "—";
  }
  const hours24 = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const period = hours24 >= 12 ? "PM" : "AM";
  const hours = hours24 % 12 || 12;
  return `${hours}:${minutes} ${period}`;
}
