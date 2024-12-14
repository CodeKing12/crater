import { Tabs, VStack } from "@chakra-ui/react";
import { LuMusic } from "react-icons/lu";
import { MdOutlinePermMedia, MdOutlineStyle } from "react-icons/md";
import { PiPresentation } from "react-icons/pi";
import { TbBible } from "react-icons/tb";
import SongSelection from "./SongSelection";
import ScriptureSelection from "./ScriptureSelection";
import { DisplayProps } from "@/app/controls/page";
import { useAppInfo } from "@/providers/AppInfo";
import { useEffect, useRef } from "react";

export interface UpdateDisplayProps {
  setPreview: (item: DisplayProps) => void;
  setLive: (item: DisplayProps) => void;
}

type Props = UpdateDisplayProps;

// const CONTROL_PANELS = {
//   SONGS: "songs",
//   SCRIPTURE: "scripture",
//   MEDIA: "media",
//   PRESENTATIONS: "presentations",
//   THEMES: "themes",
// };

export default function ControlsMain({ setPreview, setLive }: Props) {
  const DEFAULT_TAB = "scripture";
  const { panelFocus, setPanelFocus } = useAppInfo();
  const panelRootRef = useRef<HTMLDivElement | null>(null);
  const currentTab = useRef(DEFAULT_TAB);

  function changeKeyboardFocus({ value }: { value: string }) {
    console.log("Changing Focus: ", value);
    currentTab.current = value;
    setPanelFocus(value);
  }

  useEffect(() => {
    function handleComponentFocus() {
      if (panelFocus !== currentTab.current) {
        console.log(
          "ControlsMain Component Focused, Current: ",
          panelFocus,
          currentTab.current,
        );
        setPanelFocus(currentTab.current);
      }
    }

    if (panelRootRef) {
      panelRootRef.current?.addEventListener("click", handleComponentFocus);
    }

    const cleanupRef = panelRootRef.current;
    return () => {
      cleanupRef?.removeEventListener("click", handleComponentFocus);
    };
  }, [setPanelFocus, panelRootRef, panelFocus]);

  return (
    <VStack h="full" ref={panelRootRef}>
      <Tabs.Root
        w="full"
        h="full"
        variant="plain"
        display="flex"
        flexDir="column"
        defaultValue={DEFAULT_TAB}
        onValueChange={changeKeyboardFocus}
      >
        <Tabs.List
          gap={2}
          w="full"
          bg="bg.muted"
          py="1"
          pl="2"
          fontFamily="heading"
        >
          <Tabs.Trigger value="songs" px={4} _focus={{ outline: "none" }}>
            <LuMusic />
            Songs
          </Tabs.Trigger>
          <Tabs.Trigger value="scripture" px={4}>
            <TbBible />
            Scripture
          </Tabs.Trigger>
          <Tabs.Trigger value="media" px={4}>
            <MdOutlinePermMedia />
            Media
          </Tabs.Trigger>
          <Tabs.Trigger value="presentations" px={4}>
            <PiPresentation />
            Presentations
          </Tabs.Trigger>
          <Tabs.Trigger value="themes" px={4}>
            <MdOutlineStyle />
            Themes
          </Tabs.Trigger>
          <Tabs.Indicator rounded="l2" />
        </Tabs.List>
        <Tabs.ContentGroup bg="bg.muted" h="full" fontFamily="body">
          <Tabs.Content h="full" value="songs" py={0}>
            <SongSelection setPreview={setPreview} setLive={setLive} />
          </Tabs.Content>
          <Tabs.Content h="full" value="scripture" py={0}>
            <ScriptureSelection setPreview={setPreview} setLive={setLive} />
          </Tabs.Content>
          <Tabs.Content value="media">
            Manage your tasks for freelancers
          </Tabs.Content>
          <Tabs.Content value="presentations">
            Manage your tasks for freelancers
          </Tabs.Content>
          <Tabs.Content value="themes">
            Manage your tasks for freelancers
          </Tabs.Content>
        </Tabs.ContentGroup>
      </Tabs.Root>
    </VStack>
  );
}
