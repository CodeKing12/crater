import { Box } from "@chakra-ui/react";
import { SongData } from "../../../interface";
import { CSSProperties, useEffect } from "react";

interface Props extends SongData {
  renderIndex: number;
  style: CSSProperties;
  navigatedSong: number;
  onClick: () => void;
}

const HighlightSong = ({
  renderIndex,
  navigatedSong,
  title,
  author,
  copyright,
  style,
  onClick,
}: Props) => {
  useEffect(() => {
    console.log("DEBUG SONGS: ", renderIndex, navigatedSong);
  }, [renderIndex, navigatedSong]);

  return (
    <Box
      userSelect="none"
      fontSize="14px"
      pl="4"
      cursor="pointer"
      py="2"
      style={style}
      onClick={onClick}
      bgColor={renderIndex === navigatedSong ? "#1E90FF" : ""}
      data-song={`song-${renderIndex}`}
    >
      <Box>{title}</Box>
      <Box>{author}</Box>
      <Box>{copyright}</Box>
    </Box>
    // <Table.Row style={style}>
    //   <Table.Cell pl={4}>{title}</Table.Cell>
    //   <Table.Cell pl={4}>{author}</Table.Cell>
    //   <Table.Cell pl={4}>{copyright}</Table.Cell>
    // </Table.Row>
  );
};

// const HighlightSongMemo = memo(HighlightSong);
export default HighlightSong;
