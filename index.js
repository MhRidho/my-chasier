const electron = require('electron')
const db = require('./config/database/db_config')
const { app, BrowserWindow, ipcMain, screen, webContents, dialog } = electron
const remote = require('@electron/remote/main')
const fs = require('fs')
const path = require('path')
const url = require('url')
const md5 = require('md5')
remote.initialize()

let mainWindow;
let productWindow;
let editDataModal;

mainWin = () => {
  mainWindow = new BrowserWindow({
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    },
    autoHideMenuBar: true,
    height: 550,
    resizable: false,
    title: 'Cashier App 1.0',
  })

  mainWindow.loadFile('index.html')
  db.serialize(() => {
    console.log('DB Connected')
  })
}

app.on('ready', () => {
  mainWin()
})

ipcMain.on('load:product-window', () => {
  productWin()
})

productWin = () => {
  const { width, height } = screen.getPrimaryDisplay().workAreaSize

  productWindow = new BrowserWindow({
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    },
    autoHideMenuBar: true,
    width: width,
    height: height,
    title: 'My Chasier | Data Produk'
  })

  remote.enable(productWindow.webContents)

  productWindow.loadFile('windows/product.html')
  productWindow.webContents.on('did-finish-load', () => {
    mainWindow.hide()
  })

  productWindow.on('close', () => {
    mainWindow.show()
  })
}

editData = (docId, modalForm, modalWidth, modalHeight, rowId) => {
  let parentWin
  switch (docId) {
    case 'product-data':
      parentWin = productWindow
      break;
  }
  editDataModal = new BrowserWindow({
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    },
    width: modalWidth,
    height: modalHeight,
    resizable: false,
    maximizable: false,
    minimizable: false,
    parent: parentWin,
    modal: true,
    title: 'Edit Data',
    autoHideMenuBar: true
  })
  remote.enable(editDataModal.webContents)
  editDataModal.loadFile('modals/edit-data.html')
  editDataModal.webContents.on('did-finish-load', () => {
    editDataModal.webContents.send('res:form', docId, modalForm, rowId)
  })
  editDataModal.on('close', () => {
    editDataModal = null
  })
}

ipcMain.on('load:edit', (event, msgDocId, msgForm, msgWidth, msgHeight, msgRowId) => {
  editData(msgDocId, msgForm, msgWidth, msgHeight, msgRowId)
})

ipcMain.on('update:success', (e, msgDocId) => {
  switch (msgDocId) {
    case 'product-data':
      productWindow.webContents.send('update:success', 'Successfully updates product data')
  }
  editDataModal.close()
})

writeCsv = (path, content) => {
  fs.write(path, content, err => {
    if (err) throw err
    dialog.showMessageBoxSync({
      title: 'Alert',
      type: 'Info',
      message: 'csv file created'
    })
  })
}

ipcMain.on('write:csv', (e, msgPath, msgContent) => {
  writeCsv(msgPath, msgContent)
})