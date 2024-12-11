import { DisplayProps } from "@/app/controls/page";
import { For, Stack } from "@chakra-ui/react";
import ScriptureDisplay from "./ScriptureDisplay";
import { Dispatch, SetStateAction } from "react";

interface PreviewCompProps {
  previewItems?: DisplayProps[];
  setLive: Dispatch<SetStateAction<DisplayProps[] | undefined>>;
}

export default function PreviewComponent({
  previewItems,
  setLive,
}: PreviewCompProps) {
  function pushToLive(data: any) {
    setLive([
      {
        type: "scripture",
        data,
      },
    ]);
  }
  return (
    <Stack p="4">
      <For each={previewItems}>
        {(item, index) =>
          item.type === "scripture" ? (
            <ScriptureDisplay
              scripture={item.data}
              onScriptureDoubleClick={() => pushToLive(item.data)}
            />
          ) : (
            ""
          )
        }
      </For>
    </Stack>
  );
}
