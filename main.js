const { app, BrowserWindow, ipcMain } = require("electron");

const createWindow = () => {
	const win1 = new BrowserWindow({
		title: "Crater Scripture Display",
		fullscreen: true,
		frame: false,
		closable: false,
		// skipTaskbar: true,
		transparent: true, // Allow transparency
		paintWhenInitiallyHidden: false,
		webPreferences: {
			contextIsolation: true,
			nodeIntegration: false,
			preload: `${__dirname}/preload.js`,
			backgroundThrottling: false,
		}
	});
	win1.setIgnoreMouseEvents(true);


	win1.loadURL(
		"http://localhost:3000/",
	);
	ipcMain.on("scripture-update", (event, verseData) => {
		if (win1 && win1.webContents) {
			win1.webContents.send("scripture-update", verseData)
		}
	})
	win1.on("page-title-updated", (e) => e.preventDefault());

	const win2 = new BrowserWindow({
		x: 1920,
		fullscreen: true,
		closable: false,
		title: "Crater Bible Project",
		webPreferences: {
			contextIsolation: true,
			nodeIntegration: false,
			preload: `${__dirname}/preload.js`,
		}
	});
	// file:///C:/Users/KINGSLEY/Documents/crater-start/dist/public/_build/assets/_build/assets/_...404_-C7TrDHPs.js
	win2.loadURL(
		// "file:///C:/Users/KINGSLEY/Documents/crater-react/build/controls.html",
		"http://localhost:3000/controls",
	);
	win2.on("page-title-updated", (e) => e.preventDefault());

	win2.webContents.on("did-fail-load", (e, code, desc) => {
		win2.webContents.reloadIgnoringCache();
	});
};

app.whenReady().then(() => {
	createWindow();

	app.on("activate", () => {
		if (BrowserWindow.getAllWindows().length === 0) createWindow();
	});
});

app.on("window-all-closed", () => {
	if (process.platform !== "darwin") app.quit();
});
