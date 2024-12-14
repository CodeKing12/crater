import { Box, Card, Heading } from "@chakra-ui/react";
import { CSSProperties, useEffect, useRef } from "react";
import { SetItemSize } from "./PreviewComponent";

interface ScriptureDisplayProps {
  index: number;
  scripture: {
    book: string;
    chapter: string;
    verse: string;
    version: string;
    text: string;
  };
  onScriptureClick?: () => void;
  onScriptureDoubleClick?: () => void;
  style: CSSProperties;
  setSize: SetItemSize;
  windowWidth: number;
  isCurrentNavig: boolean;
}

export default function ScriptureDisplay({
  index,
  scripture,
  onScriptureClick,
  onScriptureDoubleClick,
  style,
  setSize,
  windowWidth,
  isCurrentNavig,
}: ScriptureDisplayProps) {
  const rowRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setSize(index, rowRef.current?.getBoundingClientRect().height ?? 0);
  }, [setSize, index, windowWidth]);

  return (
    <Box
      userSelect="none"
      ref={rowRef}
      px="4"
      py={1}
      style={{ ...style, height: "unset" }}
    >
      <Card.Root
        size="sm"
        cursor="pointer"
        onClick={onScriptureClick}
        onDoubleClick={onScriptureDoubleClick}
        bgColor={isCurrentNavig ? "blue" : "bg.panel"}
      >
        <Card.Header>
          <Heading size="md" textTransform="capitalize">
            {scripture.book} {scripture.chapter}:{scripture.verse}
          </Heading>
        </Card.Header>
        <Card.Body color="fg.muted" fontFamily="body">
          {scripture.text}
        </Card.Body>
      </Card.Root>
    </Box>
  );
}
