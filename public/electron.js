const { app, BrowserWindow } = require('electron');
const { ipcMain } = require('electron');
const url = require('url');
const path = require('path');

function createMainWindow() {
    const mainWindow = new BrowserWindow({
        title: 'Pomodoro',
        width: 400,
        height: 300,
        frame: false,
        titleBarStyle: 'hidden',
        webPreferences: {
            preload: path.join(__dirname, 'preload.js')
        }
    });

    const startUrl = process.env.ELECTRON_START_URL || url.format({
        pathname: path.join(__dirname, '../build/index.html'), // connect to react app
        protocol: 'file:',
        slashes: true
    });

    mainWindow.setWindowButtonVisibility(false);
    mainWindow.setMenuBarVisibility(false);
    mainWindow.loadURL(startUrl) // load app to electron

    ipcMain.on('close-app', () => app.quit());
    ipcMain.on('minimize-app', () => {
        BrowserWindow.getFocusedWindow()?.minimize();
    });
}

app.whenReady().then(createMainWindow)