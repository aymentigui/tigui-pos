// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts


import { contextBridge, ipcMain, ipcRenderer } from "electron";

const renderer = {
  closeApp: () => {
    ipcRenderer.send("close-app");
  },
  maximizeApp: () => {
    ipcRenderer.send("maximize-app");
  },
  minimizeApp: () => {
    ipcRenderer.send("minimize-app");
  },
  categories: {
    getAll: () => ipcRenderer.invoke("categories:getAll"),
    add: (data: any) => ipcRenderer.invoke("categories:add", data),
    delete: (id: number) => ipcRenderer.invoke("categories:delete", id),
    update: (id: number, data: any) => ipcRenderer.invoke("categories:update", id, data),
    getById: (id: number) => ipcRenderer.invoke("categories:getById", id),
  },
  brands: {
    getAll: () => ipcRenderer.invoke("brands:getAll"),
    add: (data: any) => ipcRenderer.invoke("brands:add", data),
    delete: (id: number) => ipcRenderer.invoke("brands:delete", id),
    update: (id: number, data: any) => ipcRenderer.invoke("brands:update", id, data),
    getById: (id: number) => ipcRenderer.invoke("brands:getById", id),
  },
};

contextBridge.exposeInMainWorld('electron', renderer);

export type IRenderer = typeof renderer;