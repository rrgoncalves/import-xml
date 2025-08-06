import { app, BrowserWindow, Tray, Menu, ipcMain, dialog } from 'electron';
import * as path from 'path';
import { autoUpdater } from 'electron-updater';
import * as fs from 'fs';

class MainApp {
  private win: BrowserWindow | null = null;
  private tray: Tray | null = null;
  private isQuiting = false;

  constructor() {
    app.on('ready', this.onReady);
    app.on('window-all-closed', this.onAllClosed);
    app.on('activate', this.onActivate);
    app.on('before-quit', () => { this.isQuiting = true; });
    ipcMain.handle('select-directory', async () => {
      const result = await dialog.showOpenDialog({ properties: ['openDirectory'] });
      return result.filePaths[0] || '';
    });
    ipcMain.on('close-window', () => {
      if (this.win) this.win.hide();
    });
    ipcMain.on('save-form-data', (event, data) => {
      const filePath = path.join(process.cwd(), '.config', 'form-data.json');
      fs.mkdirSync(path.dirname(filePath), { recursive: true });
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
    });
    ipcMain.handle('load-form-data', () => {
      const filePath = path.join(process.cwd(), '.config', 'form-data.json');
      if (fs.existsSync(filePath)) {
        return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
      }
      return null;
    });
    autoUpdater.on('update-downloaded', () => {
      autoUpdater.quitAndInstall();
    });
  }

  private onReady = async () => {
    this.createWindow();
    this.createTray();
    // Verifica atualizações no Windows e AppImage (Linux)
    if (process.platform === 'win32' || process.env.APPIMAGE) {
      autoUpdater.forceDevUpdateConfig = true;
      await autoUpdater.checkForUpdatesAndNotify();
    } else {
      console.log('Auto-update desabilitado: plataforma não suportada.');
    }
  };

  private createWindow() {
    this.win = new BrowserWindow({
      width: 700,
      height: 450,
      webPreferences: {
        preload: path.join(__dirname, 'preload.js'),
        nodeIntegration: false,
        contextIsolation: true
      }
    });
    this.win.loadFile(path.join(__dirname, 'index.html'));
    this.win.on('close', (event) => {
      if (!this.isQuiting) {
        event.preventDefault();
        this.win?.hide();
      }
    });
  }

  private createTray() {
    this.tray = new Tray(path.join(__dirname, './assets/icon.png'));
    const contextMenu = Menu.buildFromTemplate([
      { label: 'Mostrar', click: () => this.win?.show() },
      { label: 'Esconder', click: () => this.win?.hide() },
      { label: 'Encerrar', click: () => { this.isQuiting = true; app.quit(); } }
    ]);
    this.tray.setToolTip('MaterialApp');
    this.tray.setContextMenu(contextMenu);
    this.tray.on('click', () => this.win?.show());
  }

  private onAllClosed = () => {};
  private onActivate = () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      this.createWindow();
    }
  };
}

app.commandLine.appendSwitch('disable-features', 'GTKTheme');
app.disableHardwareAcceleration();

new MainApp();
