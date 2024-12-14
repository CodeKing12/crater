import { getName } from "@/utils";
import { BookInfo } from "@/utils/types";
import { MouseEventHandler } from "react";
import { Table } from "@chakra-ui/react";

interface HighlightVerseProps {
  verseNum: number;
  book: BookInfo;
  chapter: number;
  bibleVersion: string;
  onVerseClick: MouseEventHandler;
  highlightVerse: number | null;
  navigatedVerse: number | null;
  verseText: string;
}

export default function HighlightVerse({
  verseNum,
  book,
  chapter,
  bibleVersion,
  onVerseClick,
  highlightVerse,
  navigatedVerse,
  verseText,
}: HighlightVerseProps) {
  return (
    // <Box
    //   className={`text-left w-full flex gap-2 py-2 px-4 outline-none hover:bg-gray-700 ${verseNum === highlightVerse ? "bg-[#228B22] hover:bg-[#228B22]" : verseNum === navigatedVerse ? "bg-[#1E90FF] hover:bg-[#1E90FF]" : ""} cursor-pointer`}
    //   //   ${focused ? "border-2 border-red-500" : ""}
    //   //   ref={ref}
    //   key={`${getName(book)}-${chapter}-${verseNum}`}
    //   tabIndex={-1}
    //   data-verse={`${getName(book)}-${chapter}-${verseNum}`}
    //   onClick={onVerseClick}
    //   //   style={{
    //   //     backgroundColor:
    //   //       verseNum === highlightVerse
    //   //         ? "#228B22"
    //   //         : verseNum === navigatedVerse
    //   //           ? "#1E90FF" // Different color for navigated verse
    //   //           : "transparent",
    //   //   }}
    // >
    //   <Box w="1/12" textTransform="uppercase">
    //     {bibleVersion}
    //   </Box>
    //   <Box w="2/12" textTransform="capitalize">
    //     {getName(book)} {chapter}:{verseNum}
    //   </Box>
    //   <Box w="9/12">{verseText}</Box>
    //   {/* <strong>{verseNum}:</strong>
    //   <span>{verseText}</span> */}
    // </Box>
    <>
      <Table.Row
        tabIndex={-1}
        userSelect="none"
        data-verse={`${getName(book)}-${chapter}-${verseNum}`}
        onClick={onVerseClick}
        maxW="full"
        bgColor={
          verseNum === highlightVerse
            ? "#228B22"
            : verseNum === navigatedVerse
              ? "#1E90FF"
              : ""
        }
      >
        <Table.Cell pl={4} textTransform="uppercase">
          {bibleVersion}
        </Table.Cell>
        <Table.Cell pl={4} textTransform="capitalize" whiteSpace="nowrap">
          {getName(book)} {chapter}:{verseNum}
        </Table.Cell>
        <Table.Cell pl={4}>{verseText}</Table.Cell>
      </Table.Row>
    </>
  );
}
