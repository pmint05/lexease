export const formatReadingTime = (ms: number): string => {
  const minutes = Math.floor(ms / 60000);
  const seconds = Math.floor((ms % 60000) / 1000);

  if (minutes === 0) {
    return `${seconds} giây`;
  }

  if (seconds === 0) {
    return `${minutes} phút`;
  }

  return `${minutes} phút ${seconds} giây`;
};

export const formatDate = (isoString: string): string => {
  const date = new Date(isoString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffDays === 0) {
    return `Hôm nay ${date.toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    })}`;
  }

  if (diffDays === 1) {
    return "Hôm qua";
  }

  return date.toLocaleDateString("vi-VN", {
    day: "numeric",
    month: "long",
  });
};

export const formatDateTime = (isoString: string): string => {
  const date = new Date(isoString);
  // Always include date and time in Vietnamese locale
  return date.toLocaleString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

/**
 * Format milliseconds into a human readable duration string in Vietnamese.
 * Examples:
 *  - 3723000 -> "1 giờ 2 phút 3 giây"
 *  - 60000 -> "1 phút"
 *  - 1000 -> "1 giây"
 *  - 0 -> "0 giây"
 */
export const formatDurationMs = (ms: number): string => {
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const parts: string[] = [];
  if (hours > 0) parts.push(`${hours} giờ`);
  if (minutes > 0) parts.push(`${minutes} phút`);
  if (seconds > 0) parts.push(`${seconds} giây`);

  if (parts.length === 0) return `0 phút`;
  return parts.join(" ");
};
