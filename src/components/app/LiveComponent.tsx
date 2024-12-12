import { DisplayProps } from "@/app/controls/page";
import { Card, For, Heading, Stack } from "@chakra-ui/react";
import ScriptureDisplay from "./ScriptureDisplay";
import { useEffect, useState } from "react";

interface LiveCompProps {
  liveItems?: DisplayProps[];
}

export default function LiveComponent({ liveItems }: LiveCompProps) {
  const channel = new BroadcastChannel("live-change");

  function displayLiveItem(item: DisplayProps) {
    channel.postMessage(item);
  }

  useEffect(() => {
    if (liveItems) {
      if (liveItems[0].type === "scripture") {
        displayLiveItem(liveItems[0]);
      }
      // for (let i=0; i < liveItems.length; i++) {
      // }
    }
  }, [liveItems]);

  return (
    <Stack p="4">
      <For each={liveItems}>
        {(item, index) =>
          item.type === "scripture" ? (
            <ScriptureDisplay
              key={index}
              scripture={item.data}
              onScriptureClick={() => displayLiveItem(item)}
            />
          ) : (
            ""
          )
        }
      </For>
    </Stack>
  );
}
