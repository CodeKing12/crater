"use client";

import {
  Box,
  Flex,
  For,
  Grid,
  GridItem,
  Input,
  SimpleGrid,
  Table,
} from "@chakra-ui/react";
import SearchInput from "../ui/search-input";

import NKJVBibleJSON from "@/bibles/bible_data.json";
import React, {
  useState,
  useEffect,
  ChangeEvent,
  FormEvent,
  useRef,
  useLayoutEffect,
  useMemo,
} from "react";
import { VerseData, BibleData, BookInfo, CV } from "@/utils/types";
import { getName, sendMessage } from "@/utils";
import chapterAndVerse from "@/utils/parser/cv";
import { toaster } from "../ui/toaster";
import { UpdateDisplayProps } from "./ControlsMain";
import { DisplayProps } from "@/app/controls/page";
import HighlightVerse from "./HighlightVerse";
import {
  FocusContext,
  useFocusable,
} from "@noriginmedia/norigin-spatial-navigation";

const NKJVBible: Record<string, any> = NKJVBibleJSON;
// const verseList = Object.keys(NKJVBible).map((book) =>
//   Object.keys(NKJVBible[book]).map((chapter) => NKJVBible[book][chapter]),
// );
// console.log(verseList);

export type ChangeScriptureFn = (
  book: BookInfo,
  chapter: string,
  verse: string,
  live?: boolean,
) => void;

export default function ScriptureSelection({
  setPreview,
  setLive,
}: UpdateDisplayProps) {
  const [bibleData] = useState<BibleData>(NKJVBible);
  const [input, setInput] = useState("");
  const [filteredBooks, setFilteredBooks] = useState<string[]>([]);
  const [displayChapter, setDisplayChapter] = useState<VerseData>({});
  const [highlightVerse, setHighlightVerse] = useState<string | null>(null);
  const [navigatedVerse, setNavigatedVerse] = useState<string | null>(null); // New state for navigated verse
  const [bookNames, setBookNames] = useState<string[]>([]);
  const [book, setBook] = useState<BookInfo>({});
  const bookName = useMemo(() => getName(book), [book]);
  const [chapter, setChapter] = useState<number>(1);
  const [verse, setVerse] = useState<number>(1);
  const [isHidden, setHidden] = useState(false); // Control whether scripture is hidden or shown
  // const verseListRef = useRef<HTMLDivElement | null>(null);
  const { ref: verseListRef, focusKey } = useFocusable({
    focusKey: "SCRIPTURE-SELECTION",
  });

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
    isPreview?: boolean,
  ) => {
    const verseData = {
      book,
      chapter,
      verse,
      version: "nkjv",
      text: bibleData[book][chapter][verse],
    };
    const displayData: DisplayProps[] = [
      {
        type: "scripture",
        data: verseData,
      },
    ];
    setPreview(displayData);
    if (!isPreview) {
      setLive(displayData);
    }
    // console.log(window.electronAPI, "just sent this info: ", verseData)
    // window.electronAPI.sendVerseUpdate(verseData)
    // const event = new Event("verseHighlighted");
    // window.dispatchEvent(event);
  };

  const changeScripture: ChangeScriptureFn = (
    book,
    chapter,
    verse,
    live = true,
  ) => {
    const currentBook = getName(book);
    console.log(verse);
    if (currentBook) {
      setBook(book);
      setChapter(Number(chapter));
      setVerse(Number(verse));
      updateInput(book, Number(chapter), verse);
      setNavigatedVerse(verse.toString());
      if (live) {
        setHighlightVerse(verse.toString());
      }
      sendVerseToHomePage(
        currentBook,
        chapter.toString(),
        verse.toString(),
        !live,
      );
    }
  };

  useEffect(() => setBookNames(Object.keys(bibleData).sort()), [bibleData]);

  useEffect(() => {
    const channel = new BroadcastChannel("live-change");

    const handleKeyDown = (e: KeyboardEvent) => {
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
          console.log(navigatedVerse);
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
        toaster.create({
          type: "success",
          description: "Consider hiding the scripture",
        });
      }, 90000); // 2 minutes in milliseconds - changed to 1 min 30s

      return () => clearTimeout(alertTimer);
    }
  }, [highlightVerse]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    let userInput: string = e.target.value;
    console.log(chapterAndVerse);
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
      console.log("NEWVERSE: ", newVerse);
      setNavigatedVerse(newVerse.toString());
    }
    const bookName = getName(cv?.book);
    console.log(userInput, cv?.chapter, filtered, getName(cv?.book));
    setInput(userInput);
    setFilteredBooks(filtered);
    // if (bibleData[bookName]) {
    setDisplayChapter(bibleData[bookName][cv?.chapter ?? 1]);
    // }
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    updateInput(book, chapter, verse);
    let verseToHighlight: string | null = verse.toString();

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

  useEffect(() => {
    const navigVerse = navigatedVerse ?? verse;
    setPreview([
      {
        type: "scripture",
        data: {
          verse: navigVerse,
          book: bookName,
          chapter: chapter,
          text: bibleData?.[bookName][chapter][navigVerse],
        },
      },
    ]);
  }, [navigatedVerse]);

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
              {Object.keys(displayChapter).map((verseNum) => (
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
