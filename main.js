// cloud_gaming_starter/main.js
const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const { exec } = require('child_process');
const os = require('os');

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  win.loadFile('index.html');
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

// Handle Sunshine Installer using local .exe file
ipcMain.handle('install-sunshine', async () => {
  return new Promise((resolve, reject) => {
    const platform = os.platform();

    if (platform === 'win32') {
      const installerPath = path.join(__dirname, 'sunshine-installer.exe');
      const command = `"${installerPath}" /S`; // /S = silent install for many installers

      exec(command, (error, stdout, stderr) => {
        if (error) reject(`Installation failed: ${stderr}`);
        else resolve(`Sunshine installed successfully.\n${stdout}`);
      });
    } else if (platform === 'linux') {
      const command = 'wget https://github.com/LizardByte/Sunshine/releases/latest/download/sunshine.deb && sudo dpkg -i sunshine.deb';
      exec(command, (error, stdout, stderr) => {
        if (error) reject(`Installation failed: ${stderr}`);
        else resolve(`Sunshine installed successfully.\n${stdout}`);
      });
    } else if (platform === 'darwin') {
      resolve('Sunshine is not officially supported on macOS.');
    } else {
      reject('Unsupported platform');
    }
  });
});

// Handle Moonlight Launcher with full path and input validation
ipcMain.handle('launch-game', async (_event, { serverIP, gameName }) => {
  return new Promise((resolve, reject) => {
    if (!serverIP || !gameName) {
      return reject('Server IP and Game Name are required.');
    }

    const moonlightPath = `"C:\\Program Files\\Moonlight Game Streaming\\Moonlight.exe"`;
    const command = `${moonlightPath} stream ${serverIP} "${gameName}"`;


    exec(command, (error, stdout, stderr) => {
      if (error) reject(`Moonlight error: ${stderr || error.message}`);
      else resolve(stdout);
    });
  });
});
