"use client";

import { useEffect, useState } from "react";
import { SongLyric } from "../../interface";
import RenderLyric from "@/components/app/RenderLyric";
import RenderScripture from "@/components/app/RenderScripture";

// import { DM_Sans, Space_Grotesk } from "next/font/google"
// const NKJVBible: Record<string, any> = NKJVBibleJSON;

export interface HighlightedVerse {
  book: string;
  chapter: string;
  verse: string;
  version: string;
  text: string;
}

// const defaultScripture: HighlightedVerse = {
//   book: "",
//   chapter: "",
//   verse: "",
//   version: "",
//   text: "",
// };

interface CommunicationObj {
  isHidden: boolean;
}

interface DisplayInfo {
  type: "scripture" | "song";
  scripture?: HighlightedVerse;
  song?: SongLyric;
}

// const dmSans = DM_Sans({weight: "variable", style: "normal", display: "swap", subsets: ["latin", "latin-ext"] })
// const spaceGrotesk = Space_Grotesk({weight: "variable", style: "normal", display: "swap", subsets: ["latin", "latin-ext"] })

export default function Home() {
  // const [highlightedVerse, setHighlightedVerse] = useState<HighlightedVerse | null>(null);
  // const [bibleData] = useState<BibleData>(NKJVBible);
  const [displayData, setDisplayData] = useState<DisplayInfo>({
    type: "scripture",
  });
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

    const handleLiveMessage = (e: MessageEvent) => {
      const msgInfo = e.data;
      console.log("RECEIVED BROADCAST MESSAGE: ", msgInfo);
      if (msgInfo?.type === "message") {
        setComms((former) => ({ ...former, ...msgInfo.data }));
      } else {
        console.log(msgInfo);
        setDisplayData(msgInfo);
      }
      // if (msgInfo?.type === "scripture") {
      //   console.log("Showing");
      //   // setComms((former) => ({ ...former, isHidden: false }));
      // }
    };

    // Use a broadcast channel to pass scripture changes and other info
    const channel = new BroadcastChannel("update-live-display");
    channel.addEventListener("message", handleLiveMessage);

    return () => {
      channel.removeEventListener("message", handleLiveMessage);
    };
  }, []);

  return (
    <main
      className={`h-full max-w-screen max-h-screen flex flex-col justify-between bg-transparent text-white duration-500 ease-in-out opacity-100 translate-y-0 ${comms?.isHidden ? "" : ""}`}
    >
      <div></div>
      {displayData.type === "scripture" ? (
        <RenderScripture
          scriptureData={displayData?.scripture}
          hide={comms?.isHidden}
        />
      ) : (
        <RenderLyric songData={displayData?.song} hide={comms?.isHidden} />
      )}
    </main>
  );
}
