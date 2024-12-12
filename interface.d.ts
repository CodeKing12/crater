import { ChapterData } from "@/utils/types";

export interface ChapterCountObj {
  [book: string]: number;
}

export interface SongData {
  id: number;
  title: string;
  author: string | null;
  category: string | null;
  created_at: string;
  updated_at: string;
}

export interface SongLyric {
  label: string;
  text: string[]; // Each lyric is represented as an array of lines
}

export interface IElectronAPI {
  // Bible operations
  fetchChapterCounts: () => Promise<ChapterCountObj>;
  fetchChapter: ({
    book,
    chapter,
    version,
  }: {
    book: string;
    chapter: string;
    version: string;
  }) => Promise<{ verse: string; text: string }[]>;
  fetchScripture: ({
    book,
    chapter,
    verse,
    version,
  }: {
    book: string;
    chapter: string;
    verse: string;
    version: string;
  }) => Promise<{ text: string }>;
  sendVerseUpdate: (verseData: any) => void;
  onScriptureUpdate: (callback: () => void) => void;

  // Song operations
  fetchAllSongs: () => Promise<SongData[]>;
  fetchSongLyrics: (songId: number) => Promise<SongLyric[]>;
  updateSong: (
    songId: number,
    newTitle: string,
    newLyrics: SongLyric[],
  ) => Promise<{ success: boolean; message: string }>;
  filterSongsByPhrase: (phrase: string) => Promise<SongData[]>;
}

declare global {
  interface Window {
    electronAPI: IElectronAPI;
  }
}
