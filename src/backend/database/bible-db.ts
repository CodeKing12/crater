// Bible Database Initialization for SQLite
import Database from "better-sqlite3";
// import { fileURLToPath } from 'url'
import { join as pathJoin } from "path";
// import { app } from 'electron'
// import electronIsDev from 'electron-is-dev'
import { DB_PATH } from "../constants.js";

// const __dirname = dirname(fileURLToPath(import.meta.url))
// const dbPath = resolve(__dirname, 'bibles.sqlite')
// const interMediaries = electronIsDev ? 'backend/database' : ''
const dbPath = pathJoin(DB_PATH, "bibles.sqlite");
const db = new Database(dbPath);

export const scripturesFtsTableName = "scriptures_fts5";

// Create Tables
db.prepare(
	`
CREATE TABLE IF NOT EXISTS bibles (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    version TEXT UNIQUE NOT NULL,
    description TEXT
)`,
).run();

db.prepare(
	`
CREATE TABLE IF NOT EXISTS books (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    book_name TEXT UNIQUE NOT NULL
)`,
).run();

db.prepare(
	`
CREATE TABLE IF NOT EXISTS scriptures (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    bible_id INTEGER NOT NULL,
    book_id INTEGER NOT NULL,
    book_name TEXT NOT NULL,
    version TEXT NOT NULL,
    chapter INTEGER NOT NULL,
    verse TEXT NOT NULL,
    text TEXT NOT NULL,
    UNIQUE(bible_id, book_id, chapter, verse),
    FOREIGN KEY (bible_id) REFERENCES bibles (id) ON DELETE CASCADE,
    FOREIGN KEY (book_id) REFERENCES books (id) ON DELETE CASCADE
)`,
).run();

db.prepare(
	`CREATE INDEX IF NOT EXISTS idx_scriptures_book_chapter_version 
  ON scriptures (book_name, chapter, version);`,
);

db.prepare(
	`CREATE INDEX IF NOT EXISTS idx_scriptures_book_chapter_verse_version 
  ON scriptures (book_name, chapter, verse, version);`,
);

// Create FTS5 virtual table with trigram tokenizer for fuzzy scripture search
// Using a standalone FTS5 table (not external content) for reliability
db.exec(`
  CREATE VIRTUAL TABLE IF NOT EXISTS ${scripturesFtsTableName} USING fts5(
    scripture_id,
    book_name,
    text,
    version,
    tokenize='trigram'
  );
`);

// Function to rebuild the scripture FTS5 index
export const rebuildScriptureFtsIndex = () => {
	console.log("Rebuilding scripture FTS5 index...");

	// Drop and recreate for clean rebuild
	db.exec(`DROP TABLE IF EXISTS ${scripturesFtsTableName}`);
	db.exec(`
		CREATE VIRTUAL TABLE ${scripturesFtsTableName} USING fts5(
			scripture_id,
			book_name,
			text,
			version,
			tokenize='trigram'
		);
	`);

	// Populate from scriptures table
	db.exec(`
		INSERT INTO ${scripturesFtsTableName}(scripture_id, book_name, text, version)
		SELECT id, book_name, text, version FROM scriptures;
	`);

	const count = db
		.prepare(`SELECT COUNT(*) as count FROM ${scripturesFtsTableName}`)
		.get() as { count: number };
	console.log(`Scripture FTS5 index rebuilt with ${count.count} entries!`);
};

// Check if FTS index is populated
export const isScriptureFtsIndexEmpty = (): boolean => {
	const count = db
		.prepare(`SELECT COUNT(*) as count FROM ${scripturesFtsTableName}`)
		.get() as { count: number };
	console.log(`Scripture FTS index count: ${count.count}`);
	return count.count === 0;
};

// Initialize FTS index if empty (call on app startup)
export const initializeScriptureFtsIndexIfEmpty = () => {
	const scripturesCount = (
		db.prepare(`SELECT COUNT(*) as count FROM scriptures`).get() as {
			count: number;
		}
	).count;
	console.log(
		`Scriptures count: ${scripturesCount}, FTS empty: ${isScriptureFtsIndexEmpty()}`,
	);
	if (scripturesCount > 0 && isScriptureFtsIndexEmpty()) {
		console.log("Scripture FTS index is empty, rebuilding...");
		rebuildScriptureFtsIndex();
	} else {
		console.log("Scripture FTS index already populated or no scriptures.");
	}
};

// Search scriptures using FTS5 trigram
export const searchScriptures = (query: string, version?: string): any[] => {
	const trimmedQuery = query.trim();
	if (!trimmedQuery) return [];

	console.log("SEARCHING SCRIPTURES: ", trimmedQuery, version);

	// Trigram requires at least 3 characters for effective matching
	if (trimmedQuery.length < 3) {
		console.log("Query too short for trigram search (need 3+ chars)");
		return [];
	}

	const escapedQuery = trimmedQuery.replace(/"/g, '""');

	// Query uses scripture_id stored in FTS table to join with scriptures
	let sql = `
    SELECT s.id as scripture_id, s.bible_id, s.book_id, s.book_name, 
           s.chapter, s.verse, s.text, s.version
    FROM ${scripturesFtsTableName} fts
    JOIN scriptures s ON CAST(fts.scripture_id AS INTEGER) = s.id
    WHERE ${scripturesFtsTableName} MATCH '"${escapedQuery}"'
  `;

	if (version) {
		sql += ` AND fts.version = ?`;
	}

	sql += ` ORDER BY rank LIMIT 100`;

	try {
		const response = version
			? db.prepare(sql).all(version)
			: db.prepare(sql).all();

		console.log("SCRIPTURE SEARCH RESPONSE: ", response.length, "results");
		return response;
	} catch (error) {
		console.error("Scripture search error:", error);
		return [];
	}
};

// console.log("Scripture Database initialized successfully!");
export default db;
