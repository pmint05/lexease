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