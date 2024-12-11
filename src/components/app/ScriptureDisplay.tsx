import { Card, Heading } from "@chakra-ui/react";

interface ScriptureDisplayProps {
  scripture: {
    book: string;
    chapter: string;
    verse: string;
    version: string;
    text: string;
  };
  onScriptureClick?: () => void;
  onScriptureDoubleClick?: () => void;
}

export default function ScriptureDisplay({
  scripture,
  onScriptureClick,
  onScriptureDoubleClick,
}: ScriptureDisplayProps) {
  return (
    <Card.Root
      size="sm"
      cursor="pointer"
      onClick={onScriptureClick}
      onDoubleClick={onScriptureDoubleClick}
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
  );
}
