const { app, BrowserWindow } = require('electron');
const path = require('path');
const url = require('url');
const { spawn } = require('child_process');

let mainWindow;
let pythonProcess;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  mainWindow.loadURL(
    process.env.ELECTRON_START_URL ||
    url.format({
      pathname: path.join(__dirname, 'frontend/build/index.html'),
      protocol: 'file:',
      slashes: true,
    })
  );

  mainWindow.on('closed', function () {
    mainWindow = null;
  });
}

function startPythonBackend() {
  pythonProcess = spawn('python', ['backend/server.py']);

  pythonProcess.stdout.on('data', (data) => {
    console.log(`Python backend: ${data}`);
  });

  pythonProcess.stderr.on('data', (data) => {
    console.error(`Python backend error: ${data}`);
  });

  pythonProcess.on('close', (code) => {
    console.log(`Python backend process exited with code ${code}`);
  });
}

app.on('ready', () => {
  createWindow();
  startPythonBackend();
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', function () {
  if (mainWindow === null) {
    createWindow();
  }
});

app.on('will-quit', () => {
  if (pythonProcess) {
    pythonProcess.kill();
  }
});
