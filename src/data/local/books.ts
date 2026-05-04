import { Book } from "@/src/core/types";
import { estimateWordTimestamps, tokenizeText } from "@/src/utils/textProcessing";

const sampleText1 =
  "The quick fox runs through the warm field and finds a bright, friendly path home.";
const sampleText2 =
  "A small boat drifts across the blue water while the children wave from the shore.";
const sampleText3 =
  "Every day, the brave reader learns one more word and gains a little more confidence.";

const createBook = (
  id: string,
  title: string,
  author: string,
  difficulty: Book["difficulty"],
  content: string,
): Book => {
  const words = tokenizeText(content);
  return {
    id,
    title,
    author,
    difficulty,
    content,
    words,
    wordCount: words.length,
    estimatedMinutes: Math.max(1, Math.round(words.length / 90)),
    wordTimestamps: estimateWordTimestamps(words, 1.5),
  };
};

export const sampleBooks: Book[] = [
  createBook("fox-field", "The Quick Fox", "LexEase Studio", "easy", sampleText1),
  createBook("blue-boat", "Blue Water Boat", "LexEase Studio", "medium", sampleText2),
  createBook("brave-reader", "The Brave Reader", "LexEase Studio", "hard", sampleText3),
];

export const getBookById = (id: string): Book | undefined => {
  return sampleBooks.find((book) => book.id === id);
};