const { contextBridge, ipcRenderer } = require("electron")

contextBridge.exposeInMainWorld("electronAPI", {
    sendVerseUpdate: (verseData) => ipcRenderer.send("scripture-update", verseData),
    onScriptureUpdate: (callback) => ipcRenderer.on("scripture-update", (_, data) => callback(data))
})