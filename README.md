# Church Projection Software

A modern church projection software built using **Electron** and **Next.js**, designed to display scriptures, lyrics, and other media seamlessly. This software is optimized for OBS Studio integration and is easy to use for church media teams.  



---  



## Features

- 📖 **Scripture Display**: Dynamically show Bible verses in fullscreen mode.

- 🎥 **OBS Studio Integration**: Compatible with OBS Studio for live streaming and recording.

- 💻 **Customizable Display**: Transparent window for overlaying scripture on other media.

- ⚙️ **Efficient Communication**: Update scriptures in real-time via a control panel.

- 🛠️ **Cross-Platform**: Runs on Windows, macOS, and Linux.

- 🚀 **Always On Top**: Ensures the projection stays visible over other applications.

- 🔒 **Electron Security**: Context isolation and preload scripts for secure communication.

  

---



## Requirements

-  **Node.js** (v16 or later)

-  **npm** or **yarn**

- OBS Studio (for live streaming integration)

  

---  

## Installation

1. Clone the repository:

```bash

git clone https://github.com/CodeKing12/crater.git

```

2. Navigate to the project folder:

```bash

cd church-projection-software

```

3. Install dependencies:

```bash

npm install

```

4. Build the Next.js frontend:

```bash

npm run build

```

5. Start the Electron app:

```bash

npm run electron

```



---  

## Usage

### 1. **Start the Application**

- Run the app using the `npm run electron` command.

- The main display window will open in fullscreen mode.


### 2. **Control Scripture Display**

- Use the control panel to select and update scriptures.

- Updates will reflect in real-time on the main display.


### 3. **OBS Studio Integration**

- Add a **Window Capture** source in OBS Studio.

- Select the projection window from the available options.



---  

## Project Structure

```

church-projection-software/

├── main.js # Electron main process file

├── preload.js # Preload script for secure communication

├── src/ # Next.js app for the control and display UI

│ ├── app/ # Next.js pages

│ ├── components/ # React components

│ ├── bibles/ # Bible data in JSON format

│ └── utils/ # Helper functions and types

├── package.json # Project dependencies and scripts

└── README.md # Project documentation

```



---

## Scripts

-  **`npm run dev`**: Start the Next.js app in development mode.

-  **`npm run build`**: Build the Next.js app for production.

-  **`npm run start`**: Start the Next.js app in production.

-  **`npm run electron`**: Start the Electron app.



---  

## Technical Details

### Electron Configuration

-  **`backgroundThrottling: false`** ensures that the scripture display updates even when the window is not focused.

-  **`alwaysOnTop: true`** keeps the projection window on top of other applications.


### Next.js Communication

-  **BroadcastChannel API**: Synchronizes scripture updates between control and display windows.

-  **Electron IPC**: Enables secure communication between the Electron main process and renderer.
  


---

## Contributing

Contributions are welcome! Please open an issue or submit a pull request to suggest features or fix bugs.

  

---

## License

This project is licensed under the [MIT License](LICENSE).



---  

## Acknowledgments

- Inspired by software like **EasyWorship** and **ProPresenter**.

- Built with ❤️ for modern church services.

 