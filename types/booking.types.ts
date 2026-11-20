export const BOOKING_STATUSES = [
  "requested",
  "accepted",
  "paid",
  "completed",
  "reviewed",
  "declined",
  "cancelled",
] as const;

export type BookingStatus = (typeof BOOKING_STATUSES)[number];

export const TERMINAL_BOOKING_STATUSES: readonly BookingStatus[] = [
  "reviewed",
  "declined",
  "cancelled",
];
