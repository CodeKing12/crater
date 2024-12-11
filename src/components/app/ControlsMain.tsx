import { Tabs, VStack } from "@chakra-ui/react";
import { LuMusic } from "react-icons/lu";
import { MdOutlinePermMedia, MdOutlineStyle } from "react-icons/md";
import { PiPresentation } from "react-icons/pi";
import { TbBible } from "react-icons/tb";
import SongSelection from "./SongSelection";
import ScriptureSelection from "./ScriptureSelection";
import { DisplayProps } from "@/app/controls/page";

export interface UpdateDisplayProps {
  setPreview: (item: DisplayProps[]) => void;
  setLive: (item: DisplayProps[]) => void;
}

export default function ControlsMain({
  setPreview,
  setLive,
}: UpdateDisplayProps) {
  return (
    <VStack h="full">
      <Tabs.Root
        w="full"
        h="full"
        variant="plain"
        display="flex"
        flexDir="column"
        defaultValue="scripture"
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
            <SongSelection />
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
