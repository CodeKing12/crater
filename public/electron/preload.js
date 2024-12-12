const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  fetchChapterCounts: () => ipcRenderer.invoke("fetch-chapter-counts"),
  fetchChapter: (info) => ipcRenderer.invoke("fetch-chapter", info),
  fetchScripture: (info) => ipcRenderer.invoke("fetch-scripture", info),
  sendVerseUpdate: (verseData) =>
    ipcRenderer.send("scripture-update", verseData),
  onScriptureUpdate: (callback) =>
    ipcRenderer.on("scripture-update", (_, data) => callback(data)),
});
