import { BookInfo, ChapterCountObj } from "./types";

export function getName(book?: BookInfo) {
  return book?.name?.toLowerCase() ?? "";
}

export function sendMessage(
  channel: BroadcastChannel,
  message: Record<string, any>,
) {
  channel.postMessage({ ...message, type: "message" });
}

export function isValidBookAndChapter(
  book: string,
  chapter: number,
  chapterData: ChapterCountObj,
) {
  const maxChapter = chapterData[book];
  if (!maxChapter) {
    return { valid: false, message: `The book "${book}" does not exist.` };
  }

  if (chapter < 1 || chapter > maxChapter) {
    return {
      valid: false,
      message: `The book "${book}" does not have chapter "${chapter}".`,
    };
  }

  return { valid: true };
}
