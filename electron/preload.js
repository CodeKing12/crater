const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  fetchChapterCounts: () => ipcRenderer.invoke("fetch-chapter-counts"),
  fetchChapter: (info) => ipcRenderer.invoke("fetch-chapter", info),
  fetchScripture: (info) => ipcRenderer.invoke("fetch-scripture", info),

  fetchAllSongs: () => ipcRenderer.invoke("fetch-songs"),
  fetchSongLyrics: (songId) => ipcRenderer.invoke("fetch-lyrics", songId),
  updateSong: (newInfo) => ipcRenderer.invoke("update-song", newInfo),
  filterSongsByPhrase: (phrase) => ipcRenderer.invoke("filter-songs", phrase),

  sendVerseUpdate: (verseData) =>
    ipcRenderer.send("scripture-update", verseData),
  onScriptureUpdate: (callback) =>
    ipcRenderer.on("scripture-update", (_, data) => callback(data)),
});
