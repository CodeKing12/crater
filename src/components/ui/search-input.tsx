import { Input, InputProps } from "@chakra-ui/react";

export default function SearchInput(props: InputProps) {
  return (
    <Input
      variant="outline"
      borderWidth={2}
      borderColor="border.emphasized"
      rounded="none"
      px="2"
      h="9"
      outline="none"
      w="full"
      _selection={{
        bgColor: "#3A3A3A",
      }}
      {...props}
    />
  );
}
