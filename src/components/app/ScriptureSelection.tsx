"use client";

import { Box, Flex, Table } from "@chakra-ui/react";
import SearchInput from "../ui/search-input";

import React, {
  useState,
  useEffect,
  ChangeEvent,
  FormEvent,
  useLayoutEffect,
  useMemo,
  useRef,
  useCallback,
} from "react";
import { VerseData, BookInfo, CV } from "@/utils/types";
import { getName, isValidBookAndChapter, sendMessage } from "@/utils";
import chapterAndVerse from "@/utils/parser/cv";
import { toaster } from "../ui/toaster";
import { UpdateDisplayProps } from "./ControlsMain";
import { DisplayProps } from "@/app/controls/page";
import HighlightVerse from "./HighlightVerse";
import { useAppInfo } from "@/providers/AppInfo";

export type ChangeScriptureFn = (
  book: BookInfo,
  chapter: string,
  verse: number,
  text?: string,
  live?: boolean,
) => void;

let chapterData = {};
if (typeof window !== "undefined") {
  window.electronAPI.fetchChapterCounts().then((result) => {
    chapterData = result;
  });
}

const defaultBook = {
  order: 1,
  id: "Gen",
  name: "Genesis",
  testament: "O",
  start: "gen",
  abbr: ["ge", "gn"],
  chapters: 50,
  versesPerChapter: [
    31, 25, 24, 26, 32, 22, 24, 22, 29, 32, 32, 20, 18, 24, 21, 16, 27, 33, 38,
    18, 34, 24, 20, 67, 34, 35, 46, 22, 35, 43, 55, 32, 20, 31, 29, 43, 36, 30,
    23, 23, 57, 38, 34, 34, 28, 34, 31, 22, 33, 26,
  ],
};

