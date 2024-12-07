"use client";

// import { fetchBibleData } from "@/utils";
import { BibleData } from "@/utils/types";
import { useEffect, useState } from "react";
import NKJVBibleJSON from "@/bibles/bible_data.json"

// import { DM_Sans, Space_Grotesk } from "next/font/google"
const NKJVBible: Record<string, any> = NKJVBibleJSON

interface HighlightedVerse {
  book: string;
  chapter: string;
  verse: string;
  version: string;
}

const defaultScripture: HighlightedVerse = {
  book: "",
  chapter: "",
  verse: "",
  version: "",
}

interface CommunicationObj {
  isHidden: boolean
}

// const dmSans = DM_Sans({weight: "variable", style: "normal", display: "swap", subsets: ["latin", "latin-ext"] })
// const spaceGrotesk = Space_Grotesk({weight: "variable", style: "normal", display: "swap", subsets: ["latin", "latin-ext"] })

export default function Home() {
  // const [highlightedVerse, setHighlightedVerse] = useState<HighlightedVerse | null>(null);
  const [bibleData] = useState<BibleData>(NKJVBible);
  const [scriptureData, setScriptureData] = useState<HighlightedVerse>(defaultScripture)
  const [comms, setComms] = useState<CommunicationObj>({ isHidden: true })

  useEffect(() => {
    // Use the event exposed through the electron preload script
    // if (window.electronAPI) {
    //   const updateHandler = (verseData: HighlightedVerse) => {
    //     console.log(verseData)
    //     setScriptureData(verseData);
    //     setComms((former) => ({ ...former, isHidden: false }));
    //   };
  
    //   window.electronAPI.onScriptureUpdate(updateHandler);
  
    //   return () => {
    //     // Cleanup the listener when the component unmounts
    //     window.electronAPI.onScriptureUpdate(null);
    //   };
    // }

    // Use a broadcast channel to pass scripture changes and other info
    const channel = new BroadcastChannel("verse-change");
    channel.addEventListener("message", e => {
      if (e.data?.isScripture) {
        setScriptureData(e.data);
        console.log("Showing")
        setComms(former => ({...former, isHidden: false}));
      } else {
        console.log("Hiding")
        setComms(former => ({...former, ...e.data}))
      }
    });
  }, []);

  return (
    <main className={`h-full max-w-screen max-h-screen flex flex-col justify-between bg-transparent text-white duration-500 ease-in-out opacity-100 translate-y-0 ${comms?.isHidden ? "" : ""}`}>
      <div></div>
      <div className="max-w-full">
        <div className={`capitalize reference text-4xl font-black pl-24 pr-7 py-3 bg-white text-black w-1/2 duration-300 ease-linear ${comms?.isHidden ? "!text-opacity-0 !opacity-0 !translate-x-12" : ""}`}>{ scriptureData?.book } {scriptureData?.chapter}:{scriptureData?.verse} {scriptureData?.version?.toUpperCase()}</div>
        <div className={`verse text-4xl font-semibold outline-[30px] leading-[1.35] tracking-wide pl-20 pr-10 pt-10 pb-10 bg-black bg-opacity-80 duration-300 ease-linear delay-100 ${comms?.isHidden ? "!text-opacity-0 !opacity-0 !-translate-x-12" : ""}`}>
          { bibleData?.[scriptureData?.book]?.[scriptureData?.chapter][scriptureData?.verse] }
          {/* So the king’s scribes were called at that time, in the third month, which is the month of Sivan, on the twenty-third day; and it was written, according to all that Mordecai commanded, to the Jews, the satraps, the governors, and the princes of the provinces from India to Ethiopia, one hundred and twenty-seven provinces in all, to every province in its own script, to every people in their own language, and to the Jews in their own script and language. */}
        </div>
      </div>
    </main>
  );
}
