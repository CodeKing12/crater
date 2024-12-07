import { BookInfo } from "./types";

// export const fetchBibleData = async () => {
//     const response = await fetch('./bibles/bible_data.json');
//     const data = await response.json();
//     return data;
// };

export function getName(book?: BookInfo) {
    return book?.name?.toLowerCase() ?? ""
}