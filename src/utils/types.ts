export interface VerseData {
    [verse: string]: string;
}
  
export interface ChapterData {
    [chapter: string]: VerseData;
}
  
export interface BibleData {
    [book: string]: ChapterData;
}

export interface BookInfo {
    order?: number;
    id?: string;
    name?: string;
    testament?: string;
    start?: string;
    abbr?: string[];
    chapters?: number;
    versesPerChapter?: number[];
  }
  
export interface CV {
    book: BookInfo;
    success: boolean;
    reason: string;
    chapter?: number | null;
    from?: number | null;
    to?: number | null;
  }