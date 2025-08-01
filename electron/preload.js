import { contextBridge } from 'electron';

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  // You can add more APIs here as needed
  getVersion: () => process.versions.electron,
  getPlatform: () => process.platform,

  // Check if we're in Electron environment
  isElectron: true,

  // Example: Send messages to main process
  // sendMessage: (message) => ipcRenderer.invoke('send-message', message),

  // Example: Listen for messages from main process
  // onMessage: (callback) => ipcRenderer.on('message', callback)
});

// Security: Remove node integration
delete window.require;
delete window.exports;
delete window.module;
