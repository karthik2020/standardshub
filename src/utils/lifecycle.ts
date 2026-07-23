export interface LifecycleCountdown {
  validDate: boolean;
  daysRemaining: number | null;
  isToday: boolean;
  isTomorrow: boolean;
  isPast: boolean;
  showCountdown: boolean;
}

export function getLifecycleCountdown(eventDate?: string): LifecycleCountdown {
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
