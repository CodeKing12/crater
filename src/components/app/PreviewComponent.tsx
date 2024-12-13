import { DisplayProps } from "@/app/controls/page";
import { Stack } from "@chakra-ui/react";
import ScriptureDisplay from "./ScriptureDisplay";
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import LyricDisplay from "./LyricDisplay";
import { VariableSizeList } from "react-window";
import AutoSizer from "react-virtualized-auto-sizer";
import { ItemSizeMap } from "@/utils/types";
import { useWindowResize } from "@/hooks/useWindowResize";
import { useAppInfo } from "@/providers/AppInfo";

interface PreviewCompProps {
  previewItem?: DisplayProps;
  setLive: Dispatch<SetStateAction<DisplayProps | undefined>>;
}

export type SetItemSize = (index: number, size: number) => void;

export default function PreviewComponent({
  previewItem,
  setLive,
}: PreviewCompProps) {
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

  function pushToLive(index: number) {
    if (previewItem?.data) {
      setnavigatedLyric(index);
      setLive({
        type: previewItem.type,
        data: previewItem.data,
        index,
      });
    }
  }

  useEffect(() => {
    console.log("Lyric: ", navigatedLyric);
  }, [navigatedLyric]);

  useEffect(() => {
    function handleComponentFocus() {
      if (panelFocus !== "preview") {
        console.log("Component Focused");
        setPanelFocus("preview");
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
      console.log("Preview Panel Handler Called, But Focus is:", panelFocus);
      if (panelFocus !== "preview" || !previewItem?.data.length) return;

      if (e.key === "ArrowDown") {
        // Navigate to the next verse
        const navigNext = (navigatedLyric ?? 0) + 1;
        if (navigNext <= previewItem?.data.length) {
          setnavigatedLyric(navigNext);
        }
      } else if (e.key === "ArrowUp") {
        // Navigate to the previous verse
        const navigPrev = (navigatedLyric ?? 0) - 1;
        if (navigPrev >= 0) {
          setnavigatedLyric(navigPrev);
        }
      } else if (e.key === "Enter") {
        // Confirm and highlight the current verse on Enter
        if (navigatedLyric) {
          console.log(navigatedLyric);
          pushToLive(navigatedLyric);
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [panelFocus, previewItem, pushToLive, setnavigatedLyric, navigatedLyric]);

  // function getItemSize(index: number) {
  //   if (previewItem?.type == "song") {
  //     console.log(previewItem?.data[index]);
  //     // return previewItem?.data[index]?.text.length * 56;
  //     return 80;
  //   }
  //   return 50;
  // }

  const getItemSize = (index: number) => sizeMap.current[index] || 100;

  useEffect(() => {
    setnavigatedLyric(0);
  }, [previewItem]);

  return (
    <Stack h="full" py="3" gap={2} ref={listParentRef}>
      <AutoSizer>
        {({ height, width }) => (
          <VariableSizeList
            ref={listRef}
            itemCount={previewItem?.data.length ?? 0}
            width={width}
            height={height}
            itemSize={getItemSize}
            className="[&>div]:mb-6"
          >
            {({ index, style }) =>
              previewItem?.type === "scripture" ? (
                <ScriptureDisplay
                  key={index}
                  index={index}
                  scripture={previewItem.data[index]}
                  onScriptureClick={() => setnavigatedLyric(index)}
                  onScriptureDoubleClick={() => pushToLive(index)}
                  style={style}
                  setSize={setSize}
                  windowWidth={windowWidth}
                  isCurrentNavig={navigatedLyric === index}
                />
              ) : previewItem?.type === "song" ? (
                <LyricDisplay
                  key={index}
                  index={index}
                  lyric={previewItem.data[index]}
                  onLyricClick={() => setnavigatedLyric(index)}
                  onLyricDoubleClick={() => pushToLive(index)}
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
      {/* {previewItem?.type === "scripture" ? (
        <For each={previewItem?.data}>
          {(item, index) => (
            <ScriptureDisplay
              key={index}
              scripture={item}
              onScriptureDoubleClick={() => pushToLive([item])}
            />
          )}
        </For>
      ) : previewItem?.type === "song" ? (
      ) : (
        ""
      )} */}
      {/* <For each={previewItem?.data}>
        {(item, index) => (
          <LyricDisplay
            key={index}
            lyric={item}
            onLyricDoubleClick={() => pushToLive([item])}
          />
        )} */}
    </Stack>
  );
}
