import { AppLogger } from "./core/app-logger";
import { FormDataDto } from "./dto/form-data.dto";
import { XmlFileReader } from "./xml/xml-file-reader";
// eslint-disable-next-line import/no-extraneous-dependencies
import { app, BrowserWindow, Tray, Menu, ipcMain, dialog } from "electron";
import { autoUpdater } from "electron-updater";
import fg from "fast-glob";
import * as fs from "fs";
import * as path from "path";

class MainApp {
  private win: BrowserWindow;

  private tray: Tray;

  private isQuiting = false;

  constructor() {
    app.on("ready", this.onReady);
    app.on("window-all-closed", this.onAllClosed);
    app.on("activate", this.onActivate);
    app.on("before-quit", () => {
      this.isQuiting = true;
    });
    ipcMain.handle("select-directory", async () => {
      const result = await dialog.showOpenDialog({
        properties: ["openDirectory"],
      });
      return result.filePaths[0] || "";
    });

    ipcMain.on("close-window", () => {
      if (this.win) this.win.hide();
    });

    ipcMain.on("save-form-data", (event, data) => {
      const filePath = path.join(process.cwd(), ".config", "form-data.json");
      fs.mkdirSync(path.dirname(filePath), { recursive: true });
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
    });

    ipcMain.handle("load-form-data", () => {
      return MainApp.getFormData();
      // if (formData?.directory) {
      //   const watcher = chokidar.watch(formData.directory, {
      //     ignoreInitial: true,
      //     ignored: (file) => file.endsWith(".xml"),
      //   });
      //   watcher
      //     .on("add", (path) => console.log(`Arquivo adicionado: ${path}`))
      //     .on("unlink", (path) => console.log(`Arquivo removido: ${path}`))
      //     .on("change", (path) => console.log(`Arquivo alterado: ${path}`));

      //   return formData;
      // }
      // return null;
    });

    autoUpdater.on("update-downloaded", () => {
      autoUpdater.quitAndInstall();
    });
  }

  private static getFormData(): FormDataDto {
    const filePath = path.join(process.cwd(), ".config", "form-data.json");
    if (fs.existsSync(filePath)) {
      return JSON.parse(fs.readFileSync(filePath, "utf-8")) as FormDataDto;
    }
    return undefined;
  }

  private startDirectoryTimer() {
    const readAndLogFiles = async () => {
      const formData = MainApp.getFormData();
      if (fs.existsSync(formData?.directory)) {
        if (formData.directory && fs.existsSync(formData.directory)) {
          const files = fg.sync(["*"], {
            cwd: formData.directory,
            onlyFiles: true,
          });

          const xmlUtils = new XmlFileReader();
          for await (const file of files) {
            await xmlUtils.upload(file);
          }

          AppLogger.info(
            `[TIMER] Arquivos encontrados em ${formData.directory}:`,
            files.toString()
          );
        } else {
          console.log("[TIMER] Diretório não definido ou não existe.");
        }
      } else {
        console.log("[TIMER] FormData não encontrado.");
      }
    };
    // Executa imediatamente e a cada 5 minutos
    readAndLogFiles();
    setInterval(readAndLogFiles, 5 * 60 * 1000);
  }

  private onReady = async () => {
    this.createWindow();
    this.createTray();
    this.startDirectoryTimer();
    // Verifica atualizações no Windows e AppImage (Linux)
    if (process.platform === "win32" || process.env.APPIMAGE) {
      autoUpdater.forceDevUpdateConfig = true;
      await autoUpdater.checkForUpdatesAndNotify();
    } else {
      console.log("Auto-update desabilitado: plataforma não suportada.");
    }
  };

  private createWindow() {
    this.win = new BrowserWindow({
      width: 700,
      height: 450,
      webPreferences: {
        preload: path.join(__dirname, "preload.js"),
        nodeIntegration: false,
        contextIsolation: true,
      },
    });
    this.win.loadFile(path.join(__dirname, "index.html"));
    this.win.on("close", (event) => {
      if (!this.isQuiting) {
        event.preventDefault();
        this.win?.hide();
      }
    });
  }

  private createTray() {
    this.tray = new Tray(path.join(__dirname, "./assets/icon.png"));
    const contextMenu = Menu.buildFromTemplate([
      { label: "Mostrar", click: () => this.win?.show() },
      { label: "Esconder", click: () => this.win?.hide() },
      {
        label: "Encerrar",
        click: () => {
          this.isQuiting = true;
          app.quit();
        },
      },
    ]);
    this.tray.setToolTip("MaterialApp");
    this.tray.setContextMenu(contextMenu);
    this.tray.on("click", () => this.win?.show());
  }

  private onAllClosed = () => {};

  private onActivate = () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      this.createWindow();
    }
  };
}

app.commandLine.appendSwitch("disable-features", "GTKTheme");
app.commandLine.appendSwitch("remote-debugging-port", "9222");
app.disableHardwareAcceleration();

// eslint-disable-next-line no-new
new MainApp();
