export interface ReadingTextToken {
  text: string;
  wordIndex: number | null;
  spaceAfter: boolean;
}

const WORD_PATTERN_SOURCE = "[\\p{L}\\p{M}\\p{N}]+";

const createWordPattern = (): RegExp => new RegExp(WORD_PATTERN_SOURCE, "gu");

export const tokenizeText = (text: string): string[] => {
  return Array.from(text.matchAll(createWordPattern()), (match) => match[0]);
};

/**
 * Clean a word for comparison by removing punctuation and converting to lowercase.
 */
export const normalizeWord = (word: string): string => {
  return word
    .toLowerCase()
    .normalize("NFC")
    .replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, "") // Common punctuation
    .replace(/[\u2000-\u206F\u2E00-\u2E7F\\'!"#$%&()*+,\-./:;<=>?@[\]^_`{|}~]/g, "") // Extended punctuation
    .trim();
};

export const buildReadingTextTokens = (text: string): ReadingTextToken[] => {
  const tokens: ReadingTextToken[] = [];
  const chunks = Array.from(text.matchAll(/\S+/g));
  let wordIndex = 0;

  chunks.forEach((chunkMatch, chunkIndex) => {
    const chunk = chunkMatch[0];
    const chunkEnd = (chunkMatch.index ?? 0) + chunk.length;
    const nextChunk = chunks[chunkIndex + 1];
    const spaceAfter = nextChunk
      ? /\s/.test(text.slice(chunkEnd, nextChunk.index ?? chunkEnd))
      : false;
    const wordMatches = Array.from(chunk.matchAll(createWordPattern()));

    if (wordMatches.length === 0) {
      tokens.push({ text: chunk, wordIndex: null, spaceAfter });
      return;
    }

    wordMatches.forEach((wordMatch, index) => {
      const start = wordMatch.index ?? 0;
      const end = start + wordMatch[0].length;
      const nextStart =
        index + 1 < wordMatches.length
          ? (wordMatches[index + 1].index ?? end)
          : chunk.length;
      const prefix = index === 0 ? chunk.slice(0, start) : "";
      const suffix = chunk.slice(end, nextStart);

      tokens.push({
        text: `${prefix}${wordMatch[0]}${suffix}`,
        wordIndex,
        spaceAfter: index === wordMatches.length - 1 ? spaceAfter : false,
      });
      wordIndex += 1;
    });
  });

  return tokens;
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
