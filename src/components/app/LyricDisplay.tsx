import { Box, Card, Heading } from "@chakra-ui/react";
import { SongLyric } from "../../../interface";
import { CSSProperties, useEffect, useRef } from "react";
import { SetItemSize } from "./PreviewComponent";

interface LyricDisplayProps {
  index: number;
  lyric: SongLyric;
  onLyricClick?: () => void;
  onLyricDoubleClick?: () => void;
  style: CSSProperties;
  setSize: SetItemSize;
  windowWidth: number;
  isCurrentNavig: boolean;
}

export default function LyricDisplay({
  index,
  lyric,
  onLyricClick,
  onLyricDoubleClick,
  style,
  setSize,
  windowWidth,
  isCurrentNavig,
}: LyricDisplayProps) {
  const rowRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setSize(index, rowRef.current?.getBoundingClientRect().height ?? 0);
  }, [setSize, index, windowWidth]);

  return (
    <Box
      userSelect="none"
      px="4"
      py={1}
      ref={rowRef}
      style={{ ...style, height: "unset" }}
    >
      <Card.Root
        size="sm"
        cursor="pointer"
        onClick={onLyricClick}
        onDoubleClick={onLyricDoubleClick}
        bgColor={isCurrentNavig ? "blue" : "bg.panel"}
      >
        <Card.Header>
          <Heading size="md" textTransform="capitalize">
            {lyric.label}
          </Heading>
        </Card.Header>
        <Card.Body color="fg.muted" fontFamily="body">
          {lyric?.text.map((line, index) => <p key={index}>{line}</p>)}
        </Card.Body>
      </Card.Root>
    </Box>
  );
}
