import { DisplayProps } from "@/app/controls/page";
import { Stack } from "@chakra-ui/react";
import ScriptureDisplay from "./ScriptureDisplay";
import { useCallback, useEffect, useRef, useState } from "react";
import LyricDisplay from "./LyricDisplay";
import { VariableSizeList } from "react-window";
import AutoSizer from "react-virtualized-auto-sizer";
import { useWindowResize } from "@/hooks/useWindowResize";
import { ItemSizeMap } from "@/utils/types";
import { SetItemSize } from "./PreviewComponent";
import { useAppInfo } from "@/providers/AppInfo";

interface LiveCompProps {
  liveItem?: DisplayProps;
}

export default function LiveComponent({ liveItem }: LiveCompProps) {
  const listParentRef = useRef<HTMLDivElement | null>(null);
  const listRef = useRef<VariableSizeList>(null);
  const sizeMap = useRef<ItemSizeMap>({});
  const setSize = useCallback<SetItemSize>((index, size) => {
    sizeMap.current = { ...sizeMap.current, [index]: size };
    listRef.current?.resetAfterIndex(index);
  }, []);
  const [windowWidth] = useWindowResize();
  const [navigatedLyric, setnavigatedLyric] = useState<number>(); // New state for navigated verse
  const { panelFocus, setPanelFocus } = useAppInfo();

  const displayLiveItem = useCallback(
    (index: number) => {
      const channel = new BroadcastChannel("update-live-display");

      if (liveItem) {
        console.log("Live Item", liveItem);
        setnavigatedLyric(index);
        channel.postMessage({
          type: liveItem.type,
          [liveItem.type]: liveItem.data[index],
        });
      }
    },
    [liveItem],
  );

  const getItemSize = (index: number) => sizeMap.current[index] || 100;

  useEffect(() => {
    function handleComponentFocus() {
      if (panelFocus !== "live") {
        console.log("Component Focused");
        setPanelFocus("live");
      }
    }
    if (listParentRef) {
      listParentRef.current?.addEventListener("click", handleComponentFocus);
    }

    return () => {
      listParentRef.current?.removeEventListener("click", handleComponentFocus);
    };
  }, [setPanelFocus, listParentRef, panelFocus]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      console.log("Live Panel Handler Called, But Focus is:", panelFocus);
      if (panelFocus !== "live" || !liveItem?.data.length) return;

      if (e.key === "ArrowDown") {
        // Navigate to the next verse
        const navigNext = (navigatedLyric ?? 0) + 1;
        if (navigNext <= liveItem?.data.length) {
          displayLiveItem(navigNext);
        }
      } else if (e.key === "ArrowUp") {
        // Navigate to the previous verse
        const navigPrev = (navigatedLyric ?? 0) - 1;
        if (navigPrev >= 0) {
          displayLiveItem(navigPrev);
        }
      } else if (e.key === "Enter") {
        // Confirm and highlight the current verse on Enter
        if (navigatedLyric) {
          console.log(navigatedLyric);
          displayLiveItem(navigatedLyric);
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [liveItem, panelFocus, setnavigatedLyric, displayLiveItem]);

  useEffect(() => {
    if (liveItem) {
      console.log("Live Index", liveItem.index);
      displayLiveItem(liveItem.index);
    }
  }, [liveItem, displayLiveItem]);

  return (
    <Stack h="full" py="3" ref={listParentRef}>
      <AutoSizer>
        {({ height, width }) => (
          <VariableSizeList
            ref={listRef}
            itemCount={liveItem?.data.length ?? 0}
            width={width}
            height={height}
            itemSize={getItemSize}
            className="[&>div]:mb-6"
          >
            {({ index, style }) =>
              liveItem?.type === "scripture" ? (
                <ScriptureDisplay
                  key={index}
                  index={index}
                  scripture={liveItem.data[index]}
                  onScriptureClick={() => displayLiveItem(index)}
                  style={style}
                  setSize={setSize}
                  windowWidth={windowWidth}
                  isCurrentNavig={navigatedLyric === index}
                />
              ) : liveItem?.type === "song" ? (
                <LyricDisplay
                  key={index}
                  index={index}
                  lyric={liveItem.data[index]}
                  onLyricClick={() => displayLiveItem(index)}
                  style={style}
                  setSize={setSize}
                  windowWidth={windowWidth}
                  isCurrentNavig={navigatedLyric === index}
                />
              ) : (
                ""
              )
            }
          </VariableSizeList>
        )}
      </AutoSizer>
      {/* {liveItem?.type === "scripture" ? (
        <For each={liveItem?.data}>
          {(item, index) => (
            <ScriptureDisplay
              key={index}
              scripture={item}
              onScriptureClick={() => displayLiveItem(index)}
            />
          )}
        </For>
      ) : liveItem?.type === "song" ? (
        <For each={liveItem?.data}>
          {(item, index) => (
            <LyricDisplay
              key={index}
              lyric={item}
              onLyricClick={() => displayLiveItem(index)}
            />
          )}
        </For>
      ) : (
        ""
      )} */}
    </Stack>
  );
}
