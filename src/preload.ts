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
  auth: {
    login: (u: string, p: string) => ipcRenderer.invoke("auth:login", u, p),
    refresh: (refresh: string) => ipcRenderer.invoke("auth:refresh", refresh),
    logout: (refresh: string) => ipcRenderer.invoke("auth:logout", refresh),   
  },
  categories: {
    getAll: async() => await ipcRenderer.invoke("categories:getAll"),
    add: async(data: any) => await ipcRenderer.invoke("categories:add", data),
    delete: async(id: number) => await ipcRenderer.invoke("categories:delete", id),
    update: async(id: number, data: any) => await ipcRenderer.invoke("categories:update", id, data),
    getById: async(id: number) => await ipcRenderer.invoke("categories:getById", id),
  },
  couleurs: {
    getAll: async() => await ipcRenderer.invoke("couleurs:getAll"),
    add: async(data: any) => await ipcRenderer.invoke("couleurs:add", data),
    delete: async(id: number) => await ipcRenderer.invoke("couleurs:delete", id),
    update: async(id: number, data: any) => await ipcRenderer.invoke("couleurs:update", id, data),
    getById: async(id: number) => await ipcRenderer.invoke("couleurs:getById", id),
  },
  brands: {
    getAll: async() => await ipcRenderer.invoke("brands:getAll"),
    add: async(data: any) => await ipcRenderer.invoke("brands:add", data),
    delete: async(id: number) => await ipcRenderer.invoke("brands:delete", id),
    update: async(id: number, data: any) => await ipcRenderer.invoke("brands:update", id, data),
    getById: async(id: number) => await ipcRenderer.invoke("brands:getById", id),
  },
  taxes: {
    getAll: async () => {
      const taxes = await ipcRenderer.invoke("taxes:getAll");
      return taxes
    },
    add: async (data: any) => await ipcRenderer.invoke("taxes:add", data),
    delete: async (id: number) => await ipcRenderer.invoke("taxes:delete", id),
    update: async (id: number, data: any) => await ipcRenderer.invoke("taxes:update", id, data),
    getById: async (id: number) => await ipcRenderer.invoke("taxes:getById", id),
  },
  users: {
    getAll: async() => await ipcRenderer.invoke("users:getAll"),
    add: async(data: any) => await ipcRenderer.invoke("users:add", data),
    delete: async(id: number) => await ipcRenderer.invoke("users:delete", id),
    update: async(id: number, data: any) => await ipcRenderer.invoke("users:update", id, data),
    getById: async(id: number) => await ipcRenderer.invoke("users:getById", id),
    getUserByEmail: async(email: string) => await ipcRenderer.invoke("users:getUserByEmail", email),
    getUserByUsername: async(username: string) => await ipcRenderer.invoke("users:getUserByUsername", username),
  },
  clients: {
    getAll: async() => await ipcRenderer.invoke("clients:getAll"),
    add: async(data: any) => await ipcRenderer.invoke("clients:add", data),
    delete: async(id: number) => await ipcRenderer.invoke("clients:delete", id),
    update: async(id: number, data: any) => await ipcRenderer.invoke("clients:update", id, data),
    getById: async(id: number) => await ipcRenderer.invoke("clients:getById", id),
  },
  suppliers: {
    getAll: async() => await ipcRenderer.invoke("suppliers:getAll"),
    add: async(data: any) => await ipcRenderer.invoke("suppliers:add", data),
    delete:async(id: number) => await ipcRenderer.invoke("suppliers:delete", id),
    update: async(id: number, data: any) => await ipcRenderer.invoke("suppliers:update", id, data),
    getById: async(id: number) => await ipcRenderer.invoke("suppliers:getById", id),
  },
  products: {
    getAll: async() => await ipcRenderer.invoke("products:getAll"),
    add: async(data: any) => await ipcRenderer.invoke("products:add", data),
    delete: async(id: number) => await ipcRenderer.invoke("products:delete", id),
    update: async(id: number, data: any) =>await  ipcRenderer.invoke("products:update", id, data),
    getById: async(id: number) => await ipcRenderer.invoke("products:getById", id),
    getVariationsById: async(productId: number) => 
      await ipcRenderer.invoke("products:getVariationById", productId),
    getAllVariationsByProductId: async(productId: number) =>
      await ipcRenderer.invoke("products:getAllVariationsByProductId", productId),
    getAllCategoriesByProductId: async(productId: number) =>
      await ipcRenderer.invoke("products:getAllCategoriesByProductId", productId),
    getAllBrandsByProductId: async(productId: number) =>
      await ipcRenderer.invoke("products:getAllBrandsByProductId", productId),
    getAllTaxesByProductId: async(productId: number) =>
      await ipcRenderer.invoke("products:getAllTaxesByProductId", productId),
  },
  attributs: {
    getAll: async() => await ipcRenderer.invoke("attributs:getAll"),
    add: async(data: any) => await ipcRenderer.invoke("attributs:add", data),
    delete: async(id: number) => await ipcRenderer.invoke("attributs:delete", id),
    update: async(id: number, data: any) => await ipcRenderer.invoke("attributs:update", id, data),
    getById: async(id: number) => await ipcRenderer.invoke("attributs:getById", id),
    createAttributValue: async(attributId: number, value: string) => 
      await ipcRenderer.invoke("attributs:addValue", attributId, value),
    updateAttributValue: async(id: number, value: string) =>
      await ipcRenderer.invoke("attributs:updateValue", id, value),
    deleteAttributValue: async(id: number) =>
      await ipcRenderer.invoke("attributs:deleteValue", id),
    getAttributValuesByAttributId: async(attributId: number) => 
      await ipcRenderer.invoke("attributs:getValues", attributId),
  },

};

contextBridge.exposeInMainWorld('electron', renderer);

export type IRenderer = typeof renderer;