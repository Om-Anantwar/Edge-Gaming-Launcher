const { contextBridge, ipcRenderer } = require('electron');
contextBridge.exposeInMainWorld('electronAPI', {
  installSunshine: () => ipcRenderer.invoke('install-sunshine'),
  launchGame: (serverIP, gameName) => ipcRenderer.invoke('launch-game', { serverIP, gameName })
});
