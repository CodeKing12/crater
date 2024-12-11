const {
  app,
  BrowserWindow,
  ipcMain,
  screen,
  desktopCapturer,
  session,
} = require("electron");
// const { load } = require("ffi-rs");

// // Load the NDI library
// const NDILib = load("Processing.NDI.Lib.x64", {
//   // Function definitions
//   NDIlib_initialize: { parameters: [], result: "bool" },
//   NDIlib_send_create: { parameters: ["pointer"], result: "pointer" },
//   NDIlib_send_destroy: { parameters: ["pointer"], result: "void" },
//   NDIlib_send_send_video_v2: {
//     parameters: ["pointer", "pointer"],
//     result: "void",
//   },
//   NDIlib_send_send_audio_v3: {
//     parameters: ["pointer", "pointer"],
//     result: "void",
//   },
// });

// // Define structs and helpers
// const { StructType, ref } = require("node-ffi-rs");

// // Define the video frame structure
// const NDIlib_video_frame_v2_t = StructType({
//   xres: "uint32",
//   yres: "uint32",
//   frame_rate_N: "uint32",
//   frame_rate_D: "uint32",
//   picture_aspect_ratio: "float",
//   data: "pointer",
//   timestamp: "int64",
// });

// // Define the sender configuration structure
// const NDIlib_send_create_t = StructType({
//   p_ndi_name: "pointer",
//   p_groups: "pointer",
//   clock_video: "bool",
//   clock_audio: "bool",
// });

// // Initialize the NDI library
// if (!NDILib.NDIlib_initialize()) {
//   console.error("NDI failed to initialize");
//   process.exit(1);
// }

// // Create the sender configuration
// const senderConfig = new NDIlib_send_create_t({
//   p_ndi_name: ref.allocCString("Electron Scripture Display"), // NDI sender name
//   p_groups: null, // No specific groups
//   clock_video: true, // Clock video frames
//   clock_audio: true, // Clock audio frames
// });

// // Create the sender
// const senderInstance = NDILib.NDIlib_send_create(senderConfig.ref());

// if (!senderInstance) {
//   console.error("Failed to create NDI sender");
//   process.exit(1);
// }

const createWindows = (screenWidth, screenHeight) => {
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
    },
  });
  win1.setIgnoreMouseEvents(true);

  win1.on("page-title-updated", (e) => e.preventDefault());
  //   win1.capturePage()

  win1.loadURL("http://localhost:3000/");
  // const width = 1920;
  // const height = 1080;

  // // Allocate memory for video frame buffer (RGBA)
  // const frameBuffer = Buffer.alloc(width * height * 4); // 4 bytes per pixel

  // // Fill the buffer with sample data (blue background)
  // frameBuffer.fill(0xff, 0); // Red channel
  // frameBuffer.fill(0x00, 1); // Green channel
  // frameBuffer.fill(0x00, 2); // Blue channel

  // // Create a video frame structure
  // const videoFrame = new NDIlib_video_frame_v2_t({
  //   xres: width,
  //   yres: height,
  //   frame_rate_N: 30000, // 30 fps numerator
  //   frame_rate_D: 1000, // 30 fps denominator
  //   picture_aspect_ratio: width / height,
  //   data: frameBuffer,
  //   timestamp: BigInt(Date.now() * 1000), // Timestamp in microseconds
  // });

  // // Send the video frame in a loop
  // setInterval(() => {
  //   NDILib.NDIlib_send_send_video_v2(senderInstance, videoFrame.ref());
  // }, 33); // ~30 fps

  // ipcMain.on("scripture-update", (event, verseData) => {
  // 	if (win1 && win1.webContents) {
  // 		win1.webContents.send("scripture-update", verseData)
  // 	}
  // })

  const win2 = new BrowserWindow({
    title: "Crater Bible Project",
    backgroundColor: "#18181b",
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      preload: `${__dirname}/preload.js`,
    },
    show: false,
  });
  // file:///C:/Users/KINGSLEY/Documents/crater-start/dist/public/_build/assets/_build/assets/_...404_-C7TrDHPs.js
  win2.loadURL(
    // "file:///C:/Users/KINGSLEY/Documents/crater-react/build/controls.html",
    "http://localhost:3000/controls",
  );
  win2.maximize();
  win2.show();
  win2.on("page-title-updated", (e) => e.preventDefault());

  win2.webContents.on("did-fail-load", (e, code, desc) => {
    win2.webContents.reloadIgnoringCache();
  });

  // session.defaultSession.setDisplayMediaRequestHandler(
  //   (request, callback) => {
  desktopCapturer.getSources({ types: ["screen"] }).then((sources) => {
    // Grant access to the first screen found.
    callback({ video: sources[0], audio: "loopback" });
  });
  // If true, use the system picker if available.
  // Note: this is currently experimental. If the system picker
  // is available, it will be used and the media request handler
  // will not be invoked.
  // },
  // { useSystemPicker: true },
  // );
};

app.whenReady().then(() => {
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;
  createWindows(width, height);

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
