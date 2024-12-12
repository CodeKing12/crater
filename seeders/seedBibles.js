// seedBible.js: Seed Bible Data into the SQLite Database
const db = require("../database/bible-db");
const fs = require("fs");
const path = require("path");

const biblesDir = path.join(__dirname, "../bibles"); // Folder containing JSON files for each Bible version

// Insert Bible Versions
const insertBible = db.prepare(
  `INSERT OR IGNORE INTO bibles (version, description) VALUES (?, ?)`,
);

// Insert Books
const insertBook = db.prepare(
  `INSERT OR IGNORE INTO books (book_name) VALUES (?)`,
);

// Insert Scriptures
const insertScripture = db.prepare(`
    INSERT OR IGNORE INTO scriptures (bible_id, book_id, book_name, version, chapter, verse, text)
    VALUES (?, ?, ?, ?, ?, ?, ?)
`);

fs.readdirSync(biblesDir).forEach((file) => {
  const filePath = path.join(biblesDir, file);
  if (path.extname(file) === ".json") {
    const bibleData = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    const { version, description, books } = bibleData;

    // Insert Bible Version
    const bibleInfo = insertBible.run(version, description);
    const bibleId = db
      .prepare(`SELECT id FROM bibles WHERE version = ?`)
      .get(version).id;
    const bookNames = Object.keys(books);

    bookNames.forEach((bookName) => {
      const chapters = books[bookName];
      // console.log(version, bookName, chapters);

      // Insert Book
      insertBook.run(bookName);
      const bookId = db
        .prepare(`SELECT id FROM books WHERE book_name = ?`)
        .get(bookName).id;

      // Insert Chapters and Verses
      Object.entries(chapters).forEach(([chapterNumber, verses]) => {
        // Convert chapterNumber to an integer
        const chapterNum = parseInt(chapterNumber, 10);

        // Insert verses for each chapter
        Object.entries(verses).forEach(([verseNumber, verseText]) => {
          // console.log(verseNumber, verseText, chapterNumber);
          // Convert verseNumber to an integer
          const verseNum = parseInt(verseNumber, 10);
          insertScripture.run(
            bibleId,
            bookId,
            bookName,
            version,
            chapterNum,
            verseNum,
            verseText,
          );
        });
      });
    });

    console.log(`Seeded Bible version: ${version}`);
  }
});

console.log("Bible data seeding completed successfully!");

// Update Bible Extractor.py to add all chapters to the "chapters" key, so that we can have metadata for each book
