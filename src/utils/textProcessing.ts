export const tokenizeText = (text: string): string[] => {
  return text.match(/\S+/g) ?? [];
};

export const estimateWordTimestamps = (
  words: string[],
  speedMultiplier: number,
): number[] => {
  const averageMsPerChar = 80;
  let elapsed = 0;

  return words.map((word) => {
    const timestamp = elapsed;
    elapsed += (word.length * averageMsPerChar) / speedMultiplier;
    return timestamp;
  });
};

export const formatDuration = (durationMs: number): string => {
  const totalSeconds = Math.floor(durationMs / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
};