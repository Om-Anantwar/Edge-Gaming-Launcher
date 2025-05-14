const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const { exec } = require('child_process');

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
  win.webContents.openDevTools(); // Optional: shows developer tools
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
