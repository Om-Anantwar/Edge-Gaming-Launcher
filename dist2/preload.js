const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  launchGame: (serverIP, gameName) =>
    ipcRenderer.invoke('launch-game', { serverIP, gameName })
});
