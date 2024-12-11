"use client";

// import { fetchBibleData } from "@/utils";
import { BibleData } from "@/utils/types";
import { useEffect, useState } from "react";
// import NKJVBibleJSON from "@/bibles/bible_data.json";

// import { DM_Sans, Space_Grotesk } from "next/font/google"
// const NKJVBible: Record<string, any> = NKJVBibleJSON;

interface HighlightedVerse {
  book: string;
  chapter: string;
  verse: string;
  version: string;
  text: string;
}

const defaultScripture: HighlightedVerse = {
  book: "",
  chapter: "",
  verse: "",
  version: "",
  text: "",
};

interface CommunicationObj {
  isHidden: boolean;
}

// const dmSans = DM_Sans({weight: "variable", style: "normal", display: "swap", subsets: ["latin", "latin-ext"] })
// const spaceGrotesk = Space_Grotesk({weight: "variable", style: "normal", display: "swap", subsets: ["latin", "latin-ext"] })

export default function Home() {
  // const [highlightedVerse, setHighlightedVerse] = useState<HighlightedVerse | null>(null);
  // const [bibleData] = useState<BibleData>(NKJVBible);
  const [scriptureData, setScriptureData] =
    useState<HighlightedVerse>(defaultScripture);
  const [comms, setComms] = useState<CommunicationObj>({ isHidden: false });

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
    const channel = new BroadcastChannel("live-change");
    channel.addEventListener("message", (e) => {
      const msgInfo = e.data;
      console.log("RECEIVED BROADCAST MESSAGE: ", msgInfo);
      if (msgInfo?.type === "message") {
        setComms((former) => ({ ...former, ...msgInfo.data }));
      }
      if (msgInfo?.type === "scripture") {
        setScriptureData(msgInfo.data);
        console.log("Showing");
        // setComms((former) => ({ ...former, isHidden: false }));
      }
    });
  }, []);

  return (
    <main
      className={`h-full max-w-screen max-h-screen flex flex-col justify-between bg-transparent text-white duration-500 ease-in-out opacity-100 translate-y-0 ${comms?.isHidden ? "" : ""}`}
    >
      <div></div>
      <div className={`max-w-full ${scriptureData.verse ? "" : "opacity-0"}`}>
        <div
          className={`capitalize reference text-4xl font-black pl-24 pr-7 py-3 bg-white text-black w-1/2 duration-300 ease-linear ${comms?.isHidden ? "!text-opacity-0 !opacity-0 !translate-x-12" : ""}`}
        >
          {scriptureData?.book} {scriptureData?.chapter}:{scriptureData?.verse}{" "}
          {scriptureData?.version?.toUpperCase()}
        </div>
        <div
          className={`verse text-4xl font-semibold outline-[30px] leading-[1.35] tracking-wide pl-20 pr-10 pt-10 pb-10 bg-black bg-opacity-80 duration-300 ease-linear delay-100 ${comms?.isHidden ? "!text-opacity-0 !opacity-0 !-translate-x-12" : ""}`}
        >
          {scriptureData.text}
        </div>
      </div>
    </main>
  );
}
