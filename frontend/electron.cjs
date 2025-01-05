const path = require("path");
const { spawn } = require("child_process");
const { app, BrowserWindow } = require("electron");

let backendProcess;

const createWindow = () => {
  const win = new BrowserWindow({
    width: 1000,
    height: 600,
    resizable: false,
  });

  win.loadFile(path.join(__dirname, "dist", "index.html"));
};

app.whenReady().then(() => {
  // const backendPath = path.join(__dirname, "resources/main");
  // backendProcess = spawn(backendPath, [], { stdio: "inherit" });
  createWindow();
});

// app.on("will-quit", () => {
//   if (backendProcess) {
//     backendProcess.kill();
//   }
// });
