export interface LifecycleCountdown {
  validDate: boolean;
  daysRemaining: number | null;
  isToday: boolean;
  isTomorrow: boolean;
  isPast: boolean;
  showCountdown: boolean;
}

export function getLifecycleCountdown(eventDate?: string | null): LifecycleCountdown {
  const result: LifecycleCountdown = {
    validDate: false,
    daysRemaining: null,
    isToday: false,
    isTomorrow: false,
    isPast: false,
    showCountdown: false,
  };

  if (!eventDate || typeof eventDate !== "string") {
    return result;
  }

  const trimmed = eventDate.trim();
  if (!trimmed) {
    return result;
  }

  const parts = trimmed.split("-");
  if (parts.length !== 3) {
    return result;
  }

  const year = Number(parts[0]);
  const month = Number(parts[1]);
  const day = Number(parts[2]);

  if (
    !Number.isInteger(year) ||
    !Number.isInteger(month) ||
    !Number.isInteger(day) ||
    year < 1900 ||
    year > 9999 ||
    month < 1 ||
    month > 12 ||
    day < 1 ||
    day > 31
  ) {
    return result;
  }

  const target = new Date(year, month - 1, day);
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const targetStart = new Date(
    target.getFullYear(),
    target.getMonth(),
    target.getDate()
  );

  const diffMs = targetStart.getTime() - todayStart.getTime();
  const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

  result.validDate = true;
  result.daysRemaining = diffDays;
  result.isToday = diffDays === 0;
  result.isTomorrow = diffDays === 1;
  result.isPast = diffDays < 0;
  result.showCountdown = diffDays >= 0 && diffDays <= 90;

  return result;
}

// Example outputs:
//
// getLifecycleCountdown(null)
// => { validDate: false, daysRemaining: null, isToday: false, isTomorrow: false, isPast: false, showCountdown: false }
//
// getLifecycleCountdown("")
// => { validDate: false, daysRemaining: null, isToday: false, isTomorrow: false, isPast: false, showCountdown: false }
//
// getLifecycleCountdown("not-a-date")
// => { validDate: false, daysRemaining: null, isToday: false, isTomorrow: false, isPast: false, showCountdown: false }
//
// getLifecycleCountdown("2026-01-01")
// => { validDate: true, daysRemaining: -192, isToday: false, isTomorrow: false, isPast: true, showCountdown: false }
//
// getLifecycleCountdown("2026-07-13")
// => { validDate: true, daysRemaining: 0, isToday: true, isTomorrow: false, isPast: false, showCountdown: true }
//
// getLifecycleCountdown("2026-07-14")
// => { validDate: true, daysRemaining: 1, isToday: false, isTomorrow: true, isPast: false, showCountdown: true }
//
// getLifecycleCountdown("2026-08-15")
// => { validDate: true, daysRemaining: 33, isToday: false, isTomorrow: false, isPast: false, showCountdown: true }
//
// getLifecycleCountdown("2026-10-11")
// => { validDate: true, daysRemaining: 90, isToday: false, isTomorrow: false, isPast: false, showCountdown: true }
//
// getLifecycleCountdown("2026-10-12")
// => { validDate: true, daysRemaining: 91, isToday: false, isTomorrow: false, isPast: false, showCountdown: false }