export default function ScriptureSelection({
  setPreview,
  setLive,
}: UpdateDisplayProps) {
  const [input, setInput] = useState("");
  const [filteredBooks, setFilteredBooks] = useState<string[]>([]);
  const [displayChapter, setDisplayChapter] = useState<VerseData[]>([]);
  const [highlightVerse, setHighlightVerse] = useState<number | null>(null);
  const [navigatedVerse, setNavigatedVerse] = useState<number | null>(null); // New state for navigated verse
  const [bookNames, setBookNames] = useState<string[]>([]);
  const [book, setBook] = useState<BookInfo>(defaultBook);
  const bookName = useMemo(() => getName(book), [book]);
  const [chapter, setChapter] = useState<number>(1);
  const [verse, setVerse] = useState<number>(1);
  const [isHidden, setHidden] = useState(false); // Control whether scripture is hidden or shown
  const [version] = useState("NKJV");
  const verseListRef = useRef<HTMLDivElement | null>(null);
  const { panelFocus } = useAppInfo();

  useEffect(() => {
    console.log("NAVIG VERSE: ", navigatedVerse, navigatedVerse === verse);
  }, [navigatedVerse, verse]);

  const updateInput = useCallback(
    (book: BookInfo, chapter: number, verse: number | string) => {
      if (book?.name) {
        setInput(`${getName(book)} ${chapter}:${verse}`);
      }
    },
    [],
  );

  const sendVerseToHomePage = useCallback(
    async (
      book: string,
      chapter: string,
      verse: string,
      text = "",
      isPreview?: boolean,
    ) => {
      if (!text.length && typeof window !== "undefined") {
        const fetchResults = await window.electronAPI.fetchScripture({
          book,
          chapter,
          verse,
          version,
        });
        text = fetchResults.text;
      }
      const verseData = {
        book,
        chapter,
        verse,
        version,
        text,
      };
      const displayData: DisplayProps = {
        type: "scripture",
        data: [verseData],
        index: 0,
      };
      setPreview(displayData);
      if (!isPreview) {
        setLive(displayData);
      }
      // console.log(window.electronAPI, "just sent this info: ", verseData)
      // window.electronAPI.sendVerseUpdate(verseData)
      // const event = new Event("verseHighlighted");
      // window.dispatchEvent(event);
    },
    [setLive, setPreview, version],
  );

  const changeScripture: ChangeScriptureFn = useCallback(
    (book, chapter, verse, text = "", live = true) => {
      const currentBook = getName(book);
      console.log(verse);
      if (currentBook) {
        setBook(book);
        setChapter(Number(chapter));
        setVerse(Number(verse));
        updateInput(book, Number(chapter), verse);
        setNavigatedVerse(verse);
        if (live) {
          setHighlightVerse(verse);
        }
        sendVerseToHomePage(
          currentBook,
          chapter.toString(),
          verse.toString(),
          text,
          !live,
        );
      }
    },
    [sendVerseToHomePage, updateInput],
  );

  const updateChapterDisplayState = useCallback(
    (
      newBook: string = bookName,
      newChapter: string = chapter.toString(),
      newVersion: string = version,
    ) => {
      window.electronAPI
        .fetchChapter({
          book: newBook,
          chapter: newChapter,
          version: newVersion,
        })
        .then((result) => {
          console.log("Updated Chapters: ", result);
          setDisplayChapter(result);
        });
    },
    [bookName, chapter, version],
  );

  useEffect(() => {
    window.electronAPI.fetchChapterCounts().then((result) => {
      setBookNames(Object.keys(result).sort());
    });
    updateChapterDisplayState();
  }, [updateChapterDisplayState]);

  useEffect(() => {
    const channel = new BroadcastChannel("live-change");

    const handleKeyDown = (e: KeyboardEvent) => {
      if (panelFocus !== "scripture") return;

      if (e.ctrlKey && e.key === "c") {
        // Toggle hide/show scripture on Ctrl + C
        const shouldHide = !isHidden;
        console.log("Running HIde Logic", shouldHide);
        if (shouldHide) {
          sendMessage(channel, { isHidden: true });
        } else {
          sendMessage(channel, { isHidden: false });
          // sendVerseToHomePage(
          //   getName(book),
          //   chapter.toString(),
          //   verse.toString(),
          // );
        }
        setHidden(shouldHide);
      } else if (e.key === "ArrowDown") {
        // Navigate to the next verse
        const nextVerse = (navigatedVerse || highlightVerse || 0) + 1;
        if (nextVerse <= (book?.versesPerChapter?.[chapter - 1] ?? 1)) {
          setNavigatedVerse(nextVerse);
          updateInput(book, chapter, nextVerse);
        }
      } else if (e.key === "ArrowUp") {
        // Navigate to the previous verse
        const prevVerse = (navigatedVerse || highlightVerse || 2) - 1;
        if (prevVerse > 0) {
          setNavigatedVerse(prevVerse);
          updateInput(book, chapter, prevVerse);
        }
      } else if (e.key === "Enter") {
        // Confirm and highlight the current verse on Enter
        if (navigatedVerse) {
          console.log(navigatedVerse);
          changeScripture(book, chapter.toString(), navigatedVerse);
          console.log(navigatedVerse);
          setNavigatedVerse(null); // Reset navigated verse after confirming
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [
    navigatedVerse,
    highlightVerse,
    book,
    chapter,
    verse,
    panelFocus,
    isHidden,
    setNavigatedVerse,
    updateInput,
    changeScripture,
    setHidden,
  ]); // changeScripture, channel, sendVerseToHomePage

  useEffect(() => {
    if (highlightVerse) {
      const alertTimer = setTimeout(() => {
        toaster.create({
          type: "success",
          description: "Consider hiding the scripture",
        });
      }, 90000); // 2 minutes in milliseconds - changed to 1 min 30s

      return () => clearTimeout(alertTimer);
    }
  }, [highlightVerse]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    console.log("Running Input Change Handler");
    let userInput: string = e.target.value;
    const cv: CV | undefined = chapterAndVerse(userInput);
    let newVerse: number | null = null;

    let filtered = bookNames.filter((book) =>
      book.toLowerCase().startsWith(userInput.toLowerCase()),
    );
    // console.log(cv, userInput, filtered);

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
      // console.log(!filtered.length, !cv?.success);

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
      console.log("NEWVERSE: ", newVerse);
      setNavigatedVerse(newVerse);
    }

    const cvBookName = getName(cv?.book);
    console.log(userInput, cv?.chapter, filtered, getName(cv?.book));
    setInput(userInput);
    setFilteredBooks(filtered);

    // Confirm book exists & that we don't already have the correct data for it
    const chapterToFetch = cv?.chapter ?? 1;
    console.log(cvBookName, bookName, chapterToFetch, chapter);
    if (cvBookName && (cvBookName !== bookName || chapterToFetch !== chapter)) {
      updateChapterDisplayState(cvBookName, chapterToFetch.toString());
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Running Handle Submit");
    updateInput(book, chapter, verse);
    let verseToHighlight: number | null = verse;

    // if (bibleData[bookName] && bibleData[bookName][chapter]) {
    if (isValidBookAndChapter(bookName, chapter, chapterData).valid) {
      // setDisplayChapter(
      //   await window.electronAPI.fetchChapter({
      //     book: bookName,
      //     chapter: chapter.toString(),
      //     version: "NKJV",
      //   }),
      // );

      if (verse) {
        verseToHighlight = verse;
        sendVerseToHomePage(bookName, chapter.toString(), verse.toString());
      } else {
        verseToHighlight = null;
      }
    } else {
      setDisplayChapter([]);
      verseToHighlight = null;
    }

    setHighlightVerse(verseToHighlight);
    setNavigatedVerse(verseToHighlight);
  };

  useEffect(() => {
    if (navigatedVerse === verse) return;
    const navigVerse = (navigatedVerse ?? verse).toString();

    function getVerse() {
      return displayChapter.find(({ verse }) => verse === navigVerse);
    }

    sendVerseToHomePage(
      bookName,
      chapter.toString(),
      navigVerse,
      getVerse()?.text,
      true,
    );
  }, [
    navigatedVerse,
    sendVerseToHomePage,
    displayChapter,
    bookName,
    chapter,
    verse,
  ]);

  useLayoutEffect(() => {
    if (navigatedVerse) {
      // requestAnimationFrame(() => {
      const verseButton = verseListRef.current?.querySelector(
        `tr[data-verse="${getName(book)}-${chapter}-${navigatedVerse}"]`,
      ) as HTMLButtonElement | null;

      if (verseButton && verseListRef.current) {
        verseListRef.current.scrollTop =
          verseButton.offsetTop - verseListRef.current.clientHeight / 2;
        // verseButton.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      // });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigatedVerse]);

  useEffect(() => console.log(displayChapter), [displayChapter]);

  return (
    <Flex h="full" pos="relative" bg="bg.muted">
      <Box
        w="1/4"
        pos="absolute"
        left="0"
        h="full"
        border="1px solid"
        borderColor="gray.700"
      >
        <form onSubmit={handleSubmit}>
          <SearchInput
            className="capitalize"
            value={input}
            placeholder="Enter book, chapter, and verse"
            onChange={handleInputChange}
          />
        </form>
      </Box>
      <Box
        w="3/4"
        h="full"
        pos="absolute"
        right="0"
        border="1px solid"
        borderColor="gray.700"
      >
        <Box maxW="full" overflow="auto" height="full" ref={verseListRef}>
          <Table.Root
            size="sm"
            variant="outline"
            stickyHeader
            showColumnBorder
            interactive
          >
            <Table.Header>
              <Table.Row>
                <Table.ColumnHeader pl={4}>Version</Table.ColumnHeader>
                <Table.ColumnHeader pl={4} whiteSpace="nowrap">
                  Reference
                </Table.ColumnHeader>
                <Table.ColumnHeader pl={4}>Scripture</Table.ColumnHeader>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {displayChapter.map(({ verse, text }) => (
                <HighlightVerse
                  key={`${getName(book)}-${chapter}-${verse}`}
                  onVerseClick={() => {
                    changeScripture(
                      book,
                      chapter.toString(),
                      parseInt(verse),
                      text,
                      false,
                    );
                  }}
                  book={book}
                  chapter={chapter}
                  verseNum={parseInt(verse)}
                  bibleVersion={version}
                  highlightVerse={highlightVerse}
                  navigatedVerse={navigatedVerse}
                  verseText={text}
                />
              ))}
            </Table.Body>
          </Table.Root>
        </Box>
        {/* <Box h="full" overflow="auto" ref={verseListRef}> */}
        {/* <For each={Object.keys(bibleData)}>
              {(bibleBook, index) => (
                <For each={Object.keys(bibleData[bibleBook])}>
                  {(bibleChapter) => (
                    <For each={Object.keys(bibleData[bibleBook][bibleChapter])}>
                      {(bibleVerse) => (
                        <button className="text-left w-full flex gap-2 py-2 px-4">
                          {bibleBook} {bibleChapter}:{bibleVerse}
                          <span>{displayChapter[bibleVerse]}</span>
                        </button>
                      )}
                    </For>
                  )}
                </For>
              )}
            </For> */}
        {/* {Object.keys(displayChapter).map((verseNum) => (
              <HighlightVerse
                onVerseClick={() => {
                  changeScripture(book, chapter.toString(), verseNum, false);
                }}
                book={book}
                chapter={chapter}
                verseNum={verseNum}
                bibleVersion="nkjv"
                highlightVerse={highlightVerse}
                navigatedVerse={navigatedVerse}
                verseText={displayChapter[verseNum]}
              />
            ))} */}
        {/* </Box> */}
      </Box>
    </Flex>
  );
}
