const bibleDB = require("./bible-db");

// Function to load books and chapters into memory
const fetchChapterCounts = () => {
  const result = {};

  // Query to get the maximum chapter number for each book
  const rows = bibleDB
    .prepare(
      `
      SELECT book_name, MAX(chapter) AS number_of_chapters
      FROM scriptures
      GROUP BY book_name
    `,
    )
    .all();

  // Build the result object with book_name as keys and number_of_chapters as values
  rows.forEach((row) => {
    result[row.book_name] = row.number_of_chapters;
  });

  // console.log(result);
  return result;
};

const fetchChapter = ({ book, chapter, version }) => {
  const response = bibleDB
    .prepare(
      `
      SELECT verse, text
      FROM scriptures
      WHERE book_name = ?
        AND chapter = ?
        AND version = ?
      ORDER BY verse ASC
    `,
    )
    .all(book, chapter, version);
  console.log(response.length);

  return response; // Returns an array of { verse, text }
};

const fetchScripture = ({ book, chapter, verse, version }) => {
  console.log("ARGS IN FETCHSCRIPTURE: ", book, chapter, verse, version);
  const response = bibleDB
    .prepare(
      `
      SELECT text
      FROM scriptures
      WHERE book_name = ?
        AND chapter = ?
        AND verse = ?
        AND version = ?
    `,
    )
    .get(book, chapter, verse, version);

  console.log("FETCH SCRIPTURE RESPONSE: ", response);
  return response; // Returns an array with a single object containing { text }
};

module.exports = {
  fetchChapterCounts,
  fetchChapter,
  fetchScripture,
};
