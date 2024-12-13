// seeder.js: Populate Songs Database
const db = require("../database/songs-db");
const fs = require("fs");
const path = require("path");

// Load JSON file with songs and lyrics
const jsonFilePath = path.resolve(__dirname, "../scripts/wsg-songs.json");
const songsData = JSON.parse(fs.readFileSync(jsonFilePath, "utf-8"));

// Prepare SQL statements
const insertSong = db.prepare(
  `INSERT INTO songs (title, author, copyright) VALUES (?, ?, ?)`,
);

const insertLyric = db.prepare(
  `INSERT INTO song_lyrics (song_id, label, lyrics, "order") VALUES (?, ?, ?, ?)`,
);

// Seed songs and lyrics
for (const [title, lyrics] of Object.entries(songsData)) {
  const author = ""; // Update as needed
  const copyright = ""; // Update as needed

  // Insert song into the database
  const result = insertSong.run(title, author, copyright);
  const songId = result.lastInsertRowid;

  // Insert lyrics for the song
  lyrics.forEach((lyric, index) => {
    insertLyric.run(songId, lyric.label, JSON.stringify(lyric.text), index + 1);
  });
}

console.log("Songs and lyrics seeded successfully!");
