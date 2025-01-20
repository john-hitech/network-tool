const path = require("path");
const { spawn } = require("child_process");
const { app, BrowserWindow } = require("electron");

let backendProcess;

const createWindow = () => {
  const win = new BrowserWindow({
    width: 1000,
    height: 800,
    // resizable: false,
    webPreferences: {
      nodeIntegration: true,
    },
  });

  win.loadFile(path.join(__dirname, "dist", "index.html"));
};

app.whenReady().then(() => {
  let backendPath;
  if (app.isPackaged) {
    console.log("Running in production mode");
    backendPath = path.join(process.resourcesPath, "main");
  } else {
    console.log("Running in development mode");
    backendPath = path.join(__dirname, "resources/main");
  }
  console.log("BACKEND:", backendPath);
  backendProcess = spawn(backendPath, [], { stdio: "inherit" });
  createWindow();
});

app.on("will-quit", () => {
  if (backendProcess) {
    backendProcess.kill();
  }
});
