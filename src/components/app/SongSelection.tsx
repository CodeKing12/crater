import {
  Box,
  Flex,
  Grid,
  GridItem,
  Input,
  SimpleGrid,
  Table,
} from "@chakra-ui/react";
import SearchInput from "../ui/search-input";

export default function SongSelection() {
  return (
    <Flex h="full" pos="relative">
      <Box w="1/4" pos="absolute" left="0" h="full">
        <SearchInput />
      </Box>
      <Box w="3/4" h="full" pos="absolute" right="0">
        <Table.ScrollArea maxW="full" height="full">
          <Table.Root size="sm" variant="outline" stickyHeader showColumnBorder>
            <Table.Header>
              <Table.Row>
                <Table.ColumnHeader pl={4}>Title</Table.ColumnHeader>
                <Table.ColumnHeader pl={4}>Author</Table.ColumnHeader>
                <Table.ColumnHeader pl={4}>Copyright</Table.ColumnHeader>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {items.map((item) => (
                <Table.Row key={item.id}>
                  <Table.Cell pl={4}>{item.name}</Table.Cell>
                  <Table.Cell pl={4}>{item.category}</Table.Cell>
                  <Table.Cell pl={4}>{item.price}</Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Root>
        </Table.ScrollArea>
      </Box>
    </Flex>
  );
}

const items = [
  { id: 1, name: "Laptop", category: "Electronics", price: 999.99 },
  { id: 2, name: "Coffee Maker", category: "Home Appliances", price: 49.99 },
  { id: 3, name: "Desk Chair", category: "Furniture", price: 150.0 },
  { id: 4, name: "Smartphone", category: "Electronics", price: 799.99 },
  { id: 5, name: "Headphones", category: "Accessories", price: 199.99 },
];
