"use client";

import React, {
  useState,
  useEffect,
  ChangeEvent,
  FormEvent,
  useRef,
  useLayoutEffect,
} from "react";
import { VerseData, BibleData, BookInfo, CV } from "@/utils/types";
import { getName, sendMessage } from "@/utils";
import chapterAndVerse from "@/utils/parser/cv";
import { Box, SimpleGrid } from "@chakra-ui/react";
import ControlsMain from "@/components/app/ControlsMain";
import ScheduleComponent from "@/components/app/ScheduleComponent";
import PreviewComponent from "@/components/app/PreviewComponent";
import LiveComponent from "@/components/app/LiveComponent";

export interface DisplayProps {
  type: "scripture" | "song" | "image" | "video" | "message";
  data: any;
}

const BibleViewer = () => {
  const [preview, setPreview] = useState<DisplayProps[]>();
  const [live, setLive] = useState<DisplayProps[]>();
  const [isHidden, setHidden] = useState(false); // Control whether scripture is hidden or shown

  useEffect(() => {
    // const handleKeyDown = (e: KeyboardEvent) => {
    // if (e.ctrlKey && e.key === "c") {
    //   // Toggle hide/show scripture on Ctrl + C
    //   const shouldHide = !isHidden;
    //   if (shouldHide) {
    //     sendMessage(channel, { isHidden: true });
    //   } else {
    //     sendMessage(channel, { isHidden: false });
    //   }
    //   setHidden(shouldHide);
    // }
    // };
    // document.addEventListener("keydown", handleKeyDown);
    // return () => {
    //   document.removeEventListener("keydown", handleKeyDown);
    // };
  });

  return (
    <Box w="vw" h="vh" bg="bg.muted" pos="relative" overflow="hidden">
      <SimpleGrid w="full" h="8/12" columns={3} pos="absolute" top="0">
        <Box h="full" border="1px solid" borderColor="gray.700">
          <ScheduleComponent />
        </Box>
        <Box h="full" border="1px solid" borderColor="gray.700">
          <PreviewComponent previewItems={preview} setLive={setLive} />
        </Box>
        <Box h="full" border="1px solid" borderColor="gray.700">
          <LiveComponent liveItems={live} />
        </Box>
      </SimpleGrid>
      <Box w="full" h="4/12" pos="absolute" bottom="0">
        <ControlsMain setPreview={setPreview} setLive={setLive} />
      </Box>
    </Box>
  );
};

export default BibleViewer;
