"use client";

import NKJVBibleJSON from "@/bibles/bible_data.json";
import React, {
  useState,
  useEffect,
  ChangeEvent,
  FormEvent,
  useRef,
  useLayoutEffect,
} from "react";
import { VerseData, BibleData, BookInfo, CV } from "@/utils/types";
import { getName } from "@/utils";
import chapterAndVerse from "@/utils/parser/cv";

const NKJVBible: Record<string, any> = NKJVBibleJSON;

// import { Karla } from "next/font/google"

// const karla = Karla({weight: "variable", style: "normal", display: "swap", subsets: ["latin", "latin-ext"] })

const BibleViewer = () => {
  const [bibleData] = useState<BibleData>(NKJVBible);
  const [input, setInput] = useState("");
  const [filteredBooks, setFilteredBooks] = useState<string[]>([]);
  const [displayChapter, setDisplayChapter] = useState<VerseData>({});
  const [highlightVerse, setHighlightVerse] = useState<string | null>(null);
  const [navigatedVerse, setNavigatedVerse] = useState<string | null>(null); // New state for navigated verse
  const [bookNames, setBookNames] = useState<string[]>([]);
  const [book, setBook] = useState<BookInfo>({});
  const [chapter, setChapter] = useState<number>(1);
  const [verse, setVerse] = useState<number>(1);
  const [isHidden, setHidden] = useState(false); // Control whether scripture is hidden or shown
  const verseListRef = useRef<HTMLDivElement | null>(null);

  const channel = new BroadcastChannel("live-change");

  function updateInput(
    book: BookInfo,
    chapter: number,
    verse: number | string,
  ) {
    if (book?.name) {
      setInput(`${getName(book)} ${chapter}:${verse}`);
    }
  }

  const sendVerseToHomePage = (
    book: string,
    chapter: string,
    verse: string,
  ) => {
    const verseData = {
      book,
      chapter,
      verse,
      version: "nkjv",
      isScripture: true,
    };
    channel.postMessage(verseData);
    // console.log(window.electronAPI, "just sent this info: ", verseData)
    // window.electronAPI.sendVerseUpdate(verseData)
    // const event = new Event("verseHighlighted");
    // window.dispatchEvent(event);
  };

  const changeScripture = (book: BookInfo, chapter: string, verse: string) => {
    const currentBook = getName(book);
    if (currentBook) {
      setBook(book);
      setChapter(Number(chapter));
      setVerse(Number(verse));
      updateInput(book, Number(chapter), verse);
      setHighlightVerse(verse);
      setNavigatedVerse(verse);
      sendVerseToHomePage(currentBook, chapter, verse);
    }
  };

  useEffect(() => setBookNames(Object.keys(bibleData).sort()), [bibleData]);

  // useEffect(() => {
  //   fetchBibleData().then((data) => setBibleData(data));
  // }, []);

  // useEffect(() => {
  //   if (book?.name) {
  //     console.log(book, navigatedVerse)
  //     setInput(`${getName(book)} ${chapter}:${navigatedVerse}`)
  //   }
  // }, [navigatedVerse])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === "c") {
        // Toggle hide/show scripture on Ctrl + C
        const shouldHide = !isHidden;
        if (shouldHide) {
          channel.postMessage({ isHidden: true });
        } else {
          sendVerseToHomePage(
            getName(book),
            chapter.toString(),
            verse.toString(),
          );
        }
        setHidden(shouldHide);
      } else if (e.key === "ArrowDown") {
        // Navigate to the next verse
        const nextVerse = (
          parseInt(navigatedVerse || highlightVerse || "0") + 1
        ).toString();
        if (
          parseInt(nextVerse) <= (book?.versesPerChapter?.[chapter - 1] ?? 1)
        ) {
          setNavigatedVerse(nextVerse);
          updateInput(book, chapter, nextVerse);
        }
      } else if (e.key === "ArrowUp") {
        // Navigate to the previous verse
        const prevVerse = (
          parseInt(navigatedVerse || highlightVerse || "2") - 1
        ).toString();
        if (parseInt(prevVerse) > 0) {
          setNavigatedVerse(prevVerse);
          updateInput(book, chapter, prevVerse);
        }
      } else if (e.key === "Enter") {
        // Confirm and highlight the current verse on Enter
        if (navigatedVerse) {
          console.log(navigatedVerse);
          changeScripture(book, chapter.toString(), navigatedVerse);
          setNavigatedVerse(null); // Reset navigated verse after confirming
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigatedVerse, highlightVerse, book, chapter, verse, isHidden]); // changeScripture, channel, sendVerseToHomePage

  useEffect(() => {
    if (highlightVerse) {
      const alertTimer = setTimeout(() => {
        alert("Consider hiding the scripture.");
      }, 90000); // 2 minutes in milliseconds - changed to 1 min 30s

      return () => clearTimeout(alertTimer);
    }
  }, [highlightVerse]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    let userInput: string = e.target.value;
    const cv: CV | undefined = chapterAndVerse(userInput);
    let newVerse: number | null = null;

    let filtered = bookNames.filter((book) =>
      book.toLowerCase().startsWith(userInput.toLowerCase()),
    );

    // @ts-ignore
    if (e.nativeEvent.inputType === "deleteContentBackward") {
      if (cv?.success) {
        setBook(cv.book);
        setChapter(cv.chapter ?? 1);
        newVerse = cv.from ?? 1;
      }
    } else {
      if (!filtered.length && !cv?.success) {
        userInput = (" " + input).slice(1);
        filtered = [...filteredBooks];
      }

      if (cv?.success) {
        setBook(cv.book);
        setChapter(cv.chapter ?? 1);
        newVerse = cv.from ?? 1;
        if (userInput[userInput.length - 1] === " ") {
          userInput = `${cv.book.name} ${cv.chapter ? cv.chapter + ":" : ""}`;
          if (cv.from) {
            userInput += cv.from;
          }
        }
      }
    }

    if (newVerse) {
      setVerse(newVerse);
      setNavigatedVerse(newVerse.toString());
    }
    console.log(userInput);
    setInput(userInput);
    setFilteredBooks(filtered);
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    updateInput(book, chapter, verse);
    let verseToHighlight: string | null = verse.toString();

    const bookName = getName(book);
    if (bibleData[bookName] && bibleData[bookName][chapter]) {
      setDisplayChapter(bibleData[bookName][chapter]);

      if (verse) {
        verseToHighlight = verse.toString();
        sendVerseToHomePage(bookName, chapter.toString(), verse.toString());
      } else {
        verseToHighlight = null;
      }
    } else {
      setDisplayChapter({});
      verseToHighlight = null;
    }

    setHighlightVerse(verseToHighlight);
    setNavigatedVerse(verseToHighlight);
  };

  useLayoutEffect(() => {
    if (navigatedVerse) {
      requestAnimationFrame(() => {
        const verseButton = verseListRef.current?.querySelector(
          `button[data-verse="${getName(book)}-${chapter}-${navigatedVerse}"]`,
        ) as HTMLButtonElement | null;

        if (verseButton) {
          verseButton.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigatedVerse]);

  return (
    <div
      className={`h-full w-full max-w-full max-h-full relative overflow-hidden px-2 controls`}
    >
      <form
        className="w-full fixed h-14 top-0 left-0 py-2 px-2 flex gap-4 justify-center items-center z-20"
        onSubmit={handleSubmit}
      >
        <div className="w-full relative max-w-md">
          <input
            className="relative w-full flex-1 bg-transparent z-10 capitalize border-2 border-gray-700 p-2"
            type="text"
            value={input}
            onChange={handleInputChange}
            placeholder="Enter book, chapter, and verse (e.g., gen 25:2)"
            list="bookSuggestions"
          />
        </div>
        <datalist id="bookSuggestions">
          {filteredBooks.map((book) => (
            <option key={book} value={book} />
          ))}
        </datalist>
        {/* <button className="h-full px-5 py-2 bg-gray-900 text-white font-medium" type="submit">Submit</button> */}
      </form>

      <div className="absolute top-20 z-10 w-full flex justify-center">
        <div
          className="relative flex flex-col gap-1 items-start overflow-auto w-full max-w-4xl h-[calc(100vh-80px)]"
          ref={verseListRef}
        >
          {Object.keys(displayChapter).map((verseNum) => (
            <button
              className="text-left w-full flex gap-2 py-2 px-4"
              key={verseNum}
              tabIndex={-1}
              data-verse={`${getName(book)}-${chapter}-${verseNum}`}
              onClick={() =>
                changeScripture(book, chapter.toString(), verseNum)
              }
              style={{
                backgroundColor:
                  verseNum === highlightVerse
                    ? "yellow"
                    : verseNum === navigatedVerse
                      ? "lightblue" // Different color for navigated verse
                      : "transparent",
              }}
            >
              <strong>{verseNum}:</strong>
              <span>{displayChapter[verseNum]}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BibleViewer;
