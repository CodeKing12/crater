import { Box, Flex } from "@chakra-ui/react";
import SearchInput from "../ui/search-input";
import HighlightSong from "./HighlightSong";
import { useCallback, useEffect, useState } from "react";
import { SongData } from "../../../interface";
import { FixedSizeList } from "react-window";
import { UpdateDisplayProps } from "./ControlsMain";
import { useAppInfo } from "@/providers/AppInfo";

type Props = UpdateDisplayProps;

export const SongSelection = ({ setPreview, setLive }: Props) => {
  const [allSongs, setAllSongs] = useState<SongData[]>([]);
  const [navigatedSong, setNavigatedSong] = useState<number>(0); // New state for navigated verse
  const { panelFocus } = useAppInfo();

  useEffect(() => {
    window.electronAPI.fetchAllSongs().then((result) => setAllSongs(result));
  }, []);

  const updateLiveSong = useCallback(
    async (songIndex: number, goLive: boolean = true) => {
      const songId = allSongs[songIndex]?.id;
      window.electronAPI.fetchSongLyrics(songId).then((data) => {
        setPreview({
          type: "song",
          data,
          index: 0,
        });
        if (goLive) {
          setLive({
            type: "song",
            data,
            index: 0,
          });
        }
      });
    },
    [allSongs, setLive, setPreview],
  );

  useEffect(() => {
    console.log("Navigated Song: ", navigatedSong);
    updateLiveSong(navigatedSong, false);
  }, [navigatedSong, updateLiveSong]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (panelFocus !== "songs") return;

      if (e.key === "ArrowDown") {
        // Navigate to the next verse
        const navigNext = navigatedSong + 1;
        if (navigNext <= allSongs.length) {
          setNavigatedSong(navigNext);
        }
      } else if (e.key === "ArrowUp") {
        // Navigate to the previous verse
        const navigPrev = navigatedSong - 1;
        if (navigPrev > 0) {
          setNavigatedSong(navigPrev);
        }
      } else if (e.key === "Enter") {
        // Confirm and highlight the current verse on Enter
        if (navigatedSong) {
          console.log(navigatedSong);
          updateLiveSong(navigatedSong);
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigatedSong, allSongs, panelFocus, setNavigatedSong, updateLiveSong]); // changeScripture, channel, sendVerseToHomePage

  return (
    <Flex h="full" pos="relative">
      <Box
        w="1/4"
        pos="absolute"
        left="0"
        h="full"
        border="1px solid"
        borderColor="gray.700"
      >
        <SearchInput />
      </Box>
      <Box
        w="3/4"
        h="full"
        pos="absolute"
        right="0"
        border="1px solid"
        borderColor="gray.700"
      >
        <FixedSizeList
          itemCount={allSongs.length}
          itemSize={30}
          width="100%"
          height={214}
        >
          {({ index, style }) => (
            <HighlightSong
              {...allSongs[index]}
              style={style}
              onClick={() => updateLiveSong(index)}
            />
          )}
        </FixedSizeList>
        {/* <Table.ScrollArea maxW="full" height="full">
          <Table.Root size="sm" variant="outline" stickyHeader showColumnBorder>
            <Table.Header>
              <Table.Row>
                <Table.ColumnHeader pl={4}>Title</Table.ColumnHeader>
                <Table.ColumnHeader pl={4}>Author</Table.ColumnHeader>
                <Table.ColumnHeader pl={4}>Copyright</Table.ColumnHeader>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {/* {allSongs.map((song) => (
                <HighlightSong key={song.id} {...song} />
              ))} *}
            </Table.Body>
          </Table.Root>
        </Table.ScrollArea> */}
      </Box>
    </Flex>
  );
};

export default SongSelection;
