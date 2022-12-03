const electron = require('electron')
const { app, BrowserWindow, ipcMain, screen } = electron

let mainWindow;
let productWindow;

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

  productWindow.loadFile('windows/product.html')
  productWindow.webContents.on('did-finish-load', () => {
    mainWindow.hide()
  })

  productWindow.on('close', () => {
    mainWindow.show()
  })
}