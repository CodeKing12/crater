const songsDB = require("./songs-db");

// Fetch all songs
const fetchAllSongs = () => {
  const response = songsDB
    .prepare(
      `
    SELECT id, title, author, copyright, created_at, updated_at
    FROM songs
    ORDER BY title ASC
    `,
    )
    .all();

  return response; // Returns an array of song objects
};

// Fetch the lyrics of a particular song by song ID
const fetchSongLyrics = (songId) => {
  const lyrics = songsDB
    .prepare(
      `
    SELECT label, lyrics, "order"
    FROM song_lyrics
    WHERE song_id = ?
    ORDER BY "order" ASC
    `,
    )
    .all(songId);

  return lyrics.map((lyric) => ({
    label: lyric.label,
    text: JSON.parse(lyric.lyrics),
  })); // Returns an array of { label, text } objects
};

// Update the lyrics and name of a particular song
const updateSong = (songId, newTitle, newLyrics) => {
  const updateSongTitle = songsDB.prepare(
    `
    UPDATE songs
    SET title = ?, updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
    `,
  );

  const deleteOldLyrics = songsDB.prepare(
    `
    DELETE FROM song_lyrics
    WHERE song_id = ?
    `,
  );

  const insertNewLyrics = songsDB.prepare(
    `
    INSERT INTO song_lyrics (song_id, label, lyrics, "order")
    VALUES (?, ?, ?, ?)
    `,
  );

  // Transaction to ensure atomic updates
  const transaction = songsDB.transaction(() => {
    // Update the song title
    updateSongTitle.run(newTitle, songId);

    // Remove old lyrics
    deleteOldLyrics.run(songId);

    // Insert new lyrics
    newLyrics.forEach((lyric, index) => {
      insertNewLyrics.run(
        songId,
        lyric.label,
        JSON.stringify(lyric.text),
        index + 1,
      );
    });
  });

  transaction();
  return { success: true, message: "Song updated successfully." };
};

// Filter songs by a phrase in their lyrics
const filterSongsByPhrase = (phrase) => {
  const response = songsDB
    .prepare(
      `
    SELECT DISTINCT s.id, s.title, s.author, s.copyright
    FROM songs s
    JOIN song_lyrics sl ON s.id = sl.song_id
    WHERE sl.lyrics LIKE ?
    ORDER BY s.title ASC
    `,
    )
    .all(`%${phrase}%`);

  return response; // Returns an array of song objects that match the phrase
};

module.exports = {
  fetchAllSongs,
  fetchSongLyrics,
  updateSong,
  filterSongsByPhrase,
};
