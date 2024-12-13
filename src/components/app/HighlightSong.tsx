import { Box } from "@chakra-ui/react";
import { SongData } from "../../../interface";
import { CSSProperties } from "react";

interface Props extends SongData {
  style: CSSProperties;
  onClick: () => void;
}

const HighlightSong = ({ title, author, copyright, style, onClick }: Props) => {
  return (
    <Box
      fontSize="14px"
      pl="4"
      cursor="pointer"
      py="2"
      style={style}
      onClick={onClick}
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
